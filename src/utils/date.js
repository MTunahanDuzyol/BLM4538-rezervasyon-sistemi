export function toIsoDate(date) {
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}
