"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { formTransitionIn, opacityBounceIn, runAfterPreload } from "@/assets/scripts/animations/anim-auth";
import "@/assets/styles/scss/layout/auth.scss";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const handWatchRef = useRef<HTMLImageElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef<string | null>(null);
  const isRegister = pathname?.endsWith("/register") ?? false;

  const entryDirection =
    prevPathnameRef.current != null &&
    pathname &&
    prevPathnameRef.current !== pathname
      ? pathname.endsWith("/register")
        ? "right"
        : "left"
      : null;

  useLayoutEffect(() => {
    if (prevPathnameRef.current != null && pathname && prevPathnameRef.current !== pathname && formWrapRef.current) {
      formTransitionIn(formWrapRef.current, entryDirection ?? "right");
    }
    prevPathnameRef.current = pathname ?? null;
  }, [pathname, entryDirection]);

  useEffect(() => {
    return runAfterPreload(() => {
      if (handWatchRef.current) {
        opacityBounceIn(handWatchRef.current);
      }
    });
  }, []);

  return (
      <div className={`flex h-screen auth-wrapper ${isRegister ? "auth--register" : "auth--login"}`}>
          <div className="flex-1 h-full w-full relative auth-left-wrapper">
              <div className="form-container w-full">
                <div className={`logo-wrapper ${isRegister ? "custom-margin" : ""}`}>
                  <Link href="/">
                    <Image className="user-select-none drag-none pointer-events-none" src="/images/logo/logo.svg" alt="logo" width={107.31} height={30} />
                  </Link>
                </div>
                <div className="form-wrapper">
                  <div
                    ref={formWrapRef}
                    className="auth-form-transition-wrap"
                    style={
                      entryDirection
                        ? { transform: `translateX(${entryDirection === "right" ? "100%" : "-100%"})` }
                        : undefined
                    }
                  >
                    {children}
                  </div>
                </div>               
              </div>
          </div>
          
          <div className="h-full aspect-[675/900] relative auth-right-wrapper">
              <div ref={handWatchRef} className="hand-watch-wrap">
                <img src="/images/anim/login/hand-watch.png" className="hand-watch user-select-none drag-none pointer-events-none" alt="" />
              </div>
              <img src="/images/anim/login/bg-wrapper.jpg" className="auth-right-bg user-select-none drag-none pointer-events-none" alt="" />
          </div>
      </div>
  );
}