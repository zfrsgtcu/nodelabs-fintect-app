/**
 * Password strength: weak (red), medium (orange), strong (green).
 */

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  label: "Weak" | "Medium" | "Strong";
}

function countTypes(s: string): number {
  let n = 0;
  if (/[a-z]/.test(s)) n++;
  if (/[A-Z]/.test(s)) n++;
  if (/\d/.test(s)) n++;
  if (/[^a-zA-Z0-9]/.test(s)) n++;
  return n;
}

export function getPasswordStrength(value: string): PasswordStrength | null {
  const s = (value ?? "").trim();
  if (!s) return null;

  const len = s.length;
  const types = countTypes(s);

  if (len < 6 || types < 2) {
    return { level: "weak", label: "Weak" };
  }
  if (len >= 8 && types >= 3) {
    return { level: "strong", label: "Strong" };
  }
  return { level: "medium", label: "Medium" };
}
