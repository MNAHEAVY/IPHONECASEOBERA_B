const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token:
    "TEST-8199423536684393-040508-2d50dbf655cb0414dba15efedce6419e-190374808",
});

const createPreference = async (req, res) => {
  const { items } = req.body;

  const preferenceData = {
    items: [
      {
        title: items.title,
        description: items.description,
        quantity: 1,
        currency_id: "ARS",
        unit_price: 200,
      },
    ],
    back_urls: {
      success: "http://localhost:5173/feedback",
      failure: "http://localhost:5173/feedback",
      pending: "http://localhost:5173/feedback",
    },
    auto_return: "approved",
    notification_url: "http://localhost:3001/webhooks",
    external_reference: "REFERENCE_ID_HERE",
    purpose: "wallet_purchase",
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
