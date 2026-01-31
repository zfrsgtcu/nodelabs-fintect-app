"use client";

import { useEffect, useRef } from "react";
import { initPreloadFintech } from "@/assets/scripts/animations/pre-loading";

export default function PreLoadFintech() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return initPreloadFintech(containerRef.current) ?? undefined;
  }, []);

  return (
    <div
      ref={containerRef}
      className="pre-load-fintech bg-white h-screen w-screen absolute w-full h-full z-[1000]"
    >
      <div className="flex flex-row gap-[15px] anim-fintech-loading absolute-center items-center justify-center">
        <i className="icon-fintech-logo text-[40px] opacity-0 bg-white block z-[50]" aria-hidden />
        <i className="icon-fintech text-[80px] opacity-0" aria-hidden />
      </div>
    </div>
  );
}
