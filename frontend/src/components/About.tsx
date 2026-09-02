import Image from "next/image";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "5,000+", label: "Happy Patients" },
  { value: "12", label: "Expert Doctors" },
  { value: "14k+", label: "Successful Treatments" },
  { value: "4.9", label: "Patient Satisfaction" },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="pointer-events-none absolute top-16 left-[8%] hidden h-36 w-28 overflow-hidden rounded-2xl lg:block">
        <Image
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="pointer-events-none absolute top-10 right-[10%] hidden h-40 w-32 overflow-hidden rounded-2xl lg:block">
        <Image
          src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=400&q=80"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-sm font-medium text-clinic">About Us</p>
          <p className="mt-4 text-2xl leading-snug font-medium text-ink sm:text-3xl lg:text-4xl">
            We are dedicated to providing high-quality dental care tailored to your needs, combining advanced technology{" "}
            <span className="text-slate-400">with a compassionate approach to ensure healthy, confident smiles</span> for
            patients of all ages.
          </p>
          <a href="#booking" className="btn-primary mt-8">
            More About Us
          </a>
        </Reveal>
      </div>

      <ul className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-6 px-4 sm:mt-20 sm:gap-10 sm:px-6 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <li key={stat.label} className="text-center">
            <Reveal delay={index * 80}>
              <p className="text-4xl font-semibold tracking-tight text-ink">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
