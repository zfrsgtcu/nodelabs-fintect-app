/**
 * API base URL (case study).
 * @see https://case.nodelabs.dev/api/ — response envelope: { success, data }
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://case.nodelabs.dev/api";

/** API contract: success response envelope (matches case.nodelabs.dev) */
export interface ApiSuccessResponse<T> {
  success: true;
  /** Some endpoints include a top-level message (Swagger example) */
  message?: string;
  data: T;
}

/** API contract: error response */
export interface ApiErrorResponse {
  success: false;
  /** Swagger: error name (e.g. BadRequest, Unauthorized, Forbidden) */
  error: string;
  message: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiError {
  message: string;
  status?: number;
  error?: string;
  code?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: ApiError = {
      message: res.statusText,
      status: res.status,
    };
    try {
      const body = await res.json();
      // Swagger-style: { success:false, error, message, code? }
      if (body?.error && typeof body.error === "string") err.error = body.error;
      if (body?.message && typeof body.message === "string")
        err.message = body.message;
      if (body?.code && typeof body.code === "string") err.code = body.code;
    } catch {
      // ignore
    }
    throw err;
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const body = await res.json();
    // Some APIs return 200 with { success:false, ... } — treat as error
    if (body?.success === false) {
      const err: ApiError = {
        status: res.status,
        message: body?.message ?? res.statusText,
        error: body?.error,
        code: body?.code,
      };
      throw err;
    }
    return body;
  }
  return res.text() as unknown as T;
}

export type RequestInitWithBody = Omit<RequestInit, "body"> & {
  body?: unknown | FormData;
};

export async function apiFetch<T>(
  path: string,
  opts: RequestInitWithBody = {}
): Promise<T> {
  const { body, headers = {}, ...rest } = opts;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const nextHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  const init: RequestInit = {
    ...rest,
    headers: nextHeaders,
  };

  if (body !== undefined) {
    init.body =
      body instanceof FormData ? body : JSON.stringify(body);
    if (body instanceof FormData) {
      (init.headers as Record<string, string>)["Content-Type"] = "";
      delete (init.headers as Record<string, string>)["Content-Type"];
    }
  }

  const res = await fetch(url, init);
  return handleResponse<T>(res);
}
