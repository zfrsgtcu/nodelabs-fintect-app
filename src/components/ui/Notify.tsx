"use client";

/**
 * Notification / alert system.
 * Uses react-toastify. Warnings, errors and info messages
 * are shown to the user via this API — use notify instead of console.log.
 *
 * Usage:
 *   import { notify } from "@/components/ui/Notify";
 *   notify.success("Registration successful");
 *   notify.error("Invalid password");
 *   notify.warning("Please fill in all fields");
 *   notify.info("Redirecting...");
 */
export { notify } from "@/lib/notify";
export type { NotifyOptions } from "@/lib/notify";
