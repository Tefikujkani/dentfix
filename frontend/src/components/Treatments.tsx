import { Clock } from "lucide-react";
import type { Service } from "@/lib/types";
import { Heading } from "./Heading";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Treatments({ services }: { services: Service[] }) {
  return (
    <section id="treatments" className="scroll-mt-24 bg-bg py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Heading lead="Simple Pricing" accent="for Every Smile" align="center" />
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-500">
          Starting prices. After we look, we tell you if anything changes — before we do the work.
        </p>
        <div className="mt-10 overflow-hidden rounded-[1.4rem] bg-white shadow-soft sm:mt-12">
          <ul className="divide-y divide-line">
            {services.map((service) => (
              <li key={service.id} className="px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1.4fr_0.8fr_auto] sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{service.name}</p>
                    <p className="mt-1 text-sm text-muted">{service.specialty}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:contents">
                    <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4 shrink-0 text-clinic" aria-hidden="true" />
                      {service.durationMinutes} minutes
                    </p>
                    <p className="text-lg font-semibold text-ink sm:text-right sm:text-xl">
                      {formatPrice(service.basePrice)}
                      <span className="ml-1 text-sm font-normal text-muted">from</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
