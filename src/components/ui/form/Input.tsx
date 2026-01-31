"use client";

import { forwardRef } from "react";

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "className"> {
  id: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  className?: string;
  /** Hata durumunda kırmızı border gösterilir */
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = "text",
      placeholder,
      className = "",
      error = false,
      ...rest
    },
    ref
  ) => {
    const isPassword = type === "password";
    const resolvedClass = [className, error ? "input-error" : ""].filter(Boolean).join(" ");
    return (
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={resolvedClass || undefined}
        style={isPassword ? { letterSpacing: "1px" } : undefined}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
