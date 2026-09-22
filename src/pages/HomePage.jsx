import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: "🩸",
      title: "Register as Donor",
      desc: "Join our community of life-savers by registering your blood group and location.",
    },
    {
      icon: "🚨",
      title: "Request Blood",
      desc: "Submit an urgent blood request. Admins verify and connect you with matching donors.",
    },
    {
      icon: "🔒",
      title: "Privacy Protected",
      desc: "Donor information is only visible to approved requesters with a valid request ID.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Emergency Support Available 24/7
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Donate blood,
              <br />
              <span className="text-red-100">save lives today.</span>
            </h1>
            <p className="text-lg md:text-xl text-red-50 mb-8 max-w-2xl">
              Connect with nearby donors, help people in urgent need, and build
              a community ready to respond when every second matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/request"
                className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3.5 rounded-xl transition shadow-lg hover:shadow-xl text-center"
              >
                Request Blood
              </Link>
              <Link
                to={user ? "/donors" : "/signup"}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition text-center"
              >
                {user ? "Find Donors" : "Join as Donor"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A secure, verified system connecting patients with blood donors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-3xl mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Every drop counts. Every second matters.
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the Chattogram Blood Hub community today and be part of a
            life-saving network.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition"
            >
              Get Started — It's Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
