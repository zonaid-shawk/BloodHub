const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchFilter({ filters, setFilters, onReset }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            value={filters.bloodGroup}
            onChange={(e) => handleChange("bloodGroup", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
          >
            <option value="">All Groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Chattogram"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleChange("availability", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
          >
            <option value="">All Donors</option>
            <option value="available">Available Now</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
