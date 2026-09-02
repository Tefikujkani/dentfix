import { BookingForm } from "@/components/BookingForm";
import { About } from "@/components/About";
import { Doctors } from "@/components/Doctors";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Insights } from "@/components/Insights";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Treatments } from "@/components/Treatments";
import { fetchDentists, fetchServices } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ services, time_slots }, dentists] = await Promise.all([fetchServices(), fetchDentists()]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services services={services} />
        <Doctors dentists={dentists} />
        <Testimonials />
        <Treatments services={services} />
        <Faq />
        <Insights />
        <BookingForm services={services} dentists={dentists} timeSlots={time_slots} />
      </main>
      <Footer />
    </>
  );
}
