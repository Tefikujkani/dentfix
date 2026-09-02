import { HeartHandshake, ScanLine, Sparkles } from "lucide-react";

const PILLARS = [
  {
    icon: ScanLine,
    title: "You see the scan first",
    body: "We take pictures, pull them up on the screen, and walk through what we actually found.",
  },
  {
    icon: Sparkles,
    title: "The chair isn't the scary part",
    body: "Quiet rooms, extra time if you're nervous, and numbing that we don't rush.",
  },
  {
    icon: HeartHandshake,
    title: "Price before we start",
    body: "Starting fees are listed below. If anything changes after we look, we tell you first.",
  },
];

export function ClinicPromise() {
  return (
    <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6">
      <ul className="grid gap-4 rounded-[2rem] border border-white bg-navy p-4 text-white shadow-lift sm:grid-cols-3 sm:p-5">
        {PILLARS.map((pillar) => (
          <li key={pillar.title} className="rounded-[1.4rem] bg-white/5 p-5">
            <pillar.icon className="h-5 w-5 text-mint" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-6 text-sky-100/80">{pillar.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
