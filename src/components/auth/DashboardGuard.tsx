"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-session";

type Props = { children: React.ReactNode };

export default function DashboardGuard({ children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      setAllowed(false);
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  // Giriş yoksa hiçbir dashboard içeriği gösterme
  if (allowed === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-light-soft">
        <p className="text-slate font-kumbh-sans">Redirecting to login…</p>
      </div>
    );
  }

  if (allowed !== true) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-light-soft">
        <p className="text-slate font-kumbh-sans">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
