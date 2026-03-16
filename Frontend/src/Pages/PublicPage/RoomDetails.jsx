import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomContext from "../../Context/RoomContext/RoomContext";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import EnquiryModal from "../../components/EnquiryModal";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomById, room, loading } = useContext(RoomContext);

  const [selectedImage, setSelectedImage] = useState(0);

  const [open, setOpen] = useState(false);

  const handleSubmit = (data) => {
    console.log("Enquiry Data:", data);
    setOpen(false);
  };

  useEffect(() => {
    getRoomById(id);
    // eslint-disable-next-line
  }, [id]);

  if (loading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading room details...
      </div>
    );
  }

  // Combine cover + gallery images
  const allImages = [
    room.coverImage?.url || "/room-placeholder.jpg",
    ...(room.images?.map((img) => img.url) || []),
  ];

  const handlePrev = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage < allImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20">
      {/* Back Button */}
      <div className="px-6 md:px-20 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to rooms
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-20 py-10 grid gap-10 lg:grid-cols-2">
        {/* ================= LEFT: IMAGE SLIDER ================= */}
        <div>
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md group">
            <img
              src={allImages[selectedImage]}
              alt="Room Preview"
              className="w-full h-96 object-cover transition duration-300 ease-in-out group-hover:scale-105"
            />

            {/* Prev Button */}
            {selectedImage > 0 && (
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 dark:bg-black/60 p-3 rounded-full shadow hover:scale-110 transition"
              >
                <FaArrowCircleLeft />
              </button>
            )}

            {/* Next Button */}
            {selectedImage < allImages.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 dark:bg-black/60 p-3 rounded-full shadow hover:scale-110 transition"
              >
                <FaArrowCircleRight />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                onClick={() => setSelectedImage(index)}
                className={`h-20 w-28 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200
                  ${
                    selectedImage === index
                      ? "border-blue-600 scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:scale-105"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT: DETAILS ================= */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Room {room.roomNumber}
            </h1>

            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {room.status}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Block {room.block} • Floor {room.floor}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Info label="Capacity" value={room.capacity} />
            <Info label="Occupied" value={room.occupied} />
            <Info label="Price" value={`₹${room.price}`} />
            <Info label="Status" value={room.status} />
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Room Description
            </h2>

            <div
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: room.description || "<p>No description provided.</p>",
              }}
            />
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              className="w-full rounded-xl bg-blue-600 dark:bg-blue-700 px-6 py-3 text-white font-semibold transition hover:bg-blue-700 dark:hover:bg-blue-800 hover:scale-[1.02]"
              onClick={() => setOpen(true)}
            >
              Apply for this Room
            </button>
          </div>
        </div>
      </div>
      <EnquiryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

/* ================= SMALL INFO BLOCK ================= */

const Info = ({ label, value }) => (
  <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">
      {label}
    </p>
    <p className="text-lg font-semibold text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default RoomDetails;
