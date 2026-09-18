export default function Footer() {
  return (
    <footer className="mt-8 bg-[#021d2e] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f85a68]">
            Submitted by
          </p>

          <div className="mt-5 space-y-3">
            <p className="text-2xl font-black tracking-tight text-[#f85a68] md:text-3xl">
              MOHAMMAD ZONAID
            </p>
            <p className="text-base font-semibold text-slate-100 md:text-lg">
              ID: 24150892010
            </p>
            <div className="grid gap-2 pt-2 text-sm text-slate-200 md:text-base">
              <p>3rd Semester</p>
              <p>2023-2024</p>
              <p>Term 251</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f85a68]">
            Supervised by
          </p>

          <div className="mt-5 space-y-3">
            <p className="text-2xl font-black tracking-tight text-[#f85a68] md:text-3xl">
              SANTOSH KUMAR SHUSHIL
            </p>
            <p className="text-base font-semibold text-slate-100 md:text-lg">
              DEPARTMENT HEAD (CMT)
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-900/40 p-3">
              <img
                src="/diit logo.jpg"
                alt="Daffodil Institute of IT logo"
                className="h-12 w-12 rounded-xl object-cover shadow-sm"
              />
              <span className="text-sm font-medium text-slate-100 md:text-base">
                Daffodil Institute of IT, Chattogram
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
