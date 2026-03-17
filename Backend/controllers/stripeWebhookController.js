// stripeWebhookController.js
import Stripe from "stripe";
import HostelPayment from "../Models/HostelPayment.js";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const stripeWebhook = async (req, res) => {
  console.log("🔔 Stripe webhook received");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature
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

    // Make sure metadata exists
    if (!paymentIntent.metadata || !paymentIntent.metadata.paymentId) {
      console.error("❌ paymentId missing in metadata");
      console.log(
        "Webhook received PaymentIntent metadata:",
        paymentIntent.metadata,
      );
      return res.json({ received: true });
    }

    const paymentId = paymentIntent.metadata.paymentId;

    console.log("💰 PaymentIntent ID:", paymentIntent.id);
    console.log("📌 Mongo Payment ID:", paymentId);
    console.log(
      "Webhook received PaymentIntent metadata:",
      paymentIntent.metadata,
    );

    try {
      const updatedPayment = await HostelPayment.findByIdAndUpdate(
        paymentId,
        {
          status: "paid",
          paidAt: new Date(),
          stripePaymentIntentId: paymentIntent.id,
        },
        { new: true },
      );

      if (!updatedPayment) {
        console.error("❌ Payment not found in DB");
      } else {
        console.log("✅ Payment marked as PAID in DB");
      }
    } catch (err) {
      console.error("❌ Error updating payment in DB:", err.message);
    }
  }

  // Respond 200 OK to Stripe
  res.json({ received: true });
};
