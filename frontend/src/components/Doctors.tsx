"use client";

import { useState } from "react";
import Image from "next/image";
import type { Dentist } from "@/lib/types";
import { getDentistProfile } from "@/lib/dentist-profiles";
import { Heading } from "./Heading";

const PHOTOS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
];

const FALLBACK = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80";

function DoctorCard({ dentist, index, detailed }: { dentist: Dentist; index: number; detailed?: boolean }) {
  const profile = getDentistProfile(dentist.name);

  if (detailed) {
    return (
      <li className="overflow-hidden rounded-[1.4rem] bg-bg text-left shadow-soft">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={PHOTOS[index] ?? FALLBACK}
            alt={dentist.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-ink">{dentist.name}</h3>
          <p className="mt-1 break-words text-sm font-medium text-clinic">
            {profile.degree} · {dentist.specialty}
          </p>
          <p className="mt-2 text-sm text-muted">{profile.education}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{dentist.bio}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="text-center">
      <div className="relative mx-auto aspect-[3/4] max-h-80 overflow-hidden rounded-[1.4rem] bg-bg sm:aspect-[4/5] sm:max-h-none">
        <Image
          src={PHOTOS[index] ?? FALLBACK}
          alt={dentist.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{dentist.name}</h3>
      <p className="mt-1 text-sm text-muted">{dentist.specialty}</p>
    </li>
  );
}

export function Doctors({ dentists }: { dentists: Dentist[] }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="doctors" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Heading lead="Meet Our Expert" accent="Dental Team" align="center" />

        {!showAll ? (
          <ul className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {dentists.slice(0, 4).map((dentist, index) => (
              <DoctorCard key={dentist.id} dentist={dentist} index={index} />
            ))}
          </ul>
        ) : (
          <ul className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {dentists.map((dentist, index) => (
              <DoctorCard key={dentist.id} dentist={dentist} index={index} detailed />
            ))}
          </ul>
        )}

        <div className="mt-12 text-center">
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => setShowAll((value) => !value)}>
            {showAll ? "Show Less" : "View All Team"}
          </button>
        </div>
      </div>
    </section>
  );
}
