export type TimeSlot = {
  id: string;
  label: string;
  window: string;
  period: "morning" | "afternoon";
};

function formatLabel(id: string) {
  const [hours, minutes] = id.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function slot(id: string, period: TimeSlot["period"]): TimeSlot {
  const label = formatLabel(id);
  return { id, label, window: label, period };
}

export const SCHEDULE_SLOTS: TimeSlot[] = [
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

export function addDays(dateStr: string, days: number) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${nextMonth}-${nextDay}`;
}

export function weekdayName(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isSunday(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function slotHasPassed(dateStr: string, slotId: string) {
  if (dateStr > todayIsoDate()) return false;
  if (dateStr < todayIsoDate()) return true;
  const [hours, minutes] = slotId.split(":").map(Number);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
}

export function decorateSlots(dateStr: string, bookedIds: string[] = []) {
  const booked = new Set(bookedIds);
  const closed = isSunday(dateStr);
  return SCHEDULE_SLOTS.map((slot) => {
    const taken = booked.has(slot.id);
    const past = slotHasPassed(dateStr, slot.id);
    let reason: "booked" | "past" | "closed" | null = null;
    if (closed) reason = "closed";
    else if (taken) reason = "booked";
    else if (past) reason = "past";
    return { ...slot, available: !reason, reason };
  });
}

export function upcomingVisitDays(count = 12) {
  const days: string[] = [];
  let offset = 0;
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const start = `${today.getFullYear()}-${month}-${day}`;

  while (days.length < count && offset < 28) {
    const value = addDays(start, offset);
    if (!isSunday(value)) days.push(value);
    offset += 1;
  }
  return days;
}
