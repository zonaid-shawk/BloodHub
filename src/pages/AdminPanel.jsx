import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  fulfilled: "bg-blue-100 text-blue-700",
};

const urgencyStyles = {
  normal: "text-gray-600",
  urgent: "text-orange-600",
  critical: "text-red-600 font-bold",
};

export default function AdminPanel() {
  const [tab, setTab] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    donors: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [reqRes, donorRes] = await Promise.all([
      supabase
        .from("blood_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("donors")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    const reqs = reqRes.data || [];
    const dns = donorRes.data || [];
    setRequests(reqs);
    setDonors(dns);
    setStats({
      pending: reqs.filter((r) => r.status === "pending").length,
      approved: reqs.filter((r) => r.status === "approved").length,
      rejected: reqs.filter((r) => r.status === "rejected").length,
      donors: dns.length,
    });
    setLoading(false);
  };

  const updateStatus = async (requestId, status) => {
    const updates = {
      status,
      admin_note: adminNote || null,
    };
    if (status === "approved") updates.approved_at = new Date().toISOString();

    const { error } = await supabase
      .from("blood_requests")
      .update(updates)
      .eq("id", requestId);

    if (error) {
      alert("Error: " + error.message);
      return;
    }
    setSelectedRequest(null);
    setAdminNote("");
    fetchAll();
  };

  const filteredRequests = requests.filter((r) =>
    tab === "all" ? true : r.status === tab,
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👑 Admin Panel
          </h1>
          <p className="text-gray-500">Manage blood requests and donors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-3xl font-bold text-green-600">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-500 mt-1">Approved</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-500 mt-1">Rejected</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-3xl font-bold text-blue-600">
              {stats.donors}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Donors</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["pending", "approved", "rejected", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                tab === t
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800">
              No {tab !== "all" ? tab : ""} requests
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
                        {req.blood_group}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {req.patient_name}
                        </h3>
                        <div className="font-mono text-xs text-gray-500">
                          {req.request_code}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs">Hospital</div>
                        <div className="font-medium">{req.hospital}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Location</div>
                        <div className="font-medium">{req.location}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Contact</div>
                        <div className="font-medium">{req.contact_phone}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Urgency</div>
                        <div
                          className={`font-medium capitalize ${urgencyStyles[req.urgency]}`}
                        >
                          {req.urgency}
                        </div>
                      </div>
                    </div>
                    {req.reason && (
                      <p className="text-sm text-gray-500 mt-3 italic">
                        "{req.reason}"
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(req.created_at).toLocaleString()}
                    </div>
                    {req.status === "pending" && (
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-md transition"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Review Request
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Patient:</span>
                <span className="font-semibold">
                  {selectedRequest.patient_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Group:</span>
                <span className="font-semibold">
                  {selectedRequest.blood_group}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hospital:</span>
                <span className="font-semibold">
                  {selectedRequest.hospital}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="font-semibold">
                  {selectedRequest.contact_phone}
                </span>
              </div>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Note (optional)
            </label>
            <textarea
              rows="3"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Reason for approval/rejection..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(selectedRequest.id, "approved")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => updateStatus(selectedRequest.id, "rejected")}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
              >
                ✕ Reject
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminNote("");
                }}
                className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
