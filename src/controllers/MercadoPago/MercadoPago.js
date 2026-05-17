// const mercadopago = require("mercadopago");
// const Order = require("../../models/orders");
// const User = require("../../models/users");
// const Values = require("../../models/values");
// const Product = require("../../models/products");
// const updateUserStats = require("../../utils/updateUserStats");

// const { sendEmail } = require("../nodemailer/nodemailer");
// const { orderConfirmation } = require("../templates/template");

// mercadopago.configure({
//   access_token: process.env.MP_ACCESS_TOKEN,
// });
// //
// const getFinalPrice = (basePrice, values) => {
//   const base = Number(basePrice) || 0;
//   const dolar = Number(values.dolar) || 1;

//   // 1. Precio base en ARS
//   const precioARS = base * dolar;

//   // 2. Margen
//   const margen = precioARS / (Number(values.margen) || 1);

//   // 3. IVA
//   const iva = margen / (Number(values.iva) || 1);

//   // 4. Rentas
//   const rentas = iva / (Number(values.rentas) || 1);

//   // 5. Mercado Pago
//   const final = rentas / (Number(values.mp) || 1);

//   return Math.round(final);
// };

// // Crea una preferencia de pago en MercadoPago
// const createPreference = async (req, res) => {
//   try {
//     const { items, envio, payer } = req.body;

//     const userId = payer?._id || payer?.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     }

//     const values = await Values.findOne();

//     if (!values) {
//       return res.status(404).json({ error: "Valores no encontrados" });
//     }

//     const shippingCost = Number(envio) || 0;

//     const normalizedItems = items.map((item) => {
//       const basePrice = Number(item.price) || 0;
//       const quantity = Number(item.quantity) || 1;
//       const finalUnitPrice = getFinalPrice(basePrice, values);
//       const lineSubtotal = finalUnitPrice * quantity;

//       return {
//         product: item.product,
//         sku: item.sku,
//         name: item.name,
//         image: item.image || "",
//         price: finalUnitPrice,
//         quantity,
//         subtotal: lineSubtotal,
//         attributes: {
//           color: item.attributes?.color || "",
//           model: item.attributes?.model || "",
//           storage: item.attributes?.storage || "",
//         },
//       };
//     });

//     const subtotal = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
//     const total = subtotal + shippingCost;

//     const newOrder = await Order.create({
//       user: user._id,
//       items: normalizedItems,
//       totals: {
//         subtotal,
//         shipping: shippingCost,
//         total,
//       },
//       payment: {
//         provider: "mercadopago",
//         status: "pending",
//       },
//       status: "pending",
//     });

//     const preference = await mercadopago.preferences.create({
//       items: normalizedItems.map((items) => ({
//         title: items.name,
//         unit_price: items.price,
//         quantity: items.quantity,
//         currency_id: "ARS",
//       })),
//       payer: {
//         email: user.email,
//       },
//       shipments: {
//         cost: shippingCost,
//       },
//       back_urls: {
//         success: "https://iphonecaseobera.com/feedback?status=success",
//         failure: "https://iphonecaseobera.com/feedback?status=failure",
//         pending: "https://iphonecaseobera.com/feedback?status=pending",
//       },
//       auto_return: "approved",
//       notification_url: "https://iphonecaseobera.com/api/payment/webhook",
//       external_reference: newOrder._id.toString(),
//       binary_mode: true,
//     });

//     return res.json({ preferenceId: preference.body.id });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Error creando preferencia" });
//   }
// };
// const mercadoPagoWebhook = async (req, res) => {
//   try {
//     const paymentId = req.query["data.id"];

//     if (!paymentId) {
//       return res.sendStatus(200);
//     }

//     const payment = await mercadopago.payment.findById(paymentId);

//     if (payment.body.status !== "approved") {
//       return res.sendStatus(200);
//     }

//     const orderId = payment.body.external_reference;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.sendStatus(200);
//     }

//     if (order.payment.status === "paid") {
//       return res.sendStatus(200);
//     }

//     order.payment.status = "paid";
//     order.payment.transactionId = paymentId;
//     order.status = "paid";

//     await order.save();

//     for (const item of order.items) {
//       const product = await Product.findById(item.product);

//       if (!product) continue;

//       const variant = product.variants.find((v) => v.sku === item.sku);

//       if (!variant) {
//         console.warn(
//           `Variante no encontrada para product ${item.product} con sku ${item.sku}`,
//         );
//         continue;
//       }

//       variant.stock = Math.max(
//         0,
//         (Number(variant.stock) || 0) - (Number(item.quantity) || 0),
//       );

//       variant.available = variant.stock > 0;

//       product.totalStock = product.variants.reduce(
//         (acc, v) => acc + (Number(v.stock) || 0),
//         0,
//       );

//       product.available = product.totalStock > 0;

//       await product.save();
//     }

//     await updateUserStats(order.user);

//     const user = await User.findById(order.user);

//     if (user) {
//       const template = orderConfirmation({
//         products: order.items,
//         address:
//           `${user.address?.street_name || ""} ${user.address?.street_number || ""}`.trim(),
//       });

//       await sendEmail(user.email, "Compra Exitosa!!", template);
//     }

//     res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };
// module.exports = {
//   createPreference,
//   mercadoPagoWebhook,
// };

const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const mongoose = require("mongoose");
const Order = require("../../models/orders");
const User = require("../../models/users");
const Values = require("../../models/values");
const Product = require("../../models/products");
const updateUserStats = require("../../utils/updateUserStats");

const { sendEmail } = require("../nodemailer/nodemailer");
const { orderConfirmation } = require("../templates/template");

