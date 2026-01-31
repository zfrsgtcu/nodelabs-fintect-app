/**
 * Auth form validation helpers.
 * - name: letters and spaces only (no digits)
 * - email: valid email format
 * - password: min length
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Required / non-empty check */
export function validateRequired(
  value: string | boolean,
  message = "This field is required."
): string | undefined {
  if (typeof value === "boolean") return value ? undefined : message;
  return value?.trim() ? undefined : message;
}

/** Full name: letters and spaces only; no digits */
export function validateName(
  value: string | boolean,
  message = "Full name must contain only letters and spaces, no numbers."
): string | undefined {
  if (typeof value === "boolean") return message;
  const s = (value ?? "").trim();
  if (!s) return "This field is required.";
  if (/[0-9]/.test(s)) return message;
  if (!/^[\p{L}\p{M}\s\-']+$/u.test(s))
    return "Full name may only contain letters, spaces, hyphens and apostrophes.";
  return undefined;
}

/** Email format validation with clear messages */
export function validateEmail(
  value: string | boolean,
  message?: string
): string | undefined {
  if (typeof value === "boolean") return "Please enter a valid email address.";
  const s = (value ?? "").trim();
  if (!s) return "Email is required.";
  if (!s.includes("@")) return message ?? "Email must contain an @ symbol.";
  const [local, domain] = s.split("@");
  if (!local?.length) return message ?? "Email must have text before the @ symbol.";
  if (!domain?.length) return message ?? "Email must have a domain after the @ symbol.";
  if (!domain.includes(".")) return message ?? "Email must contain a valid domain (e.g. .com).";
  return EMAIL_REGEX.test(s) ? undefined : (message ?? "Please enter a valid email address (e.g. name@domain.com).");
}

/** Password: min length */
export function validatePassword(
  value: string | boolean,
  minLength = 6,
  message?: string
): string | undefined {
  if (typeof value === "boolean") return "This field is required.";
  const s = (value ?? "").trim();
  if (!s) return "This field is required.";
  if (s.length < minLength)
    return message ?? `Password must be at least ${minLength} characters.`;
  return undefined;
}
