export function validateEmail(email: string): boolean {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-().]/g, '');
  // Accept + or 00 at the start for country code
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('00')) {
    cleaned = cleaned.slice(2);
  }
  // After removing country code, must be all digits and 7-15 digits
  return /^\d{7,15}$/.test(cleaned);
}
