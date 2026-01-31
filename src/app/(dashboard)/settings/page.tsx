"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type ThemeOption = "light" | "dark" | "system";

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

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
                  accept="image/*"
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
                <p className="text-xs text-slate font-kumbh-sans p-1">JPG, PNG. Max 2MB.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Full name</span>
                <input
                  type="text"
                  defaultValue="Mahfuzul Nabil"
                  className="border border-gray-light rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Email</span>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="border border-gray-light rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                />
              </label>
            </div>
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
                className="border border-gray-light rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-dark font-kumbh-sans">New password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-gray-light rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-dark font-kumbh-sans">Confirm new password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-gray-light rounded-lg px-3 py-2 text-sm text-slate-dark font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
              />
            </label>
            <button
              type="button"
              className="settings-btn-primary mt-2"
            >
              Update password
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
