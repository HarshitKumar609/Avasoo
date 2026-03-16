import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiHome, FiImage, FiX } from "react-icons/fi";

import RoomContext from "../../../Context/RoomContext/RoomContext";
import AdminAuthContext from "../../../Context/AdminAuthContext/AdminAuthContext";

const ManageRoom = () => {
  const { token } = useContext(AdminAuthContext);
  const { rooms, loading, getAllRooms, createRoom, updateRoom, deleteRoom } =
    useContext(RoomContext);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    block: "",
    floor: "",
    capacity: "",
    price: "",
    description: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (token) getAllRooms(token);
  }, [token, getAllRooms]);

  const resetForm = () => {
    setEditingRoom(null);
    setForm({
      roomNumber: "",
      block: "",
      floor: "",
      capacity: "",
      price: "",
      description: "",
    });
    setCoverImage(null);
    setCoverPreview(null);
    setImages([]);
    setImagePreviews([]);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      capacity: room.capacity,
      price: room.price,
      description: room.description || "",
    });

    setCoverPreview(room.coverImage.url || null);

    const previews = room.images?.map((img) => img.url) || [];
    setImagePreviews(previews);

    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (coverImage) fd.append("coverImage", coverImage);
    images.forEach((img) => fd.append("images", img));

    const success = editingRoom
      ? await updateRoom(editingRoom._id, fd, token)
      : await createRoom(fd, token);

    if (success) {
      setShowModal(false);
      resetForm();
      getAllRooms(token);
    }
  };

  return (
    <div>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white text-slate-900">
              Manage Rooms
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create, edit and organize hostel rooms
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-indigo-600 hover:bg-indigo-700
                       text-white font-medium shadow-lg"
          >
            <FiPlus />
            Add Room
          </button>
        </div>

        {/* Content */}
        {loading && (
          <p className="text-center text-gray-500">Loading rooms...</p>
        )}

        {!loading && rooms?.length === 0 && (
          <p className="text-center text-gray-500">No rooms found</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <div
              key={room._id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900
                         border border-gray-200 dark:border-white/10
                         shadow-sm hover:shadow-lg transition"
            >
              {/* Cover */}
              <div className="relative h-44 bg-gray-200 dark:bg-gray-800">
                {room.coverImage ? (
                  <img
                    src={room.coverImage.url}
                    alt="Room"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FiImage size={40} />
                  </div>
                )}

                <span
                  className="absolute bottom-2 left-2 px-3 py-1 rounded-full
                                  bg-black/60 text-xs text-white"
                >
                  ₹{room.price}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiHome className="opacity-70" />
                  Room {room.roomNumber}
                </h3>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Block: {room.block}</p>
                  <p>Floor: {room.floor}</p>
                  <p>Capacity: {room.capacity}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => openEdit(room)}
                    className="flex-1 flex items-center justify-center gap-1
                               rounded-lg py-2
                               bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <FiEdit /> Edit
                  </button>

                  <button
                    onClick={() => deleteRoom(room._id, token)}
                    className="flex-1 flex items-center justify-center gap-1
                               rounded-lg py-2
                               bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
              className="relative w-full max-w-3xl rounded-3xl
                 bg-white dark:bg-gray-900
                 text-gray-900 dark:text-gray-100
                 shadow-2xl border border-gray-200 dark:border-white/10
                 animate-[fadeIn_0.25s_ease]"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-8 py-5
                      border-b border-gray-200 dark:border-white/10"
              >
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingRoom ? "Update Room" : "Create Room"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill in room details carefully
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl
                     hover:bg-gray-100 dark:hover:bg-white/10
                     transition"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* Body */}
              <form
                onSubmit={handleSubmit}
                className="px-8 py-6 space-y-6 max-h-[65vh] overflow-y-auto"
              >
                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Room Number"
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                  />
                  <Input
                    label="Block"
                    name="block"
                    value={form.block}
                    onChange={handleChange}
                  />
                  <Input
                    label="Floor"
                    type="number"
                    name="floor"
                    value={form.floor}
                    onChange={handleChange}
                  />
                  <Input
                    label="Capacity"
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                  <Input
                    label="Price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write something about the room..."
                    className="mt-1 w-full min-h-22.5 px-4 py-3 rounded-xl
                       bg-gray-50 dark:bg-gray-800
                       border border-gray-300 dark:border-white/10
                       focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Cover Image
                  </label>

                  <label
                    htmlFor="coverUpload"
                    className="flex flex-col items-center justify-center gap-2
                       h-36 rounded-2xl cursor-pointer
                       border-2 border-dashed
                       border-gray-300 dark:border-white/20
                       hover:border-indigo-500 dark:hover:border-indigo-400
                       bg-gray-50 dark:bg-gray-800
                       transition"
                  >
                    <FiImage size={28} className="opacity-60" />
                    <span className="text-sm opacity-70">
                      Click to upload cover image
                    </span>
                    <input
                      id="coverUpload"
                      type="file"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                  </label>

                  {coverPreview && (
                    <img
                      src={coverPreview}
                      className="h-36 rounded-xl object-cover"
                    />
                  )}
                </div>

                {/* Gallery Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Gallery Images
                  </label>

                  <label
                    htmlFor="galleryUpload"
                    className="flex items-center justify-center gap-2
                       h-28 rounded-2xl cursor-pointer
                       border-2 border-dashed
                       border-gray-300 dark:border-white/20
                       hover:border-indigo-500 dark:hover:border-indigo-400
                       bg-gray-50 dark:bg-gray-800
                       transition"
                  >
                    <FiPlus size={22} />
                    <span className="text-sm opacity-70">
                      Add multiple images
                    </span>
                    <input
                      id="galleryUpload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </label>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-20 rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="sticky bottom-0 bg-white dark:bg-gray-900
                        pt-6 flex justify-end gap-4"
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 rounded-xl
                       bg-gray-100 dark:bg-gray-800
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl
                       bg-indigo-600 hover:bg-indigo-700
                       text-white font-semibold
                       shadow-lg"
                  >
                    {editingRoom ? "Update Room" : "Create Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRoom;

/* ================= INPUT ================= */

const Input = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full px-4 py-2.5 rounded-xl
                 bg-gray-50 dark:bg-gray-800
                 border border-gray-300 dark:border-white/10
                 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  </div>
);
