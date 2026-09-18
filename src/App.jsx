import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RegisterSection from "./components/RegisterSection";
import DonorListSection from "./components/DonorListSection";
import Footer from "./components/Footer";

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
  const [filter, setFilter] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

  const filteredDonors = useMemo(() => {
    if (filter === "All") return donors;
    return donors.filter((donor) => donor.blood_group === filter);
  }, [donors, filter]);

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

    setDonors(data || []);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Please add your environment variables.",
      );
      return;
    }

    if (
      !form.donor_number ||
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
    if (!donorNumberPattern.test(form.donor_number)) {
      setMessage(
        "Donor number must start with BD and be 5 or 6 characters long.",
      );
      return;
    }

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

    const { error } = await supabase.from("donors").insert([
      {
        donor_number: form.donor_number.toUpperCase(),
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

    setIsSubmitting(false);

    if (error) {
      setMessage("Registration failed: " + error.message);
      return;
    }

    setForm(initialForm);
    setMessage("Blood donor registration successful!");
    fetchDonors();
  };

  return (
    <div
      className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat text-slate-800"
      style={{ backgroundImage: "url('/bg 2.jpg')" }}
    >
      <Header />

      <main id="home" className="bg-slate-50/30">
        <HeroSection />
        <RegisterSection
          form={form}
          handleFieldChange={handleFieldChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          message={message}
          bloodGroups={bloodGroups}
          cities={cities}
        />
        <DonorListSection
          filteredDonors={filteredDonors}
          filter={filter}
          setFilter={setFilter}
          bloodGroups={bloodGroups}
          getNextEligibleDate={getNextEligibleDate}
          isEligibleToDonate={isEligibleToDonate}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
