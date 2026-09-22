export default function HeroSection() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Emergency Support Available
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Donate blood, <br />
            <span className="text-red-100">save lives today.</span>
          </h1>

          <p className="text-lg md:text-xl text-red-50 mb-8 max-w-2xl">
            Connect with nearby donors, help people in urgent need, and build a
            community ready to respond when every second matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo("register")}
              className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join as Donor
            </button>
            <button
              onClick={() => scrollTo("donors")}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              Find Donors
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
