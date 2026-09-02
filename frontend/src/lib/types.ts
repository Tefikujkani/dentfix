export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  specialty: string;
};

export type TimeSlot = {
  id: string;
  label: string;
  window: string;
  period?: "morning" | "afternoon";
  available?: boolean;
  reason?: "booked" | "past" | "closed" | "unavailable" | null;
};

export type Dentist = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  is_available: boolean;
};

export type AppointmentPayload = {
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  dentist_id: string;
  date: string;
  time_slot: string;
  notes?: string;
};

export type AppointmentResponse = {
  ok: boolean;
  error?: string;
  errors?: { field: string; message: string }[];
  appointment?: {
    id: string;
    status: string;
    date: string;
    time_slot: string;
    service_type: string;
    dentist: { name: string; specialty: string };
    patient: { full_name: string; email: string; phone: string };
  };
};

export type Review = {
  id: string;
  full_name: string;
  rating: number;
  message: string;
  created_at: string;
};

export type ReviewPayload = {
  full_name: string;
  rating: number;
  message: string;
};

export type ReviewResponse = {
  ok: boolean;
  error?: string;
  errors?: { field: string; message: string }[];
  review?: Review;
};
