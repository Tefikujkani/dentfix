function formatLabel(id) {
  const [hours, minutes] = id.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function slot(id, period) {
  const label = formatLabel(id);
  return { id, label, window: label, period };
}

export const TIME_SLOTS = [
  slot("09:00", "morning"),
  slot("09:30", "morning"),
  slot("10:00", "morning"),
  slot("10:30", "morning"),
  slot("11:00", "morning"),
  slot("11:30", "morning"),
  slot("13:00", "afternoon"),
  slot("13:30", "afternoon"),
  slot("14:00", "afternoon"),
  slot("14:30", "afternoon"),
  slot("15:00", "afternoon"),
  slot("15:30", "afternoon"),
  slot("16:00", "afternoon"),
  slot("16:30", "afternoon"),
];

export function todayLocalIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function isSunday(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

export function slotHasPassed(dateStr, slotId) {
  if (dateStr > todayLocalIsoDate()) return false;
  if (dateStr < todayLocalIsoDate()) return true;
  const [hours, minutes] = slotId.split(":").map(Number);
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= hours * 60 + minutes;
}

export function getTimeSlotById(id) {
  return TIME_SLOTS.find((item) => item.id === id) ?? null;
}
