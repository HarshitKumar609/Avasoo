import express from "express";
import {
  createMonthlyPayment,
  getStudentPayments,
  markPaymentAsPaid,
  createStripePaymentIntent,
  getUpcomingPayments,
  getStudentPaymentHistory,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * ============================
 * PAYMENT ROUTES
 * ============================
 */

// Create monthly due (admin / cron)
router.post("/monthly", createMonthlyPayment);

// Create Stripe PaymentIntent (student pays)
router.post("/stripe/intent", createStripePaymentIntent);

// Get all payments for a student
router.get("/student/:studentId", getStudentPayments);

// (Optional) Manual mark paid (admin/testing)
router.patch("/mark-paid", markPaymentAsPaid);

router.get("/due-soon", getUpcomingPayments);

// Get payment history for a student
router.get("/student/history/:studentId", getStudentPaymentHistory);

export default router;
