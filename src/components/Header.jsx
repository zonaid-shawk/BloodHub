import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const links = [
    { id: "donors", label: "Find Donors" },
    { id: "register", label: "Register" },
    { id: "requests", label: "Requests" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
              🩸
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ctg<span className="text-red-600">Blood</span>Hub
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("register")}
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-md transition"
            >
              Join Now
            </button>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
