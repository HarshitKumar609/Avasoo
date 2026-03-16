export const stripeWebhook = async (req, res) => {
  console.log("🔔 Stripe webhook received");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Event type:", event.type);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.metadata.paymentId;

    console.log("💰 PaymentIntent ID:", paymentIntent.id);
    console.log("📌 Mongo Payment ID:", paymentId);

    if (!paymentId) {
      console.error("❌ paymentId missing in metadata");
      return res.json({ received: true });
    }

    const test = await HostelPayment.findByIdAndUpdate(paymentId, {
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntent.id,
    });
    console.log(test);
    console.log("✅ Payment marked as PAID in DB");
  }

  res.json({ received: true });
};
