"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { useBreakpointCount } from "@/lib/use-breakpoint-count";
import { Heading } from "./Heading";

const PHOTOS: Record<string, string> = {
  "general-checkup": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  "whitening-cosmetics": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80",
  "implants-crowns": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
  "orthodontics-aligners": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
  "root-canal": "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&w=800&q=80",
  "emergency-care": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
};

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";

export function Services({ services }: { services: Service[] }) {
  const pageSize = useBreakpointCount();
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart((current) => Math.min(current, Math.max(0, services.length - pageSize)));
  }, [pageSize, services.length]);

  const visible = services.slice(start, start + pageSize);
  const canPrev = start > 0;
  const canNext = start + pageSize < services.length;

  return (
    <section id="services" className="scroll-mt-24 bg-bg py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading lead="Trusted Solutions" accent="for Every Smile" />
          <div className="flex shrink-0 gap-2 self-start sm:self-auto">
            <button
              type="button"
              className="press flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white disabled:opacity-40"
              disabled={!canPrev}
              onClick={() => setStart((value) => Math.max(0, value - 1))}
              aria-label="Previous services"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="press flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white disabled:opacity-40"
              disabled={!canNext}
              onClick={() => setStart((value) => Math.min(services.length - pageSize, value + 1))}
              aria-label="Next services"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <ul className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((service) => (
            <li key={service.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:p-6">
                <h3 className="text-lg font-semibold text-ink sm:text-xl">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{service.description}</p>
                <a href="#booking" className="press mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  View Detail
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-clinic text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
                <div className="relative mt-5 h-36 overflow-hidden rounded-2xl sm:h-40">
                  <Image
                    src={PHOTOS[service.id] ?? FALLBACK_PHOTO}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
