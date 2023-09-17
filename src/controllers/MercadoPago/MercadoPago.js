const Transaction = require("../../models/transactions");
const User = require("../../models/users");
const Products = require("../../models/products");

const { sendEmail } = require("../nodemailer/nodemailer");
const { orderConfirmation } = require("../templates/template");

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token:
    "APP_USR-7181501143783555-040200-10d1bd2aae8c6d893fff84424e60a87b-170650346",
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
      identification: {
        type: payer.identification.type,
        number: payer.identification.number.toString(),
      },
      address: {
        street_name: payer.address.street_name,
        street_number: payer.address.street_number,
        zip_code: payer.address.codigo_postal,
      },
    },
    shipments: {
      cost: shippingCost,
      mode: "not_specified",
    },
    back_urls: {
      success: "http://iphonecaseobera.com/feedback",
      failure: "http://iphonecaseobera.com/feedback",
      pending: "http://iphonecaseobera.com/feedback",
    },
    auto_return: "approved",
    payment_methods: {},
    notification_url: "https://iphonecaseobera.com/payment",
    statement_descriptor: "IPHONECASEOBERA",
    external_reference: "pago realizado",
    expires: true,

    binary_mode: true,
  };

  //data renew sector & order

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

    //add purchases
    let products = [];
    items.map((el) =>
      products.push({
        products: el.product,
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

    //Stock renew
    const publi = await Products.findOne({
      _id: purchase_units[i].product,
    });
    publi.stockGeneral -= purchase_units[i].quantity;
    publi.save();
  }

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
  console.log("tem:", template);
  sendEmail(buyer.email, "Succesfully buy", template);
  console.log("send:", sendEmail);
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

const createFeedback = async (req, res) => {
  const paymentId = req.query.payment_id;
  const status = req.query.status;
  const merchantOrderId = req.query.merchant_order_id;

  console.log("1", paymentId);
  console.log("2", status);
  console.log("3", merchantOrderId);

  res.json({
    Payment: paymentId,
    Status: status,
    MerchantOrder: merchantOrderId,
  });
};

module.exports = { createPreference, createFeedback };
