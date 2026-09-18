export default function Header() {
  return (
    <div className="bg-white/70 backdrop-blur-sm">
      <header className="bg-white/70 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/ctg-blood-hub-logo-HD.png"
              alt="CtgBloodHub logo"
              className="h-11 w-11 rounded-full object-cover shadow-sm"
            />
            <div>
              <p className="text-lg font-bold text-slate-900">CtgBloodHub</p>
              <p className="text-xs text-slate-500">
                Register.Donate.Give Life
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="hover:text-red-600">
              Home
            </a>
            <a href="#register" className="hover:text-red-600">
              Register
            </a>
            <a href="#donors" className="hover:text-red-600">
              Donors
            </a>
          </nav>

          <a
            href="#register"
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Join as Donor
          </a>
        </div>
      </header>
    </div>
  );
}
