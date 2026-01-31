import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-light-soft">
      <h1 className="text-2xl font-semibold text-slate-dark font-kumbh-sans">
        404
      </h1>
      <p className="text-slate text-center font-kumbh-sans">
        Sayfa bulunamadı.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-green-primary text-slate-dark font-semibold text-sm font-kumbh-sans hover:opacity-90"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
