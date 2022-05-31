require('dotenv').config();
const express = require("express");
const fs = require("fs");

const app = express();
const port = 9000;

// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.post("/callback", (req, res) => {
  const payload = req.body;

  fs.writeFile("payload.json", JSON.stringify(payload), (err) => {
    if (err) throw err;
  });

  const customerName = payload.data.attributes.metadata.customer_name;
  const customerTelephone = payload.data.attributes.metadata.customer_telephone;
  const skuCode = payload.data.attributes.sku_code;

  client.messages
    .create({
       body: `Hi ${customerName}! \n The item with SKU code: ${skuCode} is now back in stock 🎉. You can place an order right away here: https://commercelayer.io/developers. Cheers!`,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: `+${customerTelephone}`
     })
    .then(message => console.log("Message sent!", message))
    .catch(err => console.log("Error sending message", err));
  res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });