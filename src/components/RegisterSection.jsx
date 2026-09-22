import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  name: "",
  blood_group: "",
  phone: "",
  location: "",
  last_donation_date: "",
};

export default function RegisterSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.blood_group) e.blood_group = "Blood group is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Bangladeshi number (e.g. 01712345678)";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("donors").insert([
        {
          name: form.name.trim(),
          blood_group: form.blood_group,
          phone: form.phone.trim(),
          location: form.location.trim(),
          last_donation_date: form.last_donation_date || null,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Become a Donor
          </h2>
          <p className="text-gray-600">
            Register today and help someone in need tomorrow.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="font-medium">
                Registration successful! Thank you for joining.
              </span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahim Uddin"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    errors.blood_group ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.blood_group && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.blood_group}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 01712345678"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    errors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Chattogram"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    errors.location ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Donation Date (optional)
                </label>
                <input
                  type="date"
                  name="last_donation_date"
                  value={form.last_donation_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you have never donated before.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {submitting ? "Registering..." : "Register as Donor"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
