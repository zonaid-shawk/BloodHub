import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import DonorListSection from "./components/DonorListSection";
import RegisterSection from "./components/RegisterSection";
import BloodRequestSection from "./components/BloodRequestSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <DonorListSection />
        <RegisterSection />
        <BloodRequestSection />
      </main>
      <Footer />
    </div>
  );
}
