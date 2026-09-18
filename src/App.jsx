import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RegisterSection from "./components/RegisterSection";
import BloodRequestSection from "./components/BloodRequestSection";
import DonorListSection from "./components/DonorListSection";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import PrintableReceipt from "./components/PrintableReceipt";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  donor_number: "",
  name: "",
  email: "",
  phone: "",
  blood_group: "",
  age: "",
  gender: "",
  city: "",
  address: "",
  last_donation_date: "",
  availability: true,
  confirmation: false,
};

const cities = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Mymensingh",
  "Rangpur",
  "Cumilla",
  "Gazipur",
  "Chattogram City",
  "Cox's Bazar",
  "Comilla (Cumilla)",
  "Brahmanbaria",
  "Chandpur",
  "Feni",
  "Noakhali",
  "Lakshmipur",
  "Rangamati",
  "Bandarban",
  "Khagrachhari",
];

const generateDonorNumber = (sequenceNumber = 1) => {
  const currentYear = new Date().getFullYear();
  const formattedSequence = String(sequenceNumber).padStart(4, "0");
  return `BD${currentYear}${formattedSequence}`;
};

const getNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) {
    return new Date();
  }

  const date = new Date(lastDonationDate);
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 90);
  return nextDate;
};

const isEligibleToDonate = (lastDonationDate) => {
  if (!lastDonationDate) {
    return true;
  }

  const lastDonation = new Date(lastDonationDate);
  const diffDays =
    (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 90;
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [donors, setDonors] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchDonorId, setSearchDonorId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [hasDonorAccess, setHasDonorAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedId = window.localStorage.getItem("bloodhub_donor_id");
    return Boolean(storedId);
  });

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "name") {
      const sanitizedName = value.replace(/[^a-zA-Z\s.]/g, "");
      setForm((prev) => ({
        ...prev,
        name: sanitizedName,
      }));
      return;
    }

    if (name === "donor_number") {
      const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const digitsAfterPrefix = sanitizedValue.replace(/^BD/, "").slice(0, 6);
      const normalizedValue = digitsAfterPrefix ? `BD${digitsAfterPrefix}` : "";

      setForm((prev) => ({
        ...prev,
        donor_number: normalizedValue,
      }));
      return;
    }

    if (name === "phone") {
      const sanitizedPhone = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({
        ...prev,
        phone: sanitizedPhone,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const approvedDonors = useMemo(
    () =>
      donors.filter(
        (donor) => donor.status === "approved" || donor.status === undefined,
      ),
    [donors],
  );

  const filteredDonors = useMemo(() => {
    if (filter === "All") return approvedDonors;
    return approvedDonors.filter((donor) => donor.blood_group === filter);
  }, [approvedDonors, filter]);

  const fetchDonors = async () => {
    if (!supabase) {
      setMessage(
        "Supabase credentials are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }

    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load donors: " + error.message);
      return;
    }

    const normalizedDonors = (data || []).map((donor) => ({
      ...donor,
      status: donor.status || "pending",
    }));

    setDonors(normalizedDonors);
  };

  const fetchBloodRequests = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setBloodRequests(data || []);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchBloodRequests();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedId = window.localStorage.getItem("bloodhub_donor_id");
    const approvedAccess =
      Boolean(storedId) &&
      donors.some(
        (donor) =>
          (donor.donor_number || donor.id) === storedId &&
          (donor.status === "approved" || donor.status === undefined),
      );

    setHasDonorAccess(approvedAccess);
  }, [donors]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Please add your environment variables.",
      );
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.blood_group ||
      !form.age ||
      !form.gender ||
      !form.city ||
      !form.confirmation
    ) {
      setMessage(
        "Please fill all required fields and confirm the health statement.",
      );
      return;
    }

    const donorNumberPattern = /^BD[A-Z0-9]{3,4}$/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!/^\d{11}$/.test(form.phone)) {
      setMessage("Phone number must be exactly 11 digits.");
      return;
    }

    if (
      form.last_donation_date &&
      !isEligibleToDonate(form.last_donation_date)
    ) {
      const nextEligible = getNextEligibleDate(form.last_donation_date);
      const formattedDate = nextEligible.toLocaleDateString("en-CA");
      setMessage(
        `You are not eligible to donate yet. Next eligible date: ${formattedDate}`,
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    let insertError = null;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidateDonorNumber = generateDonorNumber(
        donors.length + 1 + attempt,
      );
      if (!donorNumberPattern.test(candidateDonorNumber)) {
        continue;
      }

      const { error } = await supabase.from("donors").insert([
        {
          donor_number: candidateDonorNumber,
          name: form.name,
          email: form.email,
          phone: form.phone,
          blood_group: form.blood_group,
          age: Number(form.age),
          gender: form.gender,
          city: form.city,
          address: form.address || null,
          last_donation_date: form.last_donation_date || null,
          availability: form.availability,
          confirmation: form.confirmation,
        },
      ]);

      if (!error) {
        const newDonorRecord = {
          id: candidateDonorNumber,
          donor_number: candidateDonorNumber,
          name: form.name,
          email: form.email,
          phone: form.phone,
          blood_group: form.blood_group,
          age: Number(form.age),
          gender: form.gender,
          city: form.city,
          address: form.address || null,
          last_donation_date: form.last_donation_date || null,
          availability: form.availability,
          confirmation: form.confirmation,
          status: "pending",
        };

        setDonors((prev) => [newDonorRecord, ...prev]);
        setHasDonorAccess(false);
        setIsSubmitting(false);
        setForm(initialForm);
        setReceipt({
          type: "donor",
          id: candidateDonorNumber,
          name: form.name,
          email: form.email,
          phone: form.phone,
          bloodGroup: form.blood_group,
          city: form.city,
          age: Number(form.age),
          gender: form.gender,
          address: form.address || "Not provided",
          lastDonation: form.last_donation_date || "Not provided",
          status: "Pending Approval",
        });
        setMessage(
          "Blood donor registration successful. Awaiting admin approval.",
        );
        fetchDonors();
        return;
      }

      if (error.code !== "23505") {
        insertError = error;
        break;
      }
    }

    setIsSubmitting(false);

    if (insertError) {
      setMessage("Registration failed: " + insertError.message);
      return;
    }

    setMessage("Could not generate a unique donor number. Please try again.");
  };

  const handleApproveDonor = async (donorId) => {
    const targetDonor = donors.find(
      (donor) => donor.id === donorId || donor.donor_number === donorId,
    );

    if (!targetDonor) return;

    if (supabase) {
      await supabase
        .from("donors")
        .update({ status: "approved" })
        .eq(
          targetDonor.donor_number ? "donor_number" : "id",
          targetDonor.donor_number || donorId,
        );
    }

    setDonors((prev) =>
      prev.map((donor) =>
        donor.id === donorId || donor.donor_number === donorId
          ? { ...donor, status: "approved" }
          : donor,
      ),
    );

    if (typeof window !== "undefined") {
      const storedId = window.localStorage.getItem("bloodhub_donor_id");
      if (!storedId && targetDonor.donor_number) {
        window.localStorage.setItem(
          "bloodhub_donor_id",
          targetDonor.donor_number,
        );
      }
    }
  };

  const handleRejectDonor = async (donorId) => {
    const targetDonor = donors.find(
      (donor) => donor.id === donorId || donor.donor_number === donorId,
    );

    if (!targetDonor) return;

    if (supabase) {
      await supabase
        .from("donors")
        .update({ status: "rejected" })
        .eq(
          targetDonor.donor_number ? "donor_number" : "id",
          targetDonor.donor_number || donorId,
        );
    }

    setDonors((prev) =>
      prev.map((donor) =>
        donor.id === donorId || donor.donor_number === donorId
          ? { ...donor, status: "rejected" }
          : donor,
      ),
    );
  };

  const handleApproveRequest = async (requestId) => {
    if (supabase) {
      await supabase
        .from("blood_requests")
        .update({ status: "approved" })
        .eq("id", requestId);
    }

    setBloodRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "approved" } : request,
      ),
    );
  };

  const handleRejectRequest = async (requestId) => {
    if (supabase) {
      await supabase
        .from("blood_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);
    }

    setBloodRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "rejected" } : request,
      ),
    );
  };

  const handleRequestSubmitted = async (newRequest) => {
    const requestPayload = {
      ...newRequest,
      status: "pending",
    };

    if (supabase) {
      const { error } = await supabase
        .from("blood_requests")
        .insert([requestPayload]);

      if (!error) {
        setBloodRequests((prev) => [requestPayload, ...prev]);
        setReceipt({
          type: "request",
          ...requestPayload,
          status: "Pending Approval",
        });
        return;
      }
    }

    setBloodRequests((prev) => [requestPayload, ...prev]);
    setReceipt({
      type: "request",
      ...requestPayload,
      status: "Pending Approval",
    });
  };

  const handleSearchDonor = () => {
    const normalizedId = searchDonorId.trim().toUpperCase();
    if (!normalizedId) {
      setSearchResult(null);
      return;
    }

    const match = approvedDonors.find(
      (donor) =>
        (donor.donor_number || donor.id || "").toUpperCase() === normalizedId,
    );

    setSearchResult(match || null);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat text-slate-800"
      style={{ backgroundImage: "url('/bg 2.jpg')" }}
    >
      <Header />

      <main id="home" className="bg-slate-50/30">
        <HeroSection />
        {receipt ? (
          <PrintableReceipt receipt={receipt} onClose={() => setReceipt(null)} />
        ) : (
          <>
            <RegisterSection
              form={form}
              handleFieldChange={handleFieldChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              message={message}
              bloodGroups={bloodGroups}
              cities={cities}
            />
            <BloodRequestSection onRequestSubmitted={handleRequestSubmitted} />
          </>
        )}
        <AdminPanel
          donors={donors}
          requests={bloodRequests}
          onApproveDonor={handleApproveDonor}
          onRejectDonor={handleRejectDonor}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
        {hasDonorAccess && (
          <DonorListSection
            filteredDonors={filteredDonors}
            filter={filter}
            setFilter={setFilter}
            bloodGroups={bloodGroups}
            getNextEligibleDate={getNextEligibleDate}
            isEligibleToDonate={isEligibleToDonate}
            searchDonorId={searchDonorId}
            setSearchDonorId={setSearchDonorId}
            donorSearchResult={searchResult}
            onSearchDonor={handleSearchDonor}
          />
        )}
        {!hasDonorAccess && (
          <section className="mx-auto max-w-5xl px-6 pb-12">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 shadow-soft">
              Only registered donor ID holders can view eligible donors.
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
