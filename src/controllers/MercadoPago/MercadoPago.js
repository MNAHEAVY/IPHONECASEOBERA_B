const mercadopago = require("mercadopago");
const Order = require("../../models/orders");
const User = require("../../models/users");
const Product = require("../../models/products");
const updateUserStats = require("../../utils/updateUserStats");

const { sendEmail } = require("../nodemailer/nodemailer");
const { orderConfirmation } = require("../templates/template");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});
// NS
const createPreference = async (req, res) => {
  try {
    const { items, envio, payer } = req.body;

    const user = await User.findById(payer._id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const shippingCost = Number(envio);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const total = subtotal + shippingCost;

    // 🔥 Crear orden en estado pending
    const newOrder = await Order.create({
      user: user._id,
      items: items.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
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
      items: items.map((item) => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
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

    res.json({ preferenceId: preference.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
};

const mercadoPagoWebhook = async (req, res) => {
  try {
    const paymentId = req.query["data.id"];

    if (!paymentId) return res.sendStatus(200);

    const payment = await mercadopago.payment.findById(paymentId);

    if (payment.body.status !== "approved") {
      return res.sendStatus(200);
    }

    const orderId = payment.body.external_reference;

    const order = await Order.findById(orderId);
    if (!order) return res.sendStatus(200);

    if (order.payment.status === "paid") {
      return res.sendStatus(200); // evitar duplicados
    }

    // 🔥 Actualizar orden
    order.payment.status = "paid";
    order.payment.transactionId = paymentId;
    order.status = "paid";

    await order.save();

    // 🔥 Actualizar stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockGeneral -= item.quantity;
        await product.save();
      }
    }

    // 🔥 Actualizar stats usuario
    await updateUserStats(order.user);

    // 🔥 Enviar email
    const user = await User.findById(order.user);

    const template = orderConfirmation({
      products: order.items,
      address: user.address.street_name + " " + user.address.street_number,
    });

    await sendEmail(user.email, "Compra Exitosa!!", template);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
module.exports = {
  createPreference,
  mercadoPagoWebhook,
};
