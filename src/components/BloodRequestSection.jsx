import { useState } from "react";

const initialRequestForm = {
  patientName: "",
  email: "",
  bloodGroup: "",
  hospital: "",
  city: "",
  contactNumber: "",
  urgency: "",
  units: "1",
  notes: "",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const hospitals = [
  "Chattogram Medical College Hospital",
  "Holy Family Red Crescent Medical College Hospital",
  "Chattogram General Hospital",
  "Evercare Hospital Chattogram",
  "Bangladesh Specialized Hospital",
  "Other",
];
const cities = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Mymensingh",
  "Rangpur",
  "Cumilla",
  "Gazipur",
];
const urgencyLevels = ["Immediate", "Urgent", "Normal"];

export default function BloodRequestSection({ onRequestSubmitted }) {
  const [form, setForm] = useState(initialRequestForm);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      form.patientName,
      form.email,
      form.bloodGroup,
      form.hospital,
      form.city,
      form.contactNumber,
      form.urgency,
    ];

    if (requiredFields.some((field) => !field || !field.trim())) {
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    const newRequest = {
      id: `REQ-${String(Date.now()).slice(-6)}`,
      patientName: form.patientName,
      email: form.email,
      bloodGroup: form.bloodGroup,
      hospital: form.hospital,
      city: form.city,
      contactNumber: form.contactNumber,
      urgency: form.urgency,
      units: form.units || "1",
      notes: form.notes || "",
    };

    onRequestSubmitted?.(newRequest);
    setStatusMessage(
      "Blood request submitted successfully. It is now awaiting admin approval.",
    );
    setForm(initialRequestForm);
  };

  return (
    <section
      id="request-blood"
      className="mx-auto max-w-5xl px-6 py-8 md:py-12"
    >
      <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-soft backdrop-blur-sm md:p-8">
        <div className="mb-8 flex items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e74f42] text-xl text-white shadow-sm">
            ✚
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            Request Blood
          </h2>
        </div>

        <p className="mb-8 text-center text-lg text-slate-600">
          We&apos;ll help you find donors quickly
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-[15px] font-semibold text-slate-700">
            Patient Name <span className="text-red-500">*</span>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Patient's full name"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            />
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Email <span className="text-red-500">*</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            />
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Required Blood Group <span className="text-red-500">*</span>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Hospital Name <span className="text-red-500">*</span>
            <select
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            City <span className="text-red-500">*</span>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Contact Number <span className="text-red-500">*</span>
            <input
              type="tel"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            />
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Urgency Level <span className="text-red-500">*</span>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            >
              <option value="">Select Urgency</option>
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Units Required
            <input
              type="number"
              name="units"
              min="1"
              value={form.units}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            />
          </label>

          <label className="block text-[15px] font-semibold text-slate-700">
            Additional Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any special requirements..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
            />
          </label>

          {statusMessage && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-[#e96b4b] to-[#d44f4b] px-5 py-4 text-xl font-black text-white shadow-lg transition hover:opacity-95"
          >
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}
