const axios = require("axios");

const url = "https://graph.facebook.com/v18.0/315280041662373/messages";
const accessToken =
  "EAAEbdJO3U0EBO0unklxQzD15hh6fVsw3DZAZAIvr9eqXDLkj95OoI9MYCXoqAEEOvNAdHkNopdAhZCBgr5mKJQVkZCkLSC1VBviCVNb4yPFKjkLXqduvONY4RRLOcFaLVwZBWoRcC2rAhRwHXG2rS1atl7tZAaHrLM67VquyWAsWnOQHMxyZCJnWL2PZC6fQ1sRAVlsagfeZC2puofoQJgC4M";

const data = {
  messaging_product: "whatsapp",
  to: "543755611592",
  type: "template",
  template: {
    name: "hello_world",
    language: {
      code: "en_US",
    },
  },
};

axios
  .post(url, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error.response.data);
  });
