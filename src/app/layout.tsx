import type { Metadata } from "next";
import "@/assets/styles/scss/layout/layout.scss";
import ErrorBoundary from "@/components/ErrorBoundary";
import PreLoadFintech from "@/components/ui/PreLoadFintech";
import ToastProvider from "@/components/ui/ToastProvider";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Fintect App",
  description: "Fintect Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <PreLoadFintech />
            {children}
            <ToastProvider />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
