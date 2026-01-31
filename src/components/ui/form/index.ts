export { default as AuthForm } from "./AuthForm";
export { default as FormField } from "./FormField";
export { default as Input } from "./Input";
export {
  LOGIN_FIELDS,
  REGISTER_FIELDS,
  loginValidation,
  registerValidation,
} from "./configs/auth-form-configs";
export type {
  AuthFormConfig,
  AuthFormValidation,
  FieldConfig,
  FieldType,
  InputFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  SelectOption,
} from "./types";
export type { AuthFormProps } from "./AuthForm";
export type { FormFieldProps } from "./FormField";
export type { InputProps } from "./Input";
