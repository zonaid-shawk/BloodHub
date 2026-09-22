import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import DonorCard from "./DonorCard";
import SearchFilter from "./SearchFilter";

export default function DonorListSection() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    availability: "",
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      if (filters.bloodGroup && donor.blood_group !== filters.bloodGroup)
        return false;
      if (
        filters.location &&
        !donor.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      if (filters.availability === "available") {
        const isEligible = checkEligibility(donor.last_donation_date);
        if (!isEligible) return false;
      }
      return true;
    });
  }, [donors, filters]);

  const handleReset = () => {
    setFilters({ bloodGroup: "", location: "", availability: "" });
  };

  return (
    <section id="donors" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Available Blood Donors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find a matching donor near you. Filter by blood group and location.
          </p>
        </div>

        <div className="mb-8">
          <SearchFilter
            filters={filters}
            setFilters={setFilters}
            onReset={handleReset}
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
            {error}
          </div>
        )}

        {!loading && !error && filteredDonors.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🩸</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No donors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}

        {!loading && !error && filteredDonors.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {filteredDonors.length} donor
              {filteredDonors.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function checkEligibility(lastDonationDate) {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate);
  const now = new Date();
  const diffDays = (now - last) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
}
