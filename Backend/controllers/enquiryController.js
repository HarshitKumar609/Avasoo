import Enquiry from "../Models/Enquiry.js";

/**
 * 1️⃣ Submit Enquiry (Public)
 * POST /api/enquiries
 */
export const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "Name and phone or email is required",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Submit Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 2️⃣ Get All Enquiries (Admin)
 * GET /api/enquiries
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Enquiries Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 3️⃣ Update Enquiry Status (Admin)
 * PATCH /api/enquiries/:id/status
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const allowedStatus = [
      "new",
      "contacted",
      "visited",
      "confirmed",
      "rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        status,
        adminNote,
      },
      { new: true },
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      data: enquiry,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
