export default function DonorListSection({
  filteredDonors,
  filter,
  setFilter,
  bloodGroups,
  getNextEligibleDate,
  isEligibleToDonate,
}) {
  return (
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
                  <span className="font-medium text-slate-700">Status:</span>{" "}
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
  );
}
