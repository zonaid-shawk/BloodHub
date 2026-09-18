import { useMemo, useState } from "react";

const ADMIN_PASSWORD = "admin123";

const statusClasses = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function AdminPanel({
  donors = [],
  requests = [],
  onApproveDonor,
  onRejectDonor,
  onApproveRequest,
  onRejectRequest,
}) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("bloodhub_admin_access") === "true";
  });
  const [password, setPassword] = useState("");
  const [donorFilter, setDonorFilter] = useState("all");
  const [requestFilter, setRequestFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const donorSummary = useMemo(() => {
    const total = donors.length;
    const pending = donors.filter((donor) => donor.status === "pending").length;
    const approved = donors.filter(
      (donor) => donor.status === "approved",
    ).length;
    const rejected = donors.filter(
      (donor) => donor.status === "rejected",
    ).length;

    return { total, pending, approved, rejected };
  }, [donors]);

  const requestSummary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((item) => item.status === "pending").length;
    const approved = requests.filter(
      (item) => item.status === "approved",
    ).length;
    const urgent = requests.filter(
      (item) => item.urgency === "Immediate" && item.status !== "rejected",
    ).length;

    return { total, pending, approved, urgent };
  }, [requests]);

  const filteredDonors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return donors.filter((donor) => {
      const matchesFilter =
        donorFilter === "all" ? true : donor.status === donorFilter;
      const searchText = [
        donor.name,
        donor.id,
        donor.blood_group,
        donor.city,
        donor.status,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [donors, donorFilter, searchTerm]);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesFilter =
        requestFilter === "all" ? true : request.status === requestFilter;
      const searchText = [
        request.patientName,
        request.id,
        request.bloodGroup,
        request.hospital,
        request.city,
        request.status,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [requests, requestFilter, searchTerm]);

  const unlockAdmin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("bloodhub_admin_access", "true");
      }
      return;
    }

    window.alert("Incorrect admin password.");
  };

  const logoutAdmin = () => {
    setIsUnlocked(false);
    setPassword("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("bloodhub_admin_access");
    }
  };

  if (!isUnlocked) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d44f4b]">
            Admin Access
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">
            Admin Panel
          </h2>
          <p className="mt-3 text-slate-600">
            Use the admin password to review pending donor registrations and
            blood requests.
          </p>

          <div className="mt-6 max-w-md space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-[#d44f4b] focus:bg-white"
            />
            <button
              type="button"
              onClick={unlockAdmin}
              className="w-full rounded-2xl bg-[#021d2e] px-5 py-3 text-base font-bold text-white transition hover:bg-[#032d47]"
            >
              Unlock Dashboard
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Demo password:{" "}
            <span className="font-semibold text-slate-700">admin123</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="admin-panel" className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d44f4b]">
            Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Smart Admin Panel
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            live operations
          </span>
          <button
            type="button"
            onClick={logoutAdmin}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Total Donors</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {donorSummary.total}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Pending Donors</p>
          <p className="mt-2 text-3xl font-black text-amber-600">
            {donorSummary.pending}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Approved Requests</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {requestSummary.approved}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Urgent Cases</p>
          <p className="mt-2 text-3xl font-black text-rose-600">
            {requestSummary.urgent}
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-2xl font-black text-slate-900">
              Donor Approvals
            </h3>
            <div className="flex gap-2">
              <select
                value={donorFilter}
                onChange={(event) => setDonorFilter(event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#d44f4b]"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search donor name, ID or city"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d44f4b]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredDonors.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No donor records match this view.
              </p>
            ) : (
              filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-slate-900">
                          {donor.name}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[donor.status] || statusClasses.pending}`}
                        >
                          {donor.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {donor.id || donor.donor_number} • {donor.blood_group} •{" "}
                        {donor.city}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {donor.phone} • {donor.age} yrs
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onApproveDonor(donor.id || donor.donor_number)
                        }
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onRejectDonor(donor.id || donor.donor_number)
                        }
                        className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-2xl font-black text-slate-900">
              Blood Requests
            </h3>
            <div className="flex gap-2">
              <select
                value={requestFilter}
                onChange={(event) => setRequestFilter(event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#d44f4b]"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No blood requests match this view.
              </p>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-slate-900">
                          {request.patientName}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[request.status] || statusClasses.pending}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {request.id} • {request.bloodGroup} • {request.hospital}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.city} • {request.urgency} • {request.units}{" "}
                        unit(s)
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onApproveRequest(request.id)}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectRequest(request.id)}
                        className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
