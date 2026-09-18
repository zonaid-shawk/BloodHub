export default function PrintableReceipt({ receipt, onClose }) {
  if (!receipt) return null;

  const isDonor = receipt.type === "donor";
  const details = isDonor
    ? [
        ["Donor ID", receipt.id],
        ["Name", receipt.name],
        ["Email", receipt.email],
        ["Phone", receipt.phone],
        ["Blood Group", receipt.bloodGroup || receipt.blood_group],
        ["City", receipt.city],
        ["Age", receipt.age],
        ["Gender", receipt.gender],
        ["Address", receipt.address || "Not provided"],
        ["Last Donation", receipt.lastDonation || "Not provided"],
        ["Status", receipt.status || "Pending Approval"],
      ]
    : [
        ["Request ID", receipt.id],
        ["Patient Name", receipt.patientName],
        ["Email", receipt.email],
        ["Blood Group", receipt.bloodGroup],
        ["Hospital", receipt.hospital],
        ["City", receipt.city],
        ["Contact Number", receipt.contactNumber],
        ["Urgency", receipt.urgency],
        ["Units", receipt.units || "1"],
        ["Notes", receipt.notes || "Not provided"],
        ["Status", receipt.status || "Pending Approval"],
      ];

  return (
    <>
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print-hidden {
            display: none !important;
          }
          .receipt-card {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="receipt-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                {isDonor ? "Donor Registration" : "Blood Request"}
              </p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {isDonor ? "Confirmation Receipt" : "Request Receipt"}
              </h3>
            </div>

            <div className="print-hidden flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-[#021d2e] px-4 py-2 text-sm font-semibold text-white"
              >
                Print
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-700">
              {isDonor ? "Donor ID" : "Request ID"}
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900">{receipt.id}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            {isDonor
              ? "Your donor registration has been received and is currently under admin review. Please keep this ID for future donor verification."
              : "Your blood request has been received and is currently pending admin approval. Please keep this request ID for tracking and follow-up."}
          </div>
        </div>
      </section>
    </>
  );
}
