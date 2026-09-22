import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/request", label: "Request Blood" },
  ];

  if (user) {
    navLinks.push({ to: "/my-requests", label: "My Requests" });
    navLinks.push({ to: "/donors", label: "Find Donors" });
  }

  if (isAdmin) {
    navLinks.push({ to: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-lg">
              🩸
            </div>
            <span className="font-bold text-lg text-gray-900">
              Ctg<span className="text-red-600">Blood</span>Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname === link.to
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {profile?.full_name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isAdmin ? "👑 Admin" : "Member"}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-red-600 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2"
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
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
