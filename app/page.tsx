import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { LearningTools } from "./components/LearningTools";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { WhatsAppWidget } from "./components/WhatsAppWidget";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center selection:bg-[#2866e1]/20 selection:text-[#0f172a] w-full">
      <Header />
      <Hero />
      <Features />
      <LearningTools />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
      <WhatsAppWidget />
    </main>
  );
}
