import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RequestBloodPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patient_name: "",
    blood_group: "",
    units_needed: 1,
    hospital: "",
    location: "",
    contact_phone: "",
    urgency: "normal",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("blood_requests")
      .insert([{ ...form, requester_id: user.id }])
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(data);
      setForm({
        patient_name: "",
        blood_group: "",
        units_needed: 1,
        hospital: "",
        location: "",
        contact_phone: "",
        urgency: "normal",
        reason: "",
      });
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted!
          </h2>
          <p className="text-gray-500 mb-6">
            Your request is pending admin approval. You'll be able to see
            matching donors once approved.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Request ID
            </div>
            <div className="text-lg font-mono font-bold text-red-600">
              {success.request_code}
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/my-requests"
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-3 rounded-xl hover:shadow-md transition text-center"
            >
              View My Requests
            </Link>
            <button
              onClick={() => setSuccess(null)}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              New Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Request Blood
          </h1>
          <p className="text-gray-600">
            Submit a request. Once approved by admin, you'll be able to search
            matching donors.
          </p>
        </div>

        {!user && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-sm">
            ⚠️ You need to{" "}
            <Link to="/login" className="font-semibold underline">
              login
            </Link>{" "}
            to submit a request.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  required
                  value={form.patient_name}
                  onChange={(e) =>
                    setForm({ ...form, patient_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  required
                  value={form.blood_group}
                  onChange={(e) =>
                    setForm({ ...form, blood_group: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Units Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={form.units_needed}
                  onChange={(e) =>
                    setForm({ ...form, units_needed: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Urgency *
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) =>
                    setForm({ ...form, urgency: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital *
                </label>
                <input
                  required
                  value={form.hospital}
                  onChange={(e) =>
                    setForm({ ...form, hospital: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  required
                  value={form.contact_phone}
                  onChange={(e) =>
                    setForm({ ...form, contact_phone: e.target.value })
                  }
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason / Additional Notes
                </label>
                <textarea
                  rows="3"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !user}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition shadow-sm hover:shadow-md"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
