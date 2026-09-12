import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Services from "@/components/Services";
import EbookSection from "@/components/EbookSection";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Statement />
        <Services />
        <EbookSection />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
