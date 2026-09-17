import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  donor_number: "",
  name: "",
  email: "",
  phone: "",
  blood_group: "",
  age: "",
  gender: "",
  city: "",
  address: "",
  last_donation_date: "",
  availability: true,
  confirmation: false,
};

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
  "Chattogram City",
  "Cox's Bazar",
  "Comilla (Cumilla)",
  "Brahmanbaria",
  "Chandpur",
  "Feni",
  "Noakhali",
  "Lakshmipur",
  "Rangamati",
  "Bandarban",
  "Khagrachhari",
];

const getNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) {
    return new Date();
  }

  const date = new Date(lastDonationDate);
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 90);
  return nextDate;
};

const isEligibleToDonate = (lastDonationDate) => {
  if (!lastDonationDate) {
    return true;
  }

  const lastDonation = new Date(lastDonationDate);
  const diffDays =
    (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "name") {
      const sanitizedName = value.replace(/[^a-zA-Z\s.]/g, "");
      setForm((prev) => ({
        ...prev,
        name: sanitizedName,
      }));
      return;
    }

    if (name === "donor_number") {
      const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const digitsAfterPrefix = sanitizedValue.replace(/^BD/, "").slice(0, 6);
      const normalizedValue = digitsAfterPrefix ? `BD${digitsAfterPrefix}` : "";

      setForm((prev) => ({
        ...prev,
        donor_number: normalizedValue,
      }));
      return;
    }

    if (name === "phone") {
      const sanitizedPhone = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({
        ...prev,
        phone: sanitizedPhone,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredDonors = useMemo(() => {
    if (filter === "All") return donors;
    return donors.filter((donor) => donor.blood_group === filter);
  }, [donors, filter]);

  const fetchDonors = async () => {
    if (!supabase) {
      setMessage(
        "Supabase credentials are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }

    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load donors: " + error.message);
      return;
    }

    setDonors(data || []);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Please add your environment variables.",
      );
      return;
    }

    if (
      !form.donor_number ||
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.blood_group ||
      !form.age ||
      !form.gender ||
      !form.city ||
      !form.confirmation
    ) {
      setMessage(
        "Please fill all required fields and confirm the health statement.",
      );
      return;
    }

    const donorNumberPattern = /^BD[A-Z0-9]{3,4}$/i;
    if (!donorNumberPattern.test(form.donor_number)) {
      setMessage(
        "Donor number must start with BD and be 5 or 6 characters long.",
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!/^\d{11}$/.test(form.phone)) {
      setMessage("Phone number must be exactly 11 digits.");
      return;
    }

    if (
      form.last_donation_date &&
      !isEligibleToDonate(form.last_donation_date)
    ) {
      const nextEligible = getNextEligibleDate(form.last_donation_date);
      const formattedDate = nextEligible.toLocaleDateString("en-CA");
      setMessage(
        `You are not eligible to donate yet. Next eligible date: ${formattedDate}`,
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("donors").insert([
      {
        donor_number: form.donor_number.toUpperCase(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        blood_group: form.blood_group,
        age: Number(form.age),
        gender: form.gender,
        city: form.city,
        address: form.address || null,
        last_donation_date: form.last_donation_date || null,
        availability: form.availability,
        confirmation: form.confirmation,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      setMessage("Registration failed: " + error.message);
      return;
    }

    setForm(initialForm);
    setMessage("Blood donor registration successful!");
    fetchDonors();
  };

  return (
    <div
      className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat text-slate-800"
      style={{ backgroundImage: "url('/bg 2.jpg')" }}
    >
      <div className="bg-white/70 backdrop-blur-sm">
        <header className="bg-white/70 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/ctg-blood-hub-logo-HD.png"
                alt="CtgBloodHub logo"
                className="h-11 w-11 rounded-full object-cover shadow-sm"
              />
              <div>
                <p className="text-lg font-bold text-slate-900">CtgBloodHub</p>
                <p className="text-xs text-slate-500">
                  Register.Donate.Give Life
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#home" className="hover:text-red-600">
                Home
              </a>
              <a href="#register" className="hover:text-red-600">
                Register
              </a>
              <a href="#donors" className="hover:text-red-600">
                Donors
              </a>
            </nav>

            <a
              href="#register"
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Join as Donor
            </a>
          </div>
        </header>
      </div>

      <main id="home" className="bg-slate-50/30">
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Emergency Support
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Donate blood, save lives today.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Connect with nearby donors, help people in urgent need, and build
              a community ready to respond when every second matters.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#register"
                className="rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-red-500"
              >
                Register Now
              </a>
              <a
                href="#donors"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Find Donors
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-soft">
                <p className="text-2xl font-black text-red-600">300+</p>
                <p className="text-sm text-slate-500">Donors</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft">
                <p className="text-2xl font-black text-red-600">12k</p>
                <p className="text-sm text-slate-500">Units</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft">
                <p className="text-2xl font-black text-red-600">24/7</p>
                <p className="text-sm text-slate-500">Support</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-red-500 to-red-700 p-8 shadow-soft">
            <div className="rounded-[28px] bg-white/10 p-6 text-white backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-red-100">
                Quick Donation Stats
              </p>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-red-100">Available Donors</p>
                  <p className="mt-2 text-3xl font-black">128</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-red-100">Urgent Need</p>
                  <p className="mt-2 text-3xl font-black">O+</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-red-100">Response Time</p>
                  <p className="mt-2 text-3xl font-black">45 min</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="register" className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Register
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                Become a donor
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-5">
                  <label className="block text-[15px] font-semibold text-slate-700">
                    Donor Number <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="donor_number"
                      value={form.donor_number}
                      onChange={handleFieldChange}
                      required
                      maxLength={6}
                      placeholder="BD123"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base uppercase outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFieldChange}
                      required
                      placeholder="Enter your full name"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    Email <span className="text-red-500">*</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFieldChange}
                      required
                      placeholder="your@email.com"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFieldChange}
                      required
                      placeholder="017XXXXXXXX"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    Blood Group <span className="text-red-500">*</span>
                    <select
                      name="blood_group"
                      value={form.blood_group}
                      onChange={handleFieldChange}
                      required
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

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-[15px] font-semibold text-slate-700">
                      Age <span className="text-red-500">*</span>
                      <input
                        type="number"
                        name="age"
                        min="18"
                        max="65"
                        value={form.age}
                        onChange={handleFieldChange}
                        required
                        placeholder="18-65 years"
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                      />
                    </label>

                    <label className="block text-[15px] font-semibold text-slate-700">
                      Gender <span className="text-red-500">*</span>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleFieldChange}
                        required
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    City <span className="text-red-500">*</span>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleFieldChange}
                      required
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
                    Address
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleFieldChange}
                      placeholder="Your full address"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-[15px] font-semibold text-slate-700">
                    Last Donation Date
                    <input
                      type="date"
                      name="last_donation_date"
                      value={form.last_donation_date}
                      onChange={handleFieldChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>
                  <p className="text-sm text-slate-500">
                    Eligibility rule: donors must wait at least 90 days after
                    their last donation.
                  </p>

                  <label className="flex items-center gap-3 text-base font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={form.availability}
                      onChange={handleFieldChange}
                      className="h-5 w-5 accent-red-600"
                    />
                    I am available for blood donation
                  </label>

                  <label className="flex items-center gap-3 text-base font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="confirmation"
                      checked={form.confirmation}
                      onChange={handleFieldChange}
                      className="h-5 w-5 accent-red-600"
                    />
                    I confirm that I am healthy and eligible to donate blood
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#e96b4b] to-[#d44f4b] px-5 py-4 text-xl font-black text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Registering..." : "Register as Donor"}
                </button>

                {message && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
                Why donate?
              </p>
              <h2 className="mt-3 text-3xl font-black">
                A single donation can save up to three lives.
              </h2>

              <div className="mt-8 space-y-4 text-slate-200">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <p className="font-semibold text-white">Safe and easy</p>
                  <p className="mt-1 text-sm">
                    The donation process is quick, safe, and medically
                    supervised.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <p className="font-semibold text-white">Community impact</p>
                  <p className="mt-1 text-sm">
                    Every donor strengthens local emergency response and
                    hospital care.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <p className="font-semibold text-white">Repeat support</p>
                  <p className="mt-1 text-sm">
                    Regular donations help maintain a stable blood supply for
                    patients in need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="donors" className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
                Donors
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                Available blood donors
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("All")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === "All" ? "bg-red-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}
              >
                All
              </button>
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFilter(group)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === group ? "bg-red-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {donor.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {donor.city || "City not set"}
                      </p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                      {donor.blood_group}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Phone:</span>{" "}
                      {donor.phone}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Status:
                      </span>{" "}
                      {donor.availability ? "Available" : "Unavailable"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Eligibility:
                      </span>{" "}
                      {isEligibleToDonate(donor.last_donation_date)
                        ? "Eligible now"
                        : `Next eligible: ${getNextEligibleDate(donor.last_donation_date).toLocaleDateString("en-CA")}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 md:col-span-2 xl:col-span-3">
                No donors available yet. Be the first to register.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-8 bg-[#021d2e] px-6 py-10 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 text-center md:grid-cols-2">
          <div>
            <p className="text-base font-bold text-[#f85a68] md:text-lg">
              Submitted by:
            </p>
            <p className="mt-4 text-xl font-black tracking-tight text-[#f85a68] md:text-2xl">
              MOHAMMAD ZONAID
            </p>
            <p className="mt-3 text-base font-semibold text-white md:text-lg">
              24150892010
            </p>
            <p className="mt-3 text-base font-medium text-white md:text-lg">
              3rd Semester
            </p>
            <p className="mt-3 text-base font-medium text-white md:text-lg">
              2023-2024
            </p>
            <p className="mt-3 text-base font-medium text-white md:text-lg">
              Term 251
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-bold text-[#f85a68] md:text-lg">
              Supervised by:
            </p>
            <p className="mt-4 text-xl font-black tracking-tight text-[#f85a68] md:text-2xl">
              SANTOSH KUMAR SHUSHIL
            </p>
            <p className="mt-3 text-base font-semibold text-white md:text-lg">
              DEPARTMENT HEAD (CMT)
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 text-base font-bold md:text-lg">
              <img
                src="/diit logo.jpg"
                alt="Daffodil Institute of IT logo"
                className="h-10 w-10 rounded-md object-cover shadow-sm"
              />
              <span className="text-base font-semibold text-white md:text-xl">
                Daffodil Institute of IT, Chattogram
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
