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
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const shippingCost = Number(envio) || 0;

    const subtotal = items.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0,
    );

    const total = subtotal + shippingCost;

    const newOrder = await Order.create({
      user: user._id,
      items: items.map((item) => ({
        product: item.product,
        sku: item.sku,
        name: item.name,
        image: item.image || "",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 0),
        attributes: {
          color: item.attributes?.color || "",
          model: item.attributes?.model || "",
          storage: item.attributes?.storage || "",
        },
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
        unit_price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
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
