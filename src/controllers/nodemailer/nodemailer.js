const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const CLIENT_ID =
  "269063367376-rovelsihhvac3q044soeq84sq6hhsj03.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground"; // Esta URL debe coincidir con la configuración de la Consola de Desarrolladores
const REFRESHTOKEN =
  "1//04BrxwLt5XMtrCgYIARAAGAQSNwF-L9IrRhMFoAgOVIvNlgqQ5eSVKe5BeclgEKwzQsqzjzjBnRihKK8LRnMMtst2PYwzyRvcxDc";

const myOAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI); //creating the settings with 3 params

myOAuth2Client.setCredentials({
  refresh_token: REFRESHTOKEN,
});

const accessToken = myOAuth2Client.getAccessToken();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "iphonecaseobera@gmail.com",
      type: "OAuth2",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESHTOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Use the transporter in the sendEmail function
const sendEmail = async (email, subject, textHTML) => {
  const transporter = createTransporter();

  try {
    let info = await transporter.sendMail({
      from: "iPhonecaseobera@gmail.com",
      to: email,
      subject: subject,
      html: textHTML,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    return error;
  }
};

module.exports = { nodemailer, sendEmail };
