/**
 * Merkezi API hata yönetimi.
 * Toast kullanımı yalnızca bu dosyadan yapılır; kütüphane değişince sadece bu dosya güncellenir.
 */

import { notify } from "@/lib/notify";

const DEFAULT_ERROR_MESSAGE = "Bir hata oluştu. Lütfen tekrar deneyin.";

/** Axios-style veya fetch/API hata objesi */
type ErrorLike = {
  message?: string;
  response?: {
    data?: { message?: string };
  };
};

function isErrorLike(err: unknown): err is ErrorLike {
  return typeof err === "object" && err !== null;
}

/**
 * API/response hata mesajını normalize eder.
 * Sıra: error.response?.data?.message → error.message → fallback.
 */
export function normalizeErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE
): string {
  if (!isErrorLike(error)) {
    return fallback;
  }
  const fromResponse = error.response?.data?.message;
  if (typeof fromResponse === "string" && fromResponse.trim()) {
    return fromResponse.trim();
  }
  if (typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }
  return fallback;
}

/**
 * API hatasını yakalar, mesajı normalize eder, toast ile gösterir ve hatayı yeniden fırlatır.
 * Service layer try/catch içinde sadece bu fonksiyon çağrılmalıdır.
 */
export function handleApiError(error: unknown, fallback?: string): never {
  const message = normalizeErrorMessage(error, fallback);
  notify.error(message);
  throw error;
}

/**
 * Başarı mesajı — toast yalnızca bu modülden tetiklendiği için UI'da notify doğrudan kullanılmaz.
 */
export function showSuccess(message: string): void {
  notify.success(message);
}

/**
 * Uyarı mesajı (örn. validasyon).
 */
export function showWarning(message: string): void {
  notify.warning(message);
}

/**
 * Bilgi mesajı.
 */
export function showInfo(message: string): void {
  notify.info(message);
}

/**
 * Hata mesajı (API dışı, UI kaynaklı nadir durumlar için).
 */
export function showError(message: string): void {
  notify.error(message);
}
