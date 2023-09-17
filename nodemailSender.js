const nodemailer = require("./src/controllers/nodemailer/nodemailer");
const { orderConfirmation } = require("./src/controllers/templates/template");

// orderConfirmation devuelva el template HTML con los siguientes datos
const template = orderConfirmation({
  id: "0238ry201t", // id de la orden de compra
  products: [
    {
      name: "Gioconda",
      amount: 3,
      price: `$${300}`, //precio total de los cuadros
    },
    {
      name: "4ta dimension",
      amount: 1,
      price: `$${500}`,
    },
  ],
  total_price: 800,
});

// sendEmail recibe los parametros Email, subject, y template
nodemailer.sendEmail("Buyer email", "Compra Exitosa!!", template);
