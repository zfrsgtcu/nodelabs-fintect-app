"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { headerAnimateMenuIn, headerAnimateMenuOut } from "@/assets/scripts/animations/header";
import SearchModal from "./SearchModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { logout as logoutApi } from "@/services";
import { clearToken } from "@/lib/auth-session";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/invoices": "Invoices",
  "/wallets": "My Wallets",
  "/settings": "Settings",
  "/help": "Help",
};

function getTitleFromPath(pathname: string): string {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  const first = `/${pathname.split("/").filter(Boolean)[0] ?? ""}`;
  if (TITLE_MAP[first]) return TITLE_MAP[first];
  if (!first || first === "/") return "Dashboard";
  return first.replace("/", "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const MOCK_NOTIFICATIONS = [
  { id: "1", text: "Your transfer request has been approved.", time: "2 hours ago" },
  { id: "2", text: "Your card has been updated successfully.", time: "Yesterday" },
  { id: "3", text: "Password change reminder.", time: "2 days ago" },
];

export default function DashboardHeader() {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const title = useMemo(() => getTitleFromPath(pathname), [pathname]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const profileListRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const notifListRef = useRef<HTMLDivElement | null>(null);

  const closeProfile = () => {
    headerAnimateMenuOut(profileListRef.current, () => setProfileOpen(false));
  };

  const closeNotif = () => {
    headerAnimateMenuOut(notifListRef.current, () => setNotifOpen(false));
  };

  useEffect(() => {
    if (profileOpen && profileListRef.current) headerAnimateMenuIn(profileListRef.current);
  }, [profileOpen]);

  useEffect(() => {
    if (notifOpen && notifListRef.current) headerAnimateMenuIn(notifListRef.current);
  }, [notifOpen]);

  useEffect(() => {
    function onDocPointerDown(e: MouseEvent) {
      if (profileRef.current?.contains(e.target as Node)) return;
      closeProfile();
    }
    document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, []);

  useEffect(() => {
    function onDocPointerDown(e: MouseEvent) {
      if (notifRef.current?.contains(e.target as Node)) return;
      closeNotif();
    }
    document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, []);

  const openLogoutModal = () => {
    closeProfile();
    setLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    if (!logoutLoading) setLogoutModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      await logoutApi();
    } finally {
      clearToken();
      setLogoutLoading(false);
      setLogoutModalOpen(false);
      router.push("/login");
    }
  };

  return (
    <>
      <header className="dashboard-header flex flex-row items-center justify-between gap-3 flex-wrap min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-dark font-kumbh-sans truncate">
          {title}
        </h1>

        <div className="flex flex-row items-center gap-3 sm:gap-6 shrink-0">
          <button
            type="button"
            className="cursor-pointer hover:text-slate-soft text-slate p-1 touch-manipulation"
            aria-label="Ara"
            onClick={() => setSearchOpen(true)}
          >
            <i className="icon-search text-[20px] sm:text-[24px]" aria-hidden />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="cursor-pointer hover:text-slate-soft text-slate p-1 touch-manipulation"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((v) => !v)}
            >
              <i className="icon-notification text-[20px] sm:text-[24px]" aria-hidden />
            </button>
            {notifOpen ? (
              <div
                ref={notifListRef}
                role="menu"
                aria-label="Notifications"
                className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200 opacity-0 z-[150]"
              >
                <div className="px-4 py-3 border-b border-gray-light">
                  <span className="text-sm font-semibold text-slate-dark font-kumbh-sans">Notifications</span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {MOCK_NOTIFICATIONS.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-slate font-kumbh-sans">No notifications.</p>
                  ) : (
                    MOCK_NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 border-b border-gray-light last:border-b-0 hover:bg-gray-light-soft"
                      >
                        <p className="text-sm text-slate-dark font-kumbh-sans">{n.text}</p>
                        <p className="text-xs text-slate mt-1 font-kumbh-sans">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="dashboard-header__profile cursor-pointer hover:bg-green-primary-soft bg-gray-light-soft rounded-[100px] touch-manipulation"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="py-[5px] pr-[10px] pl-[5px] sm:pr-[15px] sm:pl-[7px] flex items-center justify-between gap-2 sm:gap-3">
                <picture className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] rounded-full overflow-hidden flex-shrink-0">
                  <Image src="/images/profiles/profile2.png" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                </picture>
                <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold font-kumbh-sans text-slate-dark truncate hidden min-[480px]:inline">Mahfuzul Nabil</span>
                  <i className="icon-arrow-down text-[12px] sm:text-[15px] text-slate-dark flex-shrink-0" aria-hidden />
                </div>
              </div>
            </button>

            {profileOpen ? (
              <div
                ref={profileListRef}
                role="menu"
                aria-label="Profil menüsü"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200 opacity-0 z-[150]"
              >
                <Link
                  href="/settings"
                  role="menuitem"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-kumbh-sans"
                  onClick={closeProfile}
                >
                  Profile settings
                </Link>
                <Link
                  href="/help"
                  role="menuitem"
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-kumbh-sans"
                  onClick={closeProfile}
                >
                  Help
                </Link>
                <div className="h-px bg-slate-100" />
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-kumbh-sans"
                  onClick={openLogoutModal}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ConfirmModal
        open={logoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogoutConfirm}
        title="Çıkış yapmak istiyor musunuz?"
        message="Hesabınızdan güvenli bir şekilde çıkış yapacaksınız."
        confirmLabel="Evet"
        cancelLabel="Hayır"
        loading={logoutLoading}
      />
    </>
  );
}
