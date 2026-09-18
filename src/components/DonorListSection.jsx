export default function DonorListSection({
  filteredDonors,
  filter,
  setFilter,
  bloodGroups,
  getNextEligibleDate,
  isEligibleToDonate,
  searchDonorId,
  setSearchDonorId,
  donorSearchResult,
  onSearchDonor,
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

        <div className="flex w-full max-w-md items-center gap-2">
          <input
            type="text"
            value={searchDonorId}
            onChange={(event) => setSearchDonorId(event.target.value)}
            placeholder="Search donor ID"
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400"
          />
          <button
            type="button"
            onClick={onSearchDonor}
            className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Search
          </button>
        </div>
      </div>

      {donorSearchResult && (
        <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Matched donor
          </p>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">
                {donorSearchResult.name}
              </p>
              <p className="text-sm text-slate-600">
                {donorSearchResult.donor_number || donorSearchResult.id} •{" "}
                {donorSearchResult.blood_group} • {donorSearchResult.city}
              </p>
            </div>
            <div className="text-sm text-slate-700">
              <p>Phone: {donorSearchResult.phone}</p>
              <p>Email: {donorSearchResult.email || "Not provided"}</p>
            </div>
          </div>
        </div>
      )}

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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {donor.donor_number || "Auto ID"}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {donor.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {donor.city || "City not set"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {donor.blood_group}
                  </span>
                  <div
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${donor.availability ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                  >
                    {donor.availability ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Phone:</span>{" "}
                  {donor.phone}
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
