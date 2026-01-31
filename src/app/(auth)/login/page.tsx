"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { AuthForm, LOGIN_FIELDS, loginValidation } from "@/components/ui/form";
import type { AuthFormConfig } from "@/components/ui/form";
import { showSuccess, showInfo } from "@/utils/errorHandler";
import { login } from "@/services";
import { isAuthenticated, setToken } from "@/lib/auth-session";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const config: AuthFormConfig = {
    title: "Sign In",
    subtitle: "Welcome back! Please enter your details",
    fields: LOGIN_FIELDS,
    validation: loginValidation,
    submitLabel: "Sign In",
    secondaryButton: {
      label: "Sign In with Google",
      icon: <i className="icon-md icon-google-colored text-[20px]" aria-hidden />,
      onClick: () => {
        showInfo("Google sign-in will be available soon.");
      },
    },
    footer: (
      <p className="text-lavender text-sm text-center text-slate font-regular font-kumbh-sans">
        Don't have an account?{" "}
        <NextLink
          href="/register"
          className="font-semibold font-kumbh-sans text-slate-dark hover:text-lavender-light relative"
        >
          Sign up{" "}
          <i className="icon-line-green icon-3xl absolute-bottom-center mb-[-14px]" aria-hidden />
        </NextLink>
      </p>
    ),
    onSubmit: async (values) => {
      const email = String(values.email ?? "").trim();
      const password = String(values.password ?? "");
      try {
        const res = await login({ email, password });
        setToken(res.accessToken);
        showSuccess("Sign in successful.");
        router.push("/dashboard");
      } catch {
        // Toast already shown by error handler in service layer
      }
    },
  };

  return <AuthForm config={config} />;
}
