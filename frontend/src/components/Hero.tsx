import Image from "next/image";
import { WaveDivider } from "./WaveDivider";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[72vh] overflow-hidden sm:min-h-[88vh]">
      <Image
        src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=2000&q=80"
        alt="Patient smiling during a dental visit"
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />

      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:min-h-[88vh] sm:px-6 sm:pb-24 sm:pt-28 lg:justify-center lg:pb-28 lg:pt-32">
        <div className="hero-rise mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
            ].map((src) => (
              <img key={src} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <p className="text-xs font-medium text-white sm:text-sm">5,000+ satisfied clients</p>
        </div>

        <h1 className="hero-rise hero-rise-delay max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
          Strong Teeth
          <span className="mt-1 block accent text-4xl sm:text-5xl lg:text-7xl">Bright Smile</span>
        </h1>
        <p className="hero-rise hero-rise-more mt-4 max-w-md text-sm leading-7 text-white/85 sm:mt-5 sm:text-base">
          Checkups, whitening, implants, and same-day emergencies — without rushing you through it.
        </p>
        <div className="hero-rise hero-rise-more mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <a href="#booking" className="btn-primary w-full sm:w-auto">
            Book Appointment
          </a>
          <a href="#services" className="btn-secondary w-full sm:w-auto">
            Browse Service
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 text-white">
        <WaveDivider />
      </div>
    </section>
  );
}