// Configuración del nuevo SDK v2 de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

// Helper de cálculo de precio final optimizado
const getFinalPrice = (basePrice, values) => {
  const base = Number(basePrice) || 0;
  const dolar = Number(values.dolar) || 1;
  const margen = Number(values.margen) || 1;
  const iva = Number(values.iva) || 1;
  const rentas = Number(values.rentas) || 1;
  const mp = Number(values.mp) || 1;

  // Evitar divisiones por cero implícitas y encadenamiento limpio
  const final = (base * dolar) / margen / iva / rentas / mp;

  return Math.round(final);
};

// 1. CREAR PREFERENCIA
const createPreference = async (req, res) => {
  try {
    const { items, envio, payer } = req.body;

    const userId = payer?._id || payer?.id;
    if (!userId) {
      return res.status(400).json({ error: "ID de usuario no provisto" });
    }

    // Busquedas en paralelo para ahorrar tiempo de respuesta
    const [user, values] = await Promise.all([
      User.findById(userId).lean(),
      Values.findOne().lean(),
    ]);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (!values)
      return res.status(404).json({ error: "Valores base de costos no encontrados" });

    const shippingCost = Number(envio) || 0;

    const normalizedItems = items.map((item) => {
      const basePrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const finalUnitPrice = getFinalPrice(basePrice, values);

      return {
        product: item.product,
        sku: item.sku,
        name: item.name,
        image: item.image || "",
        price: finalUnitPrice,
        quantity,
        subtotal: finalUnitPrice * quantity,
        attributes: {
          color: item.attributes?.color || "",
          model: item.attributes?.model || "",
          storage: item.attributes?.storage || "",
        },
      };
    });

    const subtotal = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const total = subtotal + shippingCost;

    // Guardar orden inicial en la base de datos
    const newOrder = await Order.create({
      user: user._id,
      items: normalizedItems,
      totals: { subtotal, shipping: shippingCost, total },
      payment: { provider: "mercadopago", status: "pending" },
      status: "pending",
    });

    // Crear la preferencia con la estructura del SDK v2
    const preferenceResponse = await preferenceClient.create({
      body: {
        items: normalizedItems.map((item) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "ARS",
        })),
        payer: { email: user.email },
        shipments: { cost: shippingCost },
        back_urls: {
          success: "https://iphonecaseobera.com/feedback?status=success",
          failure: "https://iphonecaseobera.com/feedback?status=failure",
          pending: "https://iphonecaseobera.com/feedback?status=pending",
        },
        auto_return: "approved",
        notification_url: "https://iphonecaseobera.com/api/payment/webhook",
        external_reference: newOrder._id.toString(),
        binary_mode: true,
      },
    });

    return res.json({ preferenceId: preferenceResponse.id });
  } catch (error) {
    console.error("Error en createPreference:", error);
    return res.status(500).json({ error: "Error creando preferencia" });
  }
};

// 2. WEBHOOK (PROCESAR PAGO Y CONTROLAR STOCK)
const mercadoPagoWebhook = async (req, res) => {
  // 1. Responder rápido a Mercado Pago para evitar reintentos duplicados innecesarios
  res.sendStatus(200);

  const session = await mongoose.startSession();
  try {
    // Mercado Pago envía notificaciones por diferentes temas. Solo nos importa 'payment'.
    const { action, type, "data.id": dataId, id } = req.query;
    const paymentId = dataId || id;

    if (
      !paymentId ||
      (type !== "payment" && action !== "payment.created" && action !== "payment.updated")
    ) {
      return;
    }

    // Consultar el estado real del pago en la API de Mercado Pago
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") return;

    const orderId = payment.external_reference;
    if (!orderId) return;

    // Iniciar Transacción ACID para asegurar consistencia total
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);
    if (!order || order.payment.status === "paid") {
      await session.abortTransaction();
      return;
    }

    // Marcar orden como paga
    order.payment.status = "paid";
    order.payment.transactionId = paymentId.toString();
    order.status = "paid";
    await order.save({ session });

    // Descontar Stock de forma segura (Controlando concurrencia)
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) continue;

      const variant = product.variants.find((v) => v.sku === item.sku);
      if (!variant) continue;

      // Restar stock asegurando que no baje de 0
      variant.stock = Math.max(
        0,
        (Number(variant.stock) || 0) - (Number(item.quantity) || 0),
      );
      variant.available = variant.stock > 0;

      // Recalcular stock totales de la estructura del producto
      product.totalStock = product.variants.reduce(
        (acc, v) => acc + (Number(v.stock) || 0),
        0,
      );
      product.available = product.totalStock > 0;

      await product.save({ session });
    }

    // Confirmar todos los cambios de la transacción de forma atómica
    await session.commitTransaction();
    session.endSession();

    // Procesos en segundo plano post-pago (No interrumpen la transacción base)
    try {
      await updateUserStats(order.user);
      const user = await User.findById(order.user).lean();

      if (user) {
        const addressStr =
          `${user.address?.street_name || ""} ${user.address?.street_number || ""}`.trim();
        const template = orderConfirmation({
          products: order.items,
          address: addressStr || "Retiro en sucursal / No especificado",
        });

        await sendEmail(user.email, "¡Compra Exitosa!", template);
      }
    } catch (bgError) {
      console.error("Error en tareas secundarias post-pago (Email/Stats):", bgError);
    }
  } catch (error) {
    console.error("Error crítico en el Webhook de Mercado Pago:", error);
    if (session.withTransaction) {
      await session.abortTransaction();
    }
    session.endSession();
  }
};

module.exports = {
  createPreference,
  mercadoPagoWebhook,
};
