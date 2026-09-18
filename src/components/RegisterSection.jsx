export default function RegisterSection({
  form,
  handleFieldChange,
  handleSubmit,
  isSubmitting,
  message,
  bloodGroups,
  cities,
}) {
  return (
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
                Eligibility rule: donors must wait at least 90 days after their
                last donation.
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
              <p className="font-semibold text-white">Saves Lives</p>
              <p className="mt-1 text-sm">
                Human blood cannot be manufactured, and a single donation can
                save up to{" "}
                <span className="font-semibold text-white">three lives</span>.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">Supports Trauma Care</p>
              <p className="mt-1 text-sm">
                Provides critical, immediate lifelines for accident and disaster
                victims experiencing severe blood loss.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">Aids Chronic Illnesses</p>
              <p className="mt-1 text-sm">
                Supplies essential platelets and red blood cells for cancer
                patients undergoing chemotherapy.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">Enables Safe Surgeries</p>
              <p className="mt-1 text-sm">
                Ensures a stable backup supply for major operations and
                unexpected childbirth complications.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">
                Includes Free Health Checks
              </p>
              <p className="mt-1 text-sm">
                Offers donors a mini physical that tracks blood pressure, pulse,
                temperature, and hemoglobin levels.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">Manages Iron Levels</p>
              <p className="mt-1 text-sm">
                Reduces harmful iron stores in the blood, which can lower the
                risk of heart disease for regular donors.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="font-semibold text-white">
                Boosts Community Well-being
              </p>
              <p className="mt-1 text-sm">
                Delivers a powerful sense of purpose and fulfillment by directly
                serving neighbors in need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
