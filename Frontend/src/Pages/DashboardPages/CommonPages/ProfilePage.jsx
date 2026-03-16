import React, { useState, useContext, useEffect } from "react";
import StudentAuthContext from "../../../Context/StudentAuthContext/StudentAuthContext";

const ProfilePage = () => {
  const { user, updateStudentProfile } = useContext(StudentAuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    parentName: "",
    parentPhone: "",
  });

  // =====================
  // LOAD USER DATA
  // =====================
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        course: user.course || "",
        parentName: user.parentName || "",
        parentPhone: user.parentPhone || "",
      });

      setPreview(user.profileImage || "");
    }
  }, [user]);

  // =====================
  // HANDLE INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // =====================
  // IMAGE CHANGE
  // =====================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================
  // SAVE PROFILE
  // =====================
  const handleSave = async () => {
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      if (key !== "email") {
        formData.append(key, value);
      }
    });

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    await updateStudentProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] p-6 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View and update your personal information
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#020617] rounded-xl shadow p-6 max-w-4xl transition-colors">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={
                preview ||
                "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="profileImage"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profileImage"
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                >
                  Change Photo
                </label>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Email"
                name="email"
                value={profile.email}
                disabled
              />

              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Course"
                name="course"
                value={profile.course}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Parent Name"
                name="parentName"
                value={profile.parentName}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Parent Phone"
                name="parentPhone"
                value={profile.parentPhone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* =======================
   Reusable Input
======================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg border
        bg-gray-50 dark:bg-[#020617]
        text-gray-800 dark:text-gray-100
        border-gray-300 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-60 transition-colors"
    />
  </div>
);
