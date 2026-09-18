export default function Footer() {
  return (
    <footer className="mt-8 bg-[#021d2e] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 text-center md:grid-cols-2">
        <div>
          <p className="text-base font-bold text-[#f85a68] md:text-lg">
            Submitted by:
          </p>
          <p className="mt-4 text-xl font-black tracking-tight text-[#f85a68] md:text-2xl">
            MOHAMMAD ZONAID
          </p>
          <p className="mt-3 text-base font-semibold text-white md:text-lg">
            24150892010
          </p>
          <p className="mt-3 text-base font-medium text-white md:text-lg">
            3rd Semester
          </p>
          <p className="mt-3 text-base font-medium text-white md:text-lg">
            2023-2024
          </p>
          <p className="mt-3 text-base font-medium text-white md:text-lg">
            Term 251
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-base font-bold text-[#f85a68] md:text-lg">
            Supervised by:
          </p>
          <p className="mt-4 text-xl font-black tracking-tight text-[#f85a68] md:text-2xl">
            SANTOSH KUMAR SHUSHIL
          </p>
          <p className="mt-3 text-base font-semibold text-white md:text-lg">
            DEPARTMENT HEAD (CMT)
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 text-base font-bold md:text-lg">
            <img
              src="/diit logo.jpg"
              alt="Daffodil Institute of IT logo"
              className="h-10 w-10 rounded-md object-cover shadow-sm"
            />
            <span className="text-base font-semibold text-white md:text-xl">
              Daffodil Institute of IT, Chattogram
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
