import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorSearchPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get("blood_group") || "",
    location: searchParams.get("location") || "",
  });

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    // শুধু approved request দেখতে পারবে
    const { data: requests } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("requester_id", user.id)
      .eq("status", "approved");

    setApprovedRequests(requests || []);

    if (requests && requests.length > 0) {
      const { data: donorData } = await supabase
        .from("donors")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setDonors(donorData || []);
    }
    setLoading(false);
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (filters.bloodGroup && d.blood_group !== filters.bloodGroup)
        return false;
      if (
        filters.location &&
        !d.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      return isEligible(d.last_donation_date);
    });
  }, [donors, filters]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Access control: approved request না থাকলে দেখতে পারবে না
  if (approvedRequests.length === 0) {
    return (
      <div className="py-20 px-4 min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Access Restricted
          </h2>
          <p className="text-gray-500 mb-6">
            You need an approved blood request to view the donor list. This
            protects our donors' privacy.
          </p>
          <Link
            to="/request"
            className="inline-block bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-md transition"
          >
            Submit a Request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Donors</h1>
          <p className="text-gray-500">
            You have {approvedRequests.length} approved request
            {approvedRequests.length > 1 ? "s" : ""}. Search below.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                placeholder="Chattogram"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ bloodGroup: "", location: "" })}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {filteredDonors.length} matching donor
          {filteredDonors.length !== 1 ? "s" : ""}
        </p>

        {filteredDonors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No matching donors
            </h3>
            <p className="text-gray-500">Try changing your filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                      {donor.blood_group}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      ✓ Available
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {donor.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    📍 {donor.location}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">📞 {donor.phone}</p>
                  <a
                    href={`tel:${donor.phone}`}
                    className="block w-full text-center bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-md transition"
                  >
                    📞 Call Donor
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function isEligible(lastDate) {
  if (!lastDate) return true;
  const diff = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);
  return diff >= 90;
}
