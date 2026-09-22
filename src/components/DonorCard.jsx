export default function DonorCard({ donor }) {
  const isEligible = checkEligibility(donor.last_donation_date);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Blood group badge */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">
              {donor.blood_group}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isEligible
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isEligible ? "✓ Eligible" : "Not Eligible"}
          </span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
          {donor.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-1">
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{donor.location || "Not specified"}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{donor.phone || "Not provided"}</span>
        </div>

        {donor.phone && isEligible && (
          <a
            href={`tel:${donor.phone}`}
            className="block w-full text-center bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            📞 Call Now
          </a>
        )}

        {!isEligible && (
          <button
            disabled
            className="block w-full text-center bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl cursor-not-allowed"
          >
            Not Available
          </button>
        )}
      </div>
    </div>
  );
}

function checkEligibility(lastDonationDate) {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate);
  const now = new Date();
  const diffDays = (now - last) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
}
