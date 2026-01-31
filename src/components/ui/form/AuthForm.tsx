"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import FormField from "./FormField";
import type { AuthFormConfig, FieldConfig } from "./types";
import { showWarning } from "@/utils/errorHandler";

export interface AuthFormProps {
  config: AuthFormConfig;
  formClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function getInitialValues(fields: FieldConfig[]): Record<string, string | boolean> {
  const init: Record<string, string | boolean> = {};
  fields.forEach((field) => {
    if (field.type === "checkbox") {
      init[field.name] = false;
    } else {
      init[field.name] = "";
    }
  });
  return init;
}

function fieldHasValue(field: FieldConfig, value: string | boolean | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === "boolean") return value;
  return (value ?? "").trim().length > 0;
}

export default function AuthForm({
  config,
  formClassName = "flex flex-col gap-[25px]",
  titleClassName = "font-semibold font-kumbh-sans",
  subtitleClassName = "font-[400] font-kumbh-sans text-lavender",
}: AuthFormProps) {
  const initialValues = useMemo(() => getInitialValues(config.fields), [config.fields]);
  const [values, setValues] = useState<Record<string, string | boolean>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameDigitWarnedRef = useRef(false);

  const validate = useCallback(() => {
    if (!config.validation) return {};
    const next = config.validation(values);
    setErrors(next);
    return next;
  }, [config.validation, values]);

  const handleChange = useCallback(
    (name: string, value: string | boolean) => {
      let finalValue: string | boolean = value;
      if (typeof value === "string") {
        const field = config.fields.find((f) => f.name === name);
        if (field && "lettersOnly" in field && field.lettersOnly) {
          const cleaned = value.replace(/\d/g, "");
          if (cleaned !== value) {
            if (!nameDigitWarnedRef.current) {
              showWarning("Numbers are not allowed in the full name field.");
              nameDigitWarnedRef.current = true;
            }
            finalValue = cleaned;
          }
          if ((finalValue as string).trim() === "") {
            nameDigitWarnedRef.current = false;
          }
        }
        if (field && "digitsOnly" in field && field.digitsOnly) {
          const cleaned = value.replace(/\D/g, "");
          if (cleaned !== value) {
            showWarning("This field may only contain numbers.");
            finalValue = cleaned;
          }
        }
      }
      setValues((prev) => ({ ...prev, [name]: finalValue }));
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [config.fields, errors]
  );

  const handleBlur = useCallback(
    (name: string) => {
      if (!config.validation) return;
      const val = values[name];
      const field = config.fields.find((f) => f.name === name);
      if (field && !fieldHasValue(field, val)) return;
      const nextValues = { ...values };
      const nextErrors = config.validation(nextValues);
      if (nextErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: nextErrors[name]! }));
      }
    },
    [config.validation, config.fields, values]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    try {
      await Promise.resolve(config.onSubmit(values));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[25px]">
      <div className="flex flex-col">
        <h1 className={titleClassName}>{config.title}</h1>
        {config.subtitle && (
          <p className={subtitleClassName}>{config.subtitle}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={formClassName}>
        <div className="flex flex-col gap-[15px]">
          {config.fields.map((field) => {
            const rawError = errors[field.name];
            const showError =
              (submitAttempted || fieldHasValue(field, values[field.name])) && rawError;
            return (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                error={showError ? rawError : undefined}
                onChange={(value) => handleChange(field.name, value)}
                onBlur={() => handleBlur(field.name)}
                disabled={loading}
                showPasswordStrength={
                  config.showPasswordStrength && field.type === "password"
                }
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-[25px]">
          <div className="flex flex-col gap-[15px]">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-green-primary cursor-pointer disabled:opacity-60 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
              aria-busy={loading}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                config.submitLabel
              )}
            </button>

            {config.secondaryButton && (
              <button
                type="button"
                disabled={loading}
                onClick={config.secondaryButton.onClick}
                className="btn btn-outline cursor-pointer flex items-center justify-center gap-[10px] disabled:opacity-60 disabled:pointer-events-none"
              >
                {config.secondaryButton.icon}
                {config.secondaryButton.label}
              </button>
            )}
          </div>

          {config.footer}
        </div>
      </form>
    </div>
  );
}
