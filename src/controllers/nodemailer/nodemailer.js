// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const OAuth2 = google.auth.OAuth2;
// // Credenciales de OAuth 2.0
// const CLIENT_ID =
//   "269063367376-rovelsihhvac3q044soeq84sq6hhsj03.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";
// const REDIRECT_URI = "https://developers.google.com/oauthplayground"; // Esta URL debe coincidir con la configuración de la Consola de Desarrolladores
// const REFRESHTOKEN =
//   "1//04BZJvb0ORa1YCgYIARAAGAQSNwF-L9IrRjVJuEDbZR806O_RFXV7st5BfnmqMHlB0iIKxhnDVBO2r3LhjmE88iKnn46b3B3-5l0";

// const myOAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI); //creating the settings with 3 params

// myOAuth2Client.setCredentials({
//   refresh_token: REFRESHTOKEN,
// });

// const accessToken = myOAuth2Client.getAccessToken();

// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: "iphonecaseobera@gmail.com",
//     type: "OAuth2",
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESHTOKEN,
//     accessToken: accessToken,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const sendEmail = async (email, subject, textHTML) => {
//   try {
//     let info = await transporter.sendMail({
//       from: "iPhonecaseobera@gmail.com", // sender address
//       to: email, // list of receivers
//       subject: subject, // Subject line
//       html: textHTML, // html body
//     });
//     return info;
//   } catch (error) {
//     return error;
//   }
// };
// module.exports = { nodemailer, sendEmail };
