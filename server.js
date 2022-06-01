require("dotenv").config();
const express = require("express");
const CryptoJS = require("crypto-js");
const hmacSHA256 = require("crypto-js/hmac-sha256");

const app = express();
const port = 9000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

app.post("/callback", (req, res) => {
  // Verify the payload coming from Commerce Layer
  const signature = req.headers["x-commercelayer-signature"];
  const hash = hmacSHA256(
    JSON.stringify(req.body),
    process.env.CL_SHARED_SECRET
  );
  const encode = hash.toString(CryptoJS.enc.Base64);
  if (req.method === "POST" && signature === encode) {
    const payload = req.body;

    // Send SMS with Twilio
    const customerName = payload.data.attributes.metadata.customer_name;
    const customerTelephone =
      payload.data.attributes.metadata.customer_telephone;
    const skuCode = payload.data.attributes.sku_code;

    client.messages
      .create({
        body: `Hi ${customerName}! \n The item with SKU code: ${skuCode} is now back in stock 🎉. You can place an order right away here: https://commercelayer.io/developers. Cheers!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+${customerTelephone}`,
      })
      .then((message) => console.log("Message sent!", message))
      .catch((err) => console.error("Error sending message", err));
    res.status(200).json({
      message: "Message sent to customer!",
    });
  } else {
    res.status(401).json({
      error: "Unauthorized: Invalid signature",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
