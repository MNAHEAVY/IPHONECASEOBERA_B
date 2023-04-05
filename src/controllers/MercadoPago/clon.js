const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "ACCESS_TOKEN_HERE",
});

const createPreference = async (req, res) => {
  const { item } = req.body;

  const preference = {
    items: [
      {
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        currency_id: "ARS",
        unit_price: item.unit_price,
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
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.json({ preferenceId: response.body.id });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred while creating the preference.");
    });
};

const createFeedback = async (req, res) => {
  const { payment_id, status, merchant_order_id } = req.query;
  res.send(`
    <h1>Payment Information:</h1>
    <ul>
      <li>Payment ID: ${payment_id}</li>
      <li>Status: ${status}</li>
      <li>Merchant Order ID: ${merchant_order_id}</li>
    </ul>
  `);
};

module.exports = { createPreference, createFeedback };
