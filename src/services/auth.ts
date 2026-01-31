/**
 * Auth service — Swagger-aligned User endpoints.
 * POST /users/register, /users/login, /users/logout, /users/refresh-token.
 * Uses mock when API unavailable (same JSON envelope: { success, data } | { success: false, error, message }).
 * @see https://case.nodelabs.dev/api-docs/#/
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import {
  getMockLoginResponse,
  getMockLogoutResponse,
  getMockRefreshTokenResponse,
  getMockRegisterResponse,
  MOCK_ACCOUNT_DEACTIVATED,
  MOCK_AUTH_ERROR,
  MOCK_MISSING_FIELDS,
  MOCK_REGISTER_MISSING_FIELDS,
  MOCK_RATE_LIMIT,
} from "./mock/auth.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "user" | "admin";
    isActive: boolean;
    lastLoginAt: string;
    lastLoginIP: string;
    createdAt: string;
    updatedAt: string;
  };
}

/** Logout response — Swagger: success + optional message */
export interface LogoutResponse {
  success: true;
  message?: string;
}

/**
 * POST /users/login — Authenticate user. Returns { success: true, data: { accessToken, user } }.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    if (USE_MOCK) {
      await delay(400);
      if (!payload.email?.trim() || !payload.password) {
        throw { status: 400, ...MOCK_MISSING_FIELDS };
      }
      if (payload.email === "deactivated@mock.dev") {
        throw { status: 403, ...MOCK_ACCOUNT_DEACTIVATED };
      }
      if (payload.email === "ratelimit@mock.dev") {
        throw { status: 429, ...MOCK_RATE_LIMIT };
      }
      if (payload.password === "wrong") {
        throw { status: 401, ...MOCK_AUTH_ERROR };
      }
      const res = getMockLoginResponse(payload);
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<AuthResponse>>("/users/login", {
      method: "POST",
      body: payload,
    });
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}

/**
 * POST /users/register — Register new user. Returns { success: true, data: { accessToken, user } }.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    if (USE_MOCK) {
      await delay(400);
      if (!payload.name?.trim() || !payload.email?.trim() || !payload.password) {
        throw { status: 400, ...MOCK_REGISTER_MISSING_FIELDS };
      }
      const res = getMockRegisterResponse(payload);
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<AuthResponse>>("/users/register", {
      method: "POST",
      body: payload,
    });
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}

/**
 * POST /users/logout — Log out user. Returns { success: true, message? }.
 */
export async function logout(_token?: string): Promise<LogoutResponse> {
  try {
    if (USE_MOCK) {
      await delay(200);
      return getMockLogoutResponse();
    }
    return await apiFetch<LogoutResponse>("/users/logout", { method: "POST" });
  } catch (e) {
    handleApiError(e);
  }
}

/**
 * POST /users/refresh-token — Refresh access token. Returns { success: true, data: { accessToken, user } }.
 */
export async function refreshToken(currentToken: string): Promise<AuthResponse> {
  try {
    if (USE_MOCK) {
      await delay(200);
      const res = getMockRefreshTokenResponse(currentToken);
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<AuthResponse>>("/users/refresh-token", {
      method: "POST",
      body: { refreshToken: currentToken },
    });
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}
