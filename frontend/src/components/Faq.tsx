"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Heading } from "./Heading";

const ITEMS = [
  {
    q: "Does a checkup actually hurt?",
    a: "A regular cleaning shouldn't. If something's tender we'll slow down, numb the spot, and tell you before we do anything. You're allowed to stop us.",
  },
  {
    q: "How soon can I get in?",
    a: "We keep morning and afternoon openings most weekdays. Emergencies we try to see the same day. Book a time below and we'll email you to confirm.",
  },
  {
    q: "Do you take insurance?",
    a: "Yes — bring your card and we'll check benefits before we start. Starting prices are listed on this page so nothing's a surprise.",
  },
  {
    q: "What if I need a filling or a crown?",
    a: "We'll show you the scan, explain the options, and give you the number before we pick up a drill. You can think it over.",
  },
  {
    q: "Can I bring my kids?",
    a: "Please do. First visits are usually just a look-around and a cleaning. We don't force treatment on the first appointment.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Heading lead="Trusted Information" accent="for Better Smiles" align="center" />
        <ul className="mt-12 space-y-3">
          {ITEMS.map((item, index) => {
            const expanded = open === index;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  className={`flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left transition sm:gap-4 sm:px-5 sm:py-5 ${
                    expanded ? "bg-bg" : "bg-white hover:bg-slate-50"
                  }`}
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <span className="w-8 shrink-0 text-sm font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-balance text-base font-semibold leading-snug text-ink">{item.q}</span>
                    {expanded ? <span className="mt-2 block text-sm leading-6 text-slate-500">{item.a}</span> : null}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink">
                    {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
