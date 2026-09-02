export { TIME_SLOTS, getTimeSlotById } from "./schedule.js";

export const SERVICE_CATALOG = [
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

export function getServiceById(id) {
  return SERVICE_CATALOG.find((service) => service.id === id) ?? null;
}
