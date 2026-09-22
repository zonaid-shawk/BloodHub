import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white">
                🩸
              </div>
              <span className="font-bold text-lg text-white">
                Ctg<span className="text-red-500">Blood</span>Hub
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              A community-driven platform connecting blood donors with those in
              need across Chattogram.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/request" className="hover:text-red-500 transition">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-red-500 transition">
                  Become a Donor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 support@ctgbloodhub.com</li>
              <li>📞 +880 1XXX-XXXXXX</li>
              <li>📍 Chattogram, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          Developed By MOHAMMAD ZONAID, DCSA 3rd Semester. <br /> Supervised by
          SANTOSH KUMAR SHUSHIL, Head Of The Depatrment (CMT), Daffodil
          Institute Of IT (DIIT)
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          © {new Date().getFullYear()} CtgBloodHub. Built for academic purposes.
        </div>
      </div>
    </footer>
  );
}
