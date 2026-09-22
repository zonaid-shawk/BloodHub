import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  fulfilled: "bg-blue-100 text-blue-700",
};

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("requester_id", user.id)
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-500 mt-1">Track your blood requests</p>
          </div>
          <Link
            to="/request"
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition"
          >
            + New Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No requests yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any blood requests.
            </p>
            <Link
              to="/request"
              className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition"
            >
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
                        {req.blood_group}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {req.patient_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {req.hospital}, {req.location}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-gray-500">
                      ID:{" "}
                      <span className="text-red-600 font-bold">
                        {req.request_code}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-gray-100 pt-4">
                  <div>
                    <div className="text-gray-500 text-xs">Units</div>
                    <div className="font-semibold">{req.units_needed}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Urgency</div>
                    <div className="font-semibold capitalize">
                      {req.urgency}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Contact</div>
                    <div className="font-semibold">{req.contact_phone}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Approved</div>
                    <div className="font-semibold">
                      {req.approved_at
                        ? new Date(req.approved_at).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>

                {req.admin_note && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-gray-700">
                      Admin note:
                    </span>{" "}
                    <span className="text-gray-600">{req.admin_note}</span>
                  </div>
                )}

                {req.status === "approved" && (
                  <Link
                    to={`/donors?blood_group=${req.blood_group}&location=${encodeURIComponent(req.location)}`}
                    className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
                  >
                    🔍 Find Matching Donors
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
