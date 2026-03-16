import express from "express";
import { stripeWebhook } from "../controllers/stripeWebhookController.js";

const router = express.Router();

// Stripe requires RAW body
router.post("/stripe", stripeWebhook);

export default router;
