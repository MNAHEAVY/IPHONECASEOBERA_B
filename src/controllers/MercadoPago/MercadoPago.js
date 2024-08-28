const Transaction = require("../../models/transactions");
const User = require("../../models/users");
const Products = require("../../models/products");

const { sendEmail } = require("../nodemailer/nodemailer");
const { orderConfirmation } = require("../templates/template");

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "TEST-6450638605574076-040316-09c7c84f769c76c9b8f90c3fadb00736-190374808",
});

const createPreference = async (req, res) => {
  const { items, envio, payer } = req.body;

  const shippingCost = parseFloat(envio);

  const itemsMp = items.map((item) => ({
    title: item.name,
    unit_price: item.price,
    quantity: item.quantity,
  }));

  const preferenceData = {
    items: itemsMp,
    payer: {
      name: payer.given_name,
      surname: payer.family_name,
      email: payer.email,
      phone: {
        area_code: "+549",
        number: payer.phone,
      },
    shipments: {
      cost: shippingCost,
      mode: "not_specified",
    },
    back_urls: {
      success: "https://iphonecaseobera.com/feedback",
      failure: "https://iphonecaseobera.com/failure",
      pending: "https://iphonecaseobera.com/pending",
    },
    auto_return: "approved",
    payment_methods: {},
    notification_url: "https://iphonecaseobera.com//payment",
    statement_descriptor: "IPHONECASEOBERA",
    external_reference: "pago realizado",
    expires: true,

    binary_mode: true,
  };

  mercadopago.preferences
    .create(preferenceData)
    .then((response) => {
      res.json({ preferenceId: response.body.id });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred while creating the preference.");
    });
};

//data renew sector & order
const paymentSucceded = async (req, res) => {
  const { items, payer } = req.body;
  const buyer_id = payer._id;
  const buyer = await User.findOne({ _id: buyer_id });

  const purchases = items.map((e) => e);
  const prod = [];

  for (let i = 0; i < purchases.length; i++) {
    const productId = purchases[i].product;
    prod.push(await Products.findById(productId));
  }

  const purchase_units = prod.map((e, i) => {
    return {
      quantity: purchases[i].quantity,
      status: "fulfilled",
      product: prod[i]._id,
      total_money: purchases[i].price * purchases[i].quantity,
    };
  });

  for (let i = 0; i < purchase_units.length; i++) {
    const newTransaction = new Transaction({
      transaction: purchase_units[i],
      buyer: buyer._id,
    });
    const savedTransact = await newTransaction.save();

    // Add purchases to user
    let products = [];
    items.map((el) =>
      products.push({
        product: el.product,
        quantity: el.quantity,
      })
    );

    await User.findByIdAndUpdate(
      { _id: buyer._id },
      {
        purchases: {
          products: products,
        },
      }
    );

    // Stock renew
    const publi = await Products.findOne({
      _id: purchase_units[i].product,
    });
    publi.stockGeneral -= purchase_units[i].quantity;
    publi.save();
  }

  // Send email confirmation
  const template = orderConfirmation({
    products: items.map((e, i) => {
      return {
        price: e.price,
        title: e.name,
        quantity: e.quantity,
        img: e.image,
        color: e.color,
      };
    }),
    address: buyer.address.street_name + " " + buyer.address.street_number,
  });

  sendEmail(buyer.email, "Compra Exitosa!!", template);

  // Send a response to the client if needed
  res.status(200).json({ message: "Purchase successful" });
};

module.exports = { createPreference, paymentSucceded };
