import { toast, type ToastOptions } from "react-toastify";

export type NotifyOptions = ToastOptions;

/** Uygulama genelinde kullanılacak bildirim / uyarı / alert API. React-toastify üzerinden çalışır. */
export const notify = {
  /** Başarı mesajı (yeşil) */
  success: (message: string, options?: NotifyOptions) =>
    toast.success(message, options),

  /** Hata mesajı (kırmızı) */
  error: (message: string, options?: NotifyOptions) =>
    toast.error(message, options),

  /** Uyarı mesajı (sarı/turuncu) */
  warning: (message: string, options?: NotifyOptions) =>
    toast.warning(message, options),

  /** Bilgi mesajı (mavi) */
  info: (message: string, options?: NotifyOptions) =>
    toast.info(message, options),

  /** Varsayılan tip (gri) */
  default: (message: string, options?: NotifyOptions) =>
    toast(message, options),

  /** Belirli bir toast'ı kapat */
  dismiss: (id?: string | number) => toast.dismiss(id),

  /** Tüm toast'ları kapat */
  dismissAll: () => toast.dismiss(),
};
