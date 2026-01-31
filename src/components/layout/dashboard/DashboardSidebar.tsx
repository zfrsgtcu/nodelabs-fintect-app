"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { logout as logoutApi } from "@/services";
import { clearToken } from "@/lib/auth-session";

const navItems = [
  { href: "/dashboard", label: "Dashboard", iconClass: "icon-dashboard" },
  { href: "/transactions", label: "Transactions", iconClass: "icon-transactions" },
  { href: "/invoices", label: "Invoices", iconClass: "icon-invoices" },
  { href: "/wallets", label: "My Wallets", iconClass: "icon-wallet" },
  { href: "/settings", label: "Settings", iconClass: "icon-settings" },
] as const;

const sideFooterLinks = [{ href: "/help", label: "Help", iconClass: "icon-help" }] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname.startsWith(href);
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    <aside
      className="dashboard-sidebar"
      aria-label="Dashboard sidebar"
    >
      <header className="dashboard-sidebar__header flex-shrink-0 mb-[30px]">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          aria-label="Fintech - Go to dashboard"
        >
          <Image
            className="hidden min-[1280px]:block user-select-none drag-none pointer-events-none"
            src="/images/logo/logo.svg"
            alt=""
            width={107.31}
            height={30}
            aria-hidden
          />
          <i className="icon-fintech-logo text-[28px] min-[1280px]:hidden" aria-hidden />
        </Link>
      </header>
      <div className="flex flex-col flex-1 min-h-0 justify-between">
          <nav aria-label="Main navigation" className="flex-shrink-0">
            <ul className="flex flex-col gap-2" role="list">
              {navItems.map(({ href, label, iconClass }) => {
                const active = isActive(pathname ?? "", href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      title={label}
                    >
                      <i className={iconClass} aria-hidden />
                      <span className="sidebar-item-label">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <nav aria-label="Secondary navigation" className="flex-shrink-0 mt-auto">
              <ul className="flex flex-col gap-2" role="list">
                    {sideFooterLinks.map(({ href, label, iconClass }) => (
                        <li key={href}>
                          <Link href={href} title={label}>
                            <i className={iconClass} aria-hidden />
                            <span className="sidebar-item-label">{label}</span>
                          </Link>
                        </li>
                    ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(true)}
                    title="Logout"
                    className="sidebar-logout-button"
                  >
                    <i className="icon-logout" aria-hidden />
                    <span className="sidebar-item-label">Logout</span>
                  </button>
                </li>
              </ul>
          </nav>
      </div>
    </aside>
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
