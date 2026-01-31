"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { AuthForm, REGISTER_FIELDS, registerValidation } from "@/components/ui/form";
import type { AuthFormConfig } from "@/components/ui/form";
import { showSuccess, showInfo } from "@/utils/errorHandler";
import { register as registerApi } from "@/services";
import { isAuthenticated } from "@/lib/auth-session";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const config: AuthFormConfig = {
    title: "Create new account",
    subtitle: "Welcome back! Please enter your details",
    fields: REGISTER_FIELDS,
    validation: registerValidation,
    showPasswordStrength: true,
    submitLabel: "Create Account",
    secondaryButton: {
      label: "Sign up with google",
      icon: <i className="icon-md icon-google-colored text-[20px]" aria-hidden />,
      onClick: () => {
        showInfo("Google sign-up will be available soon.");
      },
    },
    footer: (
      <p className="text-lavender text-sm text-center text-slate font-regular font-kumbh-sans">
        Already have an account?{" "}
        <NextLink
          href="/login"
          className="font-semibold text-slate-dark hover:text-lavender-light relative"
        >
          Sign in{" "}
          <i className="icon-line-green icon-3xl absolute-bottom-center mb-[-14px]" aria-hidden />
        </NextLink>
      </p>
    ),
    onSubmit: async (values) => {
      const name = String(values.name ?? "").trim();
      const email = String(values.email ?? "").trim();
      const password = String(values.password ?? "");
      try {
        await registerApi({ name, email, password });
        showSuccess("Hesabınız oluşturuldu. Giriş yapabilirsiniz.");
        router.push("/login");
      } catch {
        // Toast already shown by error handler in service layer
      }
    },
  };

  return <AuthForm config={config} />;
}
