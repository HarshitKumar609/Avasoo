import Notice from "../Models/Notice.js";

//....................notice controller functions will be here....................

export const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const notice = new Notice({
      title,
      message,
      createdBy: req.user.id, // ✅ FIX HERE
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: "Notice created",
      notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create notice" });
  }
};

//.............................get notice by Student...............................//

export const getAllNoticesbyUser = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notices });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch notices",
    });
  }
};

//....................get all the notices by admin ....................

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "user")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, totalNotices: notices.length, notices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch notices",
    });
  }
};

// controllers/noticecontroller.js

export const updateNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, message },
      { new: true },
    );

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({
      success: true,
      notice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notice" });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice" });
  }
};
