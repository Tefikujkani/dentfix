export type DentistProfile = {
  degree: string;
  education: string;
};

export const DENTIST_PROFILES: Record<string, DentistProfile> = {
  "Dr. Maya Chen": {
    degree: "DDS",
    education: "University of Michigan School of Dentistry",
  },
  "Dr. Julian Ortega": {
    degree: "DMD",
    education: "Boston University Henry M. Goldman School of Dental Medicine",
  },
  "Dr. Priya Shah": {
    degree: "DDS, MS",
    education: "University of Pennsylvania School of Dental Medicine",
  },
  "Dr. Elias Ward": {
    degree: "DDS, MS",
    education: "University of North Carolina Adams School of Dentistry",
  },
  "Dr. Hannah Cole": {
    degree: "DDS",
    education: "University of Southern California Herman Ostrow School of Dentistry",
  },
  "Dr. Noah Kim": {
    degree: "DMD",
    education: "Harvard School of Dental Medicine",
  },
};

export function getDentistProfile(name: string): DentistProfile {
  return (
    DENTIST_PROFILES[name] ?? {
      degree: "DDS",
      education: "Accredited dental school",
    }
  );
}
