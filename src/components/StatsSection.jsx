import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableNow: 0,
    totalRequests: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // মোট ডোনার
      const { count: totalDonors } = await supabase
        .from("donors")
        .select("*", { count: "exact", head: true });

      // এলিজিবল ডোনার (৯০ দিন পার হয়েছে)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { count: availableNow } = await supabase
        .from("donors")
        .select("*", { count: "exact", head: true })
        .or(
          `last_donation_date.is.null,last_donation_date.lt.${ninetyDaysAgo.toISOString()}`,
        );

      // মোট রিকোয়েস্ট
      const { count: totalRequests } = await supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true });

      setStats({
        totalDonors: totalDonors || 0,
        availableNow: availableNow || 0,
        totalRequests: totalRequests || 0,
        loading: false,
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
      setStats((s) => ({ ...s, loading: false }));
    }
  };

  const statCards = [
    {
      label: "Total Donors",
      value: stats.totalDonors,
      icon: "🩸",
      color: "from-red-500 to-rose-600",
    },
    {
      label: "Available Now",
      value: stats.availableNow,
      icon: "✅",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Blood Requests",
      value: stats.totalRequests,
      icon: "🚨",
      color: "from-orange-500 to-amber-600",
    },
    {
      label: "Support",
      value: "24/7",
      icon: "💬",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Live Impact
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time statistics from our blood donation community
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-4`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                {stat.loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
