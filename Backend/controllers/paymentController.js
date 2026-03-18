import mongoose from "mongoose";
import HostelPayment from "../Models/HostelPayment.js";
import stripe from "../config/stripe.js";
import RoomAllocation from "../Models/RoomAllocation.js";
import { logActivity } from "../utils/logActivity.js";

/**
 * ============================
 * CREATE MONTHLY PAYMENT (DUE)
 * ============================
 * Usually called by:
 * - cron job (monthly)
 * - admin action
 */
export const createMonthlyPayment = async (req, res) => {
  try {
    const { studentId, month, year } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    // Find active room allocation
    const allocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).populate("room", "price");

    if (!allocation) {
      return res.status(400).json({
        success: false,
        message: "Student has no active room allocation",
      });
    }

    // Prevent duplicate monthly bill
    const existingPayment = await HostelPayment.findOne({
      student: studentId,
      month,
      year,
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment for this month already exists",
      });
    }

    // Create payment
    const payment = await HostelPayment.create({
      student: studentId,
      room: allocation.room._id,
      amount: allocation.room.price,
      month,
      year,
      status: "due",
      dueDate: new Date(year, month - 1, 1), // <-- add this
    });

    //  ACTIVITY LOG
    await logActivity(
      `Payment generated: ${student.name} - ₹${payment.amount} (${month}/${year})`,
      "payment",
    );
    res.status(201).json({
      success: true,
      message: "Monthly payment created",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getUpcomingPayments = async (req, res) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead) || 7;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const payments = await HostelPayment.find({
      status: "due",
      dueDate: { $lte: futureDate },
    })
      .populate("student", "name email")
      .populate("room", "name price")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * ============================
 * GET STUDENT PAYMENTS
 * ============================
 */
export const getStudentPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId",
      });
    }

    const payments = await HostelPayment.find({ student: studentId }).sort({
      year: -1,
      month: -1,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * ============================
 * MARK PAYMENT AS PAID
 * ============================
 * (Used by Stripe webhook later)
 */
export const markPaymentAsPaid = async (req, res) => {
  try {
    const { paymentId, stripePaymentIntentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid paymentId",
      });
    }

    const payment = await HostelPayment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already marked as paid",
      });
    }

    payment.status = "paid";
    payment.paidAt = new Date();
    payment.stripePaymentIntentId = stripePaymentIntentId;

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment marked as paid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const createStripePaymentIntent = async (req, res) => {
  try {
    const { studentId, month, year } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(studentId) || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    // Get active allocation
    const allocation = await RoomAllocation.findOne({
      student: studentId,
      active: true,
    }).populate("room", "price");

    if (!allocation) {
      return res.status(400).json({
        success: false,
        message: "No active room allocation",
      });
    }

    // Find or create monthly payment
    let payment = await HostelPayment.findOne({
      student: studentId,
      month,
      year,
    });

    if (!payment) {
      payment = await HostelPayment.create({
        student: studentId,
        room: allocation.room._id,
        amount: allocation.room.price,
        month,
        year,
        status: "due",
      });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payment.amount * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        paymentId: payment._id.toString(),
        studentId: studentId.toString(),
        month,
        year,
      },
    });
    // 🔹 DEBUG LOG
    console.log(
      "Creating PaymentIntent with metadata:",
      paymentIntent.metadata,
    );
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Stripe payment failed",
    });
  }
};

//for payment hitory
/**
 * ============================
 * GET STUDENT PAYMENT HISTORY
 * ============================
 */
export const getStudentPaymentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId",
      });
    }

    // Find all payments for the student, sorted newest first
    const payments = await HostelPayment.find({ student: studentId })
      .populate("room", "name price") // include room details
      .sort({ year: -1, month: -1 });

    if (!payments.length) {
      return res.status(404).json({
        success: false,
        message: "No payment records found for this student",
      });
    }

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
