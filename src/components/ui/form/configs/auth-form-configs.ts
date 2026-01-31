import type { AuthFormConfig, AuthFormValidation, FieldConfig } from "../types";
import { validateEmail, validateName, validatePassword } from "../validation/auth-validation";

export const LOGIN_FIELDS: FieldConfig[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "example@gmail.com",
    required: true,
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    required: true,
  },
];

export const REGISTER_FIELDS: FieldConfig[] = [
  {
    type: "text",
    name: "name",
    label: "Full Name",
    placeholder: "Mahfuzul Nabil",
    required: true,
    lettersOnly: true,
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "example@gmail.com",
    required: true,
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    required: true,
  },
];

export const loginValidation: AuthFormValidation = (values) => {
  const errors: Record<string, string> = {};
  const e = validateEmail(values.email as string);
  if (e) errors.email = e;
  const p = validatePassword(values.password as string);
  if (p) errors.password = p;
  return errors;
};

export const registerValidation: AuthFormValidation = (values) => {
  const errors: Record<string, string> = {};
  const n = validateName(values.name as string);
  if (n) errors.name = n;
  const e = validateEmail(values.email as string);
  if (e) errors.email = e;
  const p = validatePassword(values.password as string);
  if (p) errors.password = p;
  return errors;
};
