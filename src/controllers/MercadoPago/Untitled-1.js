const mercadopago = require("mercadopago");
const Order = require("../../models/orders");
const User = require("../../models/users");
const Values = require("../../src/models/values");
const Product = require("../../models/products");
const updateUserStats = require("../../utils/updateUserStats");

const { sendEmail } = require("../nodemailer/nodemailer");
const { orderConfirmation } = require("../templates/template");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

const getFinalPrice = (basePrice, values) => {
  return Math.round(
    (Number(basePrice) || 0) *
      (Number(values.dolarBlue) || 1) *
      (Number(values.profit) || 1) *
      (Number(values.mp) || 1),
  );
};

const createPreference = async (req, res) => {
  try {
    const { items, envio, payer } = req.body;

    const userId = payer?._id || payer?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const values = await Values.findOne();

    if (!values) {
      return res.status(404).json({ error: "Valores no encontrados" });
    }

    const shippingCost = Number(envio) || 0;

    const normalizedItems = items.map((item) => {
      const basePrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const finalUnitPrice = getFinalPrice(basePrice, values);
      const lineSubtotal = finalUnitPrice * quantity;

      return {
        product: item.product,
        sku: item.sku,
        name: item.name,
        image: item.image || "",
        price: finalUnitPrice,
        quantity,
        subtotal: lineSubtotal,
        attributes: {
          color: item.attributes?.color || "",
          model: item.attributes?.model || "",
          storage: item.attributes?.storage || "",
        },
      };
    });

    const subtotal = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const total = subtotal + shippingCost;

    const newOrder = await Order.create({
      user: user._id,
      items: normalizedItems,
      totals: {
        subtotal,
        shipping: shippingCost,
        total,
      },
      payment: {
        provider: "mercadopago",
        status: "pending",
      },
      status: "pending",
    });

    const preference = await mercadopago.preferences.create({
      items: normalizedItems.map((item) => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: "ARS",
      })),
      payer: {
        email: user.email,
      },
      shipments: {
        cost: shippingCost,
      },
      back_urls: {
        success: "https://iphonecaseobera.com/feedback?status=success",
        failure: "https://iphonecaseobera.com/feedback?status=failure",
        pending: "https://iphonecaseobera.com/feedback?status=pending",
      },
      auto_return: "approved",
      notification_url: "https://iphonecaseobera.com/api/payment/webhook",
      external_reference: newOrder._id.toString(),
      binary_mode: true,
    });

    return res.json({ preferenceId: preference.body.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando preferencia" });
  }
};

const mercadoPagoWebhook = async (req, res) => {
  try {
    const paymentId = req.query["data.id"];

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const payment = await mercadopago.payment.findById(paymentId);

    if (payment.body.status !== "approved") {
      return res.sendStatus(200);
    }

    const orderId = payment.body.external_reference;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.sendStatus(200);
    }

    if (order.payment.status === "paid") {
      return res.sendStatus(200);
    }

    order.payment.status = "paid";
    order.payment.transactionId = paymentId;
    order.status = "paid";

    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      const variant = product.variants.find((v) => v.sku === item.sku);

      if (!variant) {
        console.warn(
          `Variante no encontrada para product ${item.product} con sku ${item.sku}`,
        );
        continue;
      }

      variant.stock = Math.max(
        0,
        (Number(variant.stock) || 0) - (Number(item.quantity) || 0),
      );

      variant.available = variant.stock > 0;

      product.totalStock = product.variants.reduce(
        (acc, v) => acc + (Number(v.stock) || 0),
        0,
      );

      product.available = product.totalStock > 0;

      await product.save();
    }

    await updateUserStats(order.user);

    const user = await User.findById(order.user);

    if (user) {
      const template = orderConfirmation({
        products: order.items,
        address:
          `${user.address?.street_name || ""} ${user.address?.street_number || ""}`.trim(),
      });

      await sendEmail(user.email, "Compra Exitosa!!", template);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  createPreference,
  mercadoPagoWebhook,
};
