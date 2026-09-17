import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  name: "",
  phone: "",
  blood_group: "O+",
  district: "",
  availability: "Available",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Please add your environment variables.",
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("donors").insert([
      {
        name: form.name,
        phone: form.phone,
        blood_group: form.blood_group,
        district: form.district,
        availability: form.availability,
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/ctg-blood-hub-logo-HD.png"
              alt="CtgBloodHub logo"
              className="h-11 w-11 rounded-full object-cover shadow-sm"
            />
            <div>
              <p className="text-lg font-bold text-slate-900">CtgBloodHub</p>
              <p className="text-xs text-slate-500">Donate Blood, Save Lives</p>
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

      <main id="home">
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
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Full Name
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="01XXXXXXXXX"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Blood Group
                    <select
                      name="blood_group"
                      value={form.blood_group}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-400 focus:bg-white"
                    >
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    District
                    <input
                      type="text"
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      required
                      placeholder="Your district"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-400 focus:bg-white"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Availability
                  <select
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-400 focus:bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
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
                        {donor.district}
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
                      {donor.availability}
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
    </div>
  );
}

export default App;
