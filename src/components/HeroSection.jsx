export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">
      <div>
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
          Emergency Support
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
          Donate blood, save lives today.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Connect with nearby donors, help people in urgent need, and build a
          community ready to respond when every second matters.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#register"
            className="rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-red-500"
          >
            Register Now
          </a>
          <a
            href="#donors"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Find Donors
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-2xl font-black text-red-600">300+</p>
            <p className="text-sm text-slate-500">Donors</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-2xl font-black text-red-600">12k</p>
            <p className="text-sm text-slate-500">Units</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-2xl font-black text-red-600">24/7</p>
            <p className="text-sm text-slate-500">Support</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-gradient-to-br from-red-500 to-red-700 p-8 shadow-soft">
        <div className="rounded-[28px] bg-white/10 p-6 text-white backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-red-100">
            Quick Donation Stats
          </p>
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-red-100">Available Donors</p>
              <p className="mt-2 text-3xl font-black">128</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-red-100">Urgent Need</p>
              <p className="mt-2 text-3xl font-black">O+</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-red-100">Response Time</p>
              <p className="mt-2 text-3xl font-black">45 min</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
