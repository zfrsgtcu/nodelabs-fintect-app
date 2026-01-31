"use client";

import { ReactNode } from "react";
import Input from "./Input";
import FormFieldError from "./FormFieldError";
import type { FieldConfig } from "./types";
import { getPasswordStrength } from "./validation/password-strength";

export interface FormFieldProps {
  field: FieldConfig;
  value?: string | boolean;
  error?: string;
  onChange?: (value: string | boolean) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /** Register'da şifre için zayıf/orta/güçlü göstergesi */
  showPasswordStrength?: boolean;
  renderControl?: (field: FieldConfig) => ReactNode;
}

function renderDefaultControl(
  field: FieldConfig,
  value: string | boolean | undefined,
  error: string | undefined,
  onChange: (v: string | boolean) => void,
  onBlur: () => void,
  disabled?: boolean,
  showPasswordStrength?: boolean
): ReactNode {
  const strValue = typeof value === "string" ? value : "";
  const hasError = !!error;
  const isPasswordWithStrength =
    field.type === "password" && showPasswordStrength;
  const strength = isPasswordWithStrength
    ? getPasswordStrength(strValue)
    : null;

  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return (
        <>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            disabled={disabled ?? field.disabled}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            error={hasError}
            inputMode={field.type === "email" ? "email" : undefined}
            autoComplete={
              field.type === "email"
                ? "email"
                : field.type === "password"
                  ? "current-password"
                  : undefined
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
          />
          {isPasswordWithStrength && strValue && (
            <div className="password-strength" aria-live="polite">
              <div className="password-strength-bar">
                <span
                  className={`password-strength-segment ${strength ? `password-strength-${strength.level}` : ""}`}
                  style={{
                    width: strength
                      ? strength.level === "weak"
                        ? "33%"
                        : strength.level === "medium"
                          ? "66%"
                          : "100%"
                      : "0%",
                  }}
                />
              </div>
              {strength && (
                <span className={`password-strength-label password-strength-${strength.level}`}>
                  {strength.label}
                </span>
              )}
            </div>
          )}
          {hasError && error && (
            <FormFieldError id={`${field.name}-error`} message={error} />
          )}
        </>
      );
    case "select":
      return (
        <>
          <select
            id={field.name}
            name={field.name}
            required={field.required}
            disabled={disabled ?? field.disabled}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={`w-full font-medium font-[Kumbh_Sans] px-5 py-4 rounded-[10px] border focus:outline-none focus:border-slate-darker ${
              hasError ? "border-error" : "border-gray-lighter"
            }`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
          >
            {field.placeholder && (
              <option value="">{field.placeholder}</option>
            )}
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasError && error && (
            <FormFieldError id={`${field.name}-error`} message={error} />
          )}
        </>
      );
    case "checkbox":
      const checked = typeof value === "boolean" ? value : false;
      return (
        <input
          type="checkbox"
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={disabled ?? field.disabled}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          className={`rounded ${hasError ? "border-error" : "border-gray-lighter"}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
        />
      );
    default:
      return null;
  }
}

export default function FormField({
  field,
  value,
  error,
  onChange = () => {},
  onBlur = () => {},
  disabled,
  showPasswordStrength,
  renderControl,
}: FormFieldProps) {
  const hasError = !!error;
  const control =
    renderControl?.(field) ??
    renderDefaultControl(
      field,
      value,
      error,
      onChange,
      onBlur,
      disabled,
      showPasswordStrength
    );

  if (field.type === "checkbox") {
    const cbField = field as { labelAfter?: boolean };
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {!cbField.labelAfter && control}
          <label
            htmlFor={field.name}
            className="font-medium font-kumbh-sans text-sm text-slate-dark"
          >
            {field.label}
          </label>
          {cbField.labelAfter && control}
        </div>
        {hasError && error && (
          <FormFieldError id={`${field.name}-error`} message={error} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor={field.name}
        className="font-medium font-kumbh-sans text-sm text-slate-dark"
      >
        {field.label}
      </label>
      {control}
    </div>
  );
}
