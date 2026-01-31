import { ComponentPropsWithoutRef, ReactNode } from "react";

export type FieldType = "text" | "email" | "password" | "select" | "checkbox";

export type SelectOption = { value: string; label: string };

export interface BaseFieldConfig {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  /** Letters/spaces only; digits blocked (e.g. full name) */
  lettersOnly?: boolean;
  /** Digits only; text blocked (e.g. phone, amount) */
  digitsOnly?: boolean;
}

export interface InputFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password";
  inputMode?: ComponentPropsWithoutRef<"input">["inputMode"];
  autoComplete?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  labelAfter?: boolean;
}

export type FieldConfig =
  | InputFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig;

/** Validation: returns error message or undefined if valid */
export type AuthFormValidation = (
  values: Record<string, string | boolean>
) => Record<string, string>;

export interface AuthFormConfig {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  submitLabel: string;
  /** Form-level validation; returns { fieldName: errorMessage } */
  validation?: AuthFormValidation;
  /** Show password strength indicator on register (weak/medium/strong) */
  showPasswordStrength?: boolean;
  secondaryButton?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  footer?: ReactNode;
  /** Sync or async; during execution inputs and submit button are disabled. */
  onSubmit: (values: Record<string, string | boolean>) => void | Promise<void>;
}
