import Header from "@/components/portada/Header";
import Hero from "@/components/portada/Hero";
import Manifesto from "@/components/portada/Manifesto";
import Specialties from "@/components/portada/Specialties";
import PregnancyWeeks from "@/components/portada/PregnancyWeeks";
import Journey from "@/components/portada/Journey";
import Moments from "@/components/portada/Moments";
import Booking from "@/components/portada/Booking";
import Questions from "@/components/portada/Questions";
import Footer from "@/components/portada/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";
import "./portada.css";

/* ?movimiento=completo muestra todas las animaciones aunque el sistema tenga
   activado "reducir movimiento" (útil para revisarlas). Se marca mientras se
   lee el HTML, antes del primer pintado, para que el CSS lo vea desde el
   inicio sin volver dinámica la página. */
const FORZAR_MOVIMIENTO = `if(new URLSearchParams(location.search).get("movimiento")==="completo")document.currentScript.parentElement.dataset.motion="full"`;

export default function Home() {
  return (
    <div className="rd" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: FORZAR_MOVIMIENTO }} />
      <StructuredData />
      <Header />
      <main id="main-content">
        <Hero />
        <Manifesto />
        <Specialties />
        <PregnancyWeeks />
        <Journey />
        <Moments />
        <Booking />
        <Questions />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
