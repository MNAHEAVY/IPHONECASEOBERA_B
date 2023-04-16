const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-7181501143783555-040200-10d1bd2aae8c6d893fff84424e60a87b-170650346",
});

const createPreference = async (req, res) => {
  const { items } = req.body;

  let itemsMp = [];
  for (let item of items) {
    let itemObj = {
      id: item._id,
      name: item.nombre,
      quantity: item.quantity.toString(),
    };

    itemsMp.push(itemObj);
  }

  let total_value = 0;
  for (let itemV of items) {
    total_value = total_value + itemV.precio[0] * itemV.quantity;
  }

  const preferenceData = {
    items: [
      {
        title: "Mis productos",
        quantity: 1,
        unit_price: total_value * 400,
      },
    ],
    payer: {
      name: "Juan",
      surname: "Lopez",
      email: "user@email.com",
      phone: {
        area_code: "11",
        number: 4444 - 4444,
      },
      identification: {
        type: "DNI",
        number: "12345678",
      },
      address: {
        street_name: "Street",
        street_number: 123,
        zip_code: "5700",
      },
    },
    back_urls: {
      success: "https://iphonecaseobera.com/feedback",
      failure: "https://iphonecaseobera.com/feedback",
      pending: "https://iphonecaseobera.com/feedback",
    },
    auto_return: "approved",
    notification_url: "http://localhost:3001/webhooks",
    payment_methods: {},
    notification_url: "https://iphonecaseobera.com/payment",
    statement_descriptor: "IPHONECASEOBERA",
    external_reference: "plata que entra",
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

const createFeedback = async (req, res) => {
  const paymentId = req.query.payment_id;
  const status = req.query.status;
  const merchantOrderId = req.query.merchant_order_id;

  res.json({
    Payment: paymentId,
    Status: status,
    MerchantOrder: merchantOrderId,
  });
};

module.exports = { createPreference, createFeedback };
