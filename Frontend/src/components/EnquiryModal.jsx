import { useContext, useState } from "react";
import EnquiryContext from "../Context/Enquiry/EnquiryContext";

const EnquiryModal = ({ isOpen, onClose }) => {
  const { submitEnquiry, loading, error } = useContext(EnquiryContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await submitEnquiry(formData);

    if (res.success) {
      alert("Enquiry submitted successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Hostel Enquiry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
          />

          <textarea
            name="message"
            placeholder="Give Message In 50 Word  "
            rows="4"
            value={formData.message}
            onChange={handleChange}
            maxLength={50}
            minLength={0}
            className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
          />

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
