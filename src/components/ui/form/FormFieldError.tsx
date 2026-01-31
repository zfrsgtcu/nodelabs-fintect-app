"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface FormFieldErrorProps {
  id: string;
  message: string;
  className?: string;
}

/** Error message that slides in below the input (GSAP). */
export default function FormFieldError({ id, message, className = "form-field-error" }: FormFieldErrorProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [message]);

  return (
    <span ref={ref} id={id} className={className} role="alert">
      {message}
    </span>
  );
}
