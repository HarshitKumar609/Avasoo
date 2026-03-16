import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import adminAuthRoute from "./routes/adminAuthRoute.js";
import roomRoute from "./routes/roomRoute.js";
import studentRoute from "./routes/studentRoute.js";
import allocationRoomRoute from "./routes/allocationRoomRoute.js";
import noticeRoute from "./routes/noticeRoute.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import stripeWebhookRoutes from "./routes/stripeWebhookRoutes.js";

dotenv.config({
  path: "./env",
});

connectToDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook — MUST be first
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  stripeWebhookRoutes,
);

// Middlewares
app.use(express.json());
app.use(cors());

// All the routes
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/student/auth", studentRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/allocations", allocationRoomRoute);
app.use("/api/notice", noticeRoute);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboardStatus", dashboardRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/payments", paymentRoutes);

// Test route

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running in port ${process.env.Port || 3000}`);
  console.log(`http://localhost:${process.env.Port || 3000}`);
});
