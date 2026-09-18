export default function Header() {
  return (
    <div className="bg-[#021d2e] text-white shadow-sm backdrop-blur-sm">
      <header className="bg-[#021d2e] shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="CtgBloodHub logo"
              className="h-11 w-11 rounded-full object-cover shadow-sm"
            />
            <div>
              <p className="text-lg font-bold text-white">CtgBloodHub</p>
              <p className="text-xs text-slate-300">
                Register.Donate.Give Life
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
            <a href="#home" className="transition hover:text-[#f85a68]">
              Home
            </a>
            <a href="#register" className="transition hover:text-[#f85a68]">
              Register
            </a>
            <a
              href="#request-blood"
              className="transition hover:text-[#f85a68]"
            >
              Request Blood
            </a>
          </nav>

          <a
            href="#register"
            className="rounded-full bg-[#f85a68] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e54d5c]"
          >
            Join as Donor
          </a>
        </div>
      </header>
    </div>
  );
}
