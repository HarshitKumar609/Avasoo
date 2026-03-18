import Activity from "../Models/Activity.js";

export const logActivity = async (text, type, userId, role) => {
  try {
    await Activity.create({
      text,
      type,
      user: userId,
      role,
      userModel: role === "admin" ? "Admin" : "Student",
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};
