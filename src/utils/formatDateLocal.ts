export function formatDateLocal(date: Date, type?: string) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  if (type === 'IT') {
    return `${d}/${m}/${y}`;
  }
  return `${y}-${m}-${d}`;
}
