export function getTodayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
