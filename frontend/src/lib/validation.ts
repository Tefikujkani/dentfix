export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^\+?[0-9()\-\s.]{7,20}$/;

export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isPastDate(value: string) {
  return value < todayIsoDate();
}

export type FieldErrors = Record<string, string>;

export function validateBooking(values: {
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  dentist_id: string;
  date: string;
  time_slot: string;
}) {
  const errors: FieldErrors = {};

  if (values.full_name.trim().length < 2) {
    errors.full_name = "Please enter the patient's full name.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!values.service_type) {
    errors.service_type = "Select a treatment.";
  }
  if (!values.dentist_id) {
    errors.dentist_id = "Select a preferred dentist.";
  }
  if (!values.date) {
    errors.date = "Choose a preferred date.";
  } else if (isPastDate(values.date)) {
    errors.date = "Date cannot be in the past.";
  }
  if (!values.time_slot) {
    errors.time_slot = "Pick a time that is still open.";
  }

  return errors;
}
