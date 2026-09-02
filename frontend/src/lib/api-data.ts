import type { Dentist, Service } from "./types";
import { SCHEDULE_SLOTS } from "./schedule";

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "general-checkup",
    name: "General Checkup & Cleaning",
    description: "Comprehensive exam, digital X-rays, and professional cleaning to keep your smile healthy.",
    durationMinutes: 45,
    basePrice: 120,
    specialty: "General Dentistry",
  },
  {
    id: "whitening-cosmetics",
    name: "Teeth Whitening & Cosmetics",
    description: "In-office whitening, bonding, and veneers for a brighter, more confident smile.",
    durationMinutes: 60,
    basePrice: 350,
    specialty: "Cosmetic Dentistry",
  },
  {
    id: "implants-crowns",
    name: "Dental Implants & Crowns",
    description: "Durable restorations that replace missing or damaged teeth with a natural look.",
    durationMinutes: 90,
    basePrice: 1450,
    specialty: "Prosthodontics",
  },
  {
    id: "orthodontics-aligners",
    name: "Orthodontics & Clear Aligners",
    description: "Discreet aligner therapy and braces to straighten teeth at any age.",
    durationMinutes: 50,
    basePrice: 280,
    specialty: "Orthodontics",
  },
  {
    id: "root-canal",
    name: "Root Canal Therapy",
    description: "Gentle endodontic treatment to relieve pain and save an infected tooth.",
    durationMinutes: 75,
    basePrice: 890,
    specialty: "Endodontics",
  },
  {
    id: "emergency-care",
    name: "Emergency Dental Care",
    description: "Same-day relief for toothache, trauma, broken restorations, and swelling.",
    durationMinutes: 40,
    basePrice: 195,
    specialty: "Emergency",
  },
];

export const FALLBACK_DENTISTS: Dentist[] = [
  {
    id: "maya-chen",
    name: "Dr. Maya Chen",
    specialty: "General Dentistry",
    bio: "Family dentist focused on preventive care and gentle checkups for all ages.",
    is_available: true,
  },
  {
    id: "julian-ortega",
    name: "Dr. Julian Ortega",
    specialty: "Cosmetic Dentistry",
    bio: "Whitening, veneers, and smile design with a conservative, natural aesthetic.",
    is_available: true,
  },
  {
    id: "priya-shah",
    name: "Dr. Priya Shah",
    specialty: "Prosthodontics",
    bio: "Implants and crowns that restore comfort, function, and confidence.",
    is_available: true,
  },
  {
    id: "elias-ward",
    name: "Dr. Elias Ward",
    specialty: "Orthodontics",
    bio: "Clear aligners and braces tailored to busy schedules and adult smiles.",
    is_available: true,
  },
  {
    id: "hannah-cole",
    name: "Dr. Hannah Cole",
    specialty: "Endodontics",
    bio: "Painless root canal therapy using modern rotary instruments and sedation options.",
    is_available: true,
  },
  {
    id: "noah-kim",
    name: "Dr. Noah Kim",
    specialty: "Emergency",
    bio: "Same-day emergency coverage for trauma, infection, and severe toothache.",
    is_available: true,
  },
];

export const FALLBACK_SLOTS = SCHEDULE_SLOTS;
