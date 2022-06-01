# cl-twilio-webhooks-demo

A minimal demo for sending an SMS notification to customers when an SKU that had finished is back in stock using Commerce Layer Webhooks and Twilio SMS. To get started, kindly read the comprehensive tutorial on [Commerce Layer's blog]().

---

Add your credentials in `.env`:

```bash
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
CL_SHARED_SECRET=""
```

Start the local server:

```bash
node server.js
```

Start a ngrok HTTP tunnel listening for HTTP/HTTPS traffic on port 9000:

```bash
ngrok http 9000
```

Create a new `in_stock_subscriptions.notify` webhook using the CLI:

```bash
cl webhooks:create \
   -n "Back In Stock Notifications" \
   -t "in_stock_subscriptions.notify" \
   -u "https://39cb-8-21-8-251.eu.ngrok.io/callback" \
   -i "sku"
```

Create a new stock subscription associated with some custom metadata (telephone number and customer name) and required relationships (market ID, customer’s ID, and SKU ID).

```bash
cl resources:create in_stock_subscriptions -m \
   customer_telephone="+12345678910" \
   customer_name="Bolaji Ayodeji" -r \
   market="VgKNLhKGBj" \
   customer="OwyehaRvJX" \
   sku="ZrxeSKVNRB
```
