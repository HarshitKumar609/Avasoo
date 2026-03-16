import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.Cloudinary_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} localFilePath
 * @param {string} folder
 * @returns { url, public_id } | null
 */
const uploadOnCloudinary = async (localFilePath, folder = "") => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload failed:", error.message);
    return null;
  }
};

/**
 * Delete image from Cloudinary using public_id
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error.message);
  }
};

/**
 * Replace an existing Cloudinary image
 * Deletes old image and uploads new one
 *
 * @param {string} oldPublicId
 * @param {string} newLocalFilePath
 * @param {string} folder
 * @returns { url, public_id } | null
 */
const replaceOnCloudinary = async (
  oldPublicId,
  newLocalFilePath,
  folder = "",
) => {
  try {
    if (!newLocalFilePath) return null;

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    const result = await cloudinary.uploader.upload(newLocalFilePath, {
      folder,
      resource_type: "image",
    });

    if (fs.existsSync(newLocalFilePath)) {
      fs.unlinkSync(newLocalFilePath);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(newLocalFilePath)) {
      fs.unlinkSync(newLocalFilePath);
    }

    console.error("Cloudinary replace failed:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, replaceOnCloudinary };
