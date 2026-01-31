"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { validateName, validateEmail, validatePassword } from "@/components/ui/form/validation/auth-validation";
import { showSuccess, showError } from "@/utils/errorHandler";

type ThemeOption = "light" | "dark" | "system";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG and WebP are allowed.";
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File must be smaller than ${MAX_FILE_SIZE_MB}MB.`;
  }
  return undefined;
}

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Profile
  const [fullName, setFullName] = useState("Mahfuzul Nabil");
  const [email, setEmail] = useState("user@example.com");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const handleProfileImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      showError(err);
      e.target.value = "";
      return;
    }
    setProfileErrors((prev) => ({ ...prev, photo: "" }));
    const url = URL.createObjectURL(file);
    setProfilePreview(url);
  }, []);

  const validateProfile = useCallback((): boolean => {
    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);
    const next = {
      fullName: nameErr ?? "",
      email: emailErr ?? "",
    };
    setProfileErrors(next);
    return !nameErr && !emailErr;
  }, [fullName, email]);

  const handleProfileBlur = useCallback(
    (field: "fullName" | "email") => {
      if (field === "fullName") {
        const err = validateName(fullName);
        setProfileErrors((prev) => ({ ...prev, fullName: err ?? "" }));
      } else {
        const err = validateEmail(email);
        setProfileErrors((prev) => ({ ...prev, email: err ?? "" }));
      }
    },
    [fullName, email]
  );

  const handleProfileSubmit = useCallback(() => {
    if (!validateProfile()) return;
    showSuccess("Profile updated.");
  }, [validateProfile]);

  const validatePasswordForm = useCallback((): boolean => {
    const curErr = validatePassword(currentPassword, 1, "Current password is required.");
    const newErr = validatePassword(newPassword, 6, "New password must be at least 6 characters.");
    let confirmErr: string | undefined;
    if (!confirmPassword.trim()) {
      confirmErr = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      confirmErr = "Passwords do not match.";
    }
    setPasswordErrors({
      currentPassword: curErr ?? "",
      newPassword: newErr ?? "",
      confirmPassword: confirmErr ?? "",
    });
    return !curErr && !newErr && !confirmErr;
  }, [currentPassword, newPassword, confirmPassword]);

  const handlePasswordSubmit = useCallback(async () => {
    if (!validatePasswordForm()) return;
    setPasswordSubmitting(true);
    try {
      // Placeholder: no API for password change in case
      await new Promise((r) => setTimeout(r, 500));
      showSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch {
      showError("Failed to update password.");
    } finally {
      setPasswordSubmitting(false);
    }
  }, [validatePasswordForm]);

  return (
    <main data-page="settings-page" className="dashboard-main mt-[30px]">
      <section className="w-full max-w-2xl min-w-0 flex flex-col gap-6">
        {/* Profile */}
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Profile settings</h2>
          </div>
          <div className="card-border-content flex flex-col gap-6">
            <div className="flex flex-row items-center gap-4 flex-wrap">
              <div className="relative rounded-full overflow-hidden w-20 h-20 flex-shrink-0 bg-gray-light">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <Image src="/images/profiles/profile2.png" alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  aria-label="Upload profile photo"
                  onChange={handleProfileImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="settings-btn-primary"
                >
                  Change photo
                </button>
                <p className="text-xs text-slate font-kumbh-sans p-1">JPG, PNG, WebP. Max {MAX_FILE_SIZE_MB}MB.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (profileErrors.fullName) setProfileErrors((p) => ({ ...p, fullName: "" }));
                  }}
                  onBlur={() => handleProfileBlur("fullName")}
                  className={`border rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30 ${profileErrors.fullName ? "border-error" : "border-gray-light"}`}
                  aria-invalid={!!profileErrors.fullName}
                  aria-describedby={profileErrors.fullName ? "profile-fullName-error" : undefined}
                />
                {profileErrors.fullName && (
                  <span id="profile-fullName-error" className="text-sm text-error font-kumbh-sans" role="alert">
                    {profileErrors.fullName}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: "" }));
                  }}
                  onBlur={() => handleProfileBlur("email")}
                  className={`border rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30 ${profileErrors.email ? "border-error" : "border-gray-light"}`}
                  aria-invalid={!!profileErrors.email}
                  aria-describedby={profileErrors.email ? "profile-email-error" : undefined}
                />
                {profileErrors.email && (
                  <span id="profile-email-error" className="text-sm text-error font-kumbh-sans" role="alert">
                    {profileErrors.email}
                  </span>
                )}
              </label>
            </div>
            <button type="button" onClick={handleProfileSubmit} className="settings-btn-primary">
              Save profile
            </button>
          </div>
        </section>

        {/* Password */}
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Change password</h2>
          </div>
          <div className="card-border-content flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Current password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordErrors.currentPassword) setPasswordErrors((p) => ({ ...p, currentPassword: "" }));
                }}
                className={`border rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30 ${passwordErrors.currentPassword ? "border-error" : "border-gray-light"}`}
                aria-invalid={!!passwordErrors.currentPassword}
                aria-describedby={passwordErrors.currentPassword ? "pwd-current-error" : undefined}
                disabled={passwordSubmitting}
              />
              {passwordErrors.currentPassword && (
                <span id="pwd-current-error" className="text-sm text-error font-kumbh-sans" role="alert">
                  {passwordErrors.currentPassword}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-dark font-kumbh-sans">New password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordErrors.newPassword) setPasswordErrors((p) => ({ ...p, newPassword: "" }));
                  if (passwordErrors.confirmPassword && e.target.value !== confirmPassword) setPasswordErrors((p) => ({ ...p, confirmPassword: "Passwords do not match." }));
                  else if (passwordErrors.confirmPassword && e.target.value === confirmPassword) setPasswordErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                className={`border rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30 ${passwordErrors.newPassword ? "border-error" : "border-gray-light"}`}
                aria-invalid={!!passwordErrors.newPassword}
                aria-describedby={passwordErrors.newPassword ? "pwd-new-error" : undefined}
                disabled={passwordSubmitting}
              />
              {passwordErrors.newPassword && (
                <span id="pwd-new-error" className="text-sm text-error font-kumbh-sans" role="alert">
                  {passwordErrors.newPassword}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Confirm new password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors((p) => ({ ...p, confirmPassword: e.target.value !== newPassword ? "Passwords do not match." : "" }));
                  }
                }}
                onBlur={() => {
                  if (confirmPassword && newPassword !== confirmPassword) {
                    setPasswordErrors((p) => ({ ...p, confirmPassword: "Passwords do not match." }));
                  }
                }}
                className={`border rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30 ${passwordErrors.confirmPassword ? "border-error" : "border-gray-light"}`}
                aria-invalid={!!passwordErrors.confirmPassword}
                aria-describedby={passwordErrors.confirmPassword ? "pwd-confirm-error" : undefined}
                disabled={passwordSubmitting}
              />
              {passwordErrors.confirmPassword && (
                <span id="pwd-confirm-error" className="text-sm text-error font-kumbh-sans" role="alert">
                  {passwordErrors.confirmPassword}
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              className="settings-btn-primary mt-2 disabled:opacity-60 disabled:pointer-events-none"
              disabled={passwordSubmitting}
            >
              {passwordSubmitting ? "Updating…" : "Update password"}
            </button>
          </div>
        </section>

        {/* Theme */}
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Appearance</h2>
          </div>
          <div className="card-border-content">
            <p className="text-sm text-slate font-kumbh-sans mb-4">Choose light, dark, or follow your device.</p>
            <div className="flex flex-wrap gap-3">
              {(["light", "dark", "system"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  className={`settings-btn-theme ${theme === option ? "settings-btn-theme--active" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Notifications</h2>
          </div>
          <div className="card-border-content">
            <p className="text-sm text-slate font-kumbh-sans">
              Choose how you receive alerts for transfers, payments, and account activity. Options can be added here.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
