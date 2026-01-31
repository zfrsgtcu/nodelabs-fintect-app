/**
 * Mock auth responses — Swagger-aligned (POST /users/register, /users/login, /users/logout, /users/refresh-token).
 * Envelope: { success: true, message?, data? } | { success: false, error, message, code? }
 */

import type { LoginPayload, RegisterPayload } from "../auth";

export interface AuthData {
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

export interface AuthMockResponse {
  success: true;
  message?: string;
  data: AuthData;
}

export interface AuthErrorMockResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/** Simulates POST /users/login response */
export function getMockLoginResponse(_payload: LoginPayload): AuthMockResponse {
  return {
    success: true,
    message: "Login successful.",
    data: {
      accessToken: "mock-access-token",
      user: {
        id: "60d0fe4f5311236168a109ca",
        fullName: "John Doe",
        email: _payload.email,
        role: "user",
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        lastLoginIP: "192.168.1.1",
        createdAt: "2026-01-28T06:53:16.286Z",
        updatedAt: "2026-01-28T06:53:16.286Z",
      },
    },
  };
}

/** Simulates POST /users/register response */
export function getMockRegisterResponse(
  payload: RegisterPayload
): AuthMockResponse {
  return {
    success: true,
    message: "Registration successful.",
    data: {
      accessToken: "mock-access-token-reg",
      user: {
        id: "60d0fe4f5311236168a109cb",
        fullName: payload.name,
        email: payload.email,
        role: "user",
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        lastLoginIP: "192.168.1.1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/** Simulates POST /users/logout response — Swagger: success + optional message */
export function getMockLogoutResponse(): { success: true; message?: string } {
  return { success: true, message: "Logged out successfully." };
}

/** Simulates POST /users/refresh-token response — returns new accessToken + user */
export function getMockRefreshTokenResponse(
  currentToken: string
): AuthMockResponse {
  return {
    success: true,
    message: "Token refreshed.",
    data: {
      accessToken: currentToken ? `mock-refreshed-${currentToken.slice(-8)}` : "mock-access-token",
      user: {
        id: "60d0fe4f5311236168a109ca",
        fullName: "John Doe",
        email: "user@example.com",
        role: "user",
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        lastLoginIP: "192.168.1.1",
        createdAt: "2026-01-28T06:53:16.286Z",
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/** Simulates 401 / invalid credentials */
export const MOCK_AUTH_ERROR: AuthErrorMockResponse = {
  success: false,
  error: "Unauthorized",
  message: "Invalid email or password.",
  code: "INVALID_CREDENTIALS",
};

export const MOCK_MISSING_FIELDS: AuthErrorMockResponse = {
  success: false,
  error: "BadRequest",
  message: "Email and password are required.",
  code: "INVALID_INPUT",
};

export const MOCK_REGISTER_MISSING_FIELDS: AuthErrorMockResponse = {
  success: false,
  error: "BadRequest",
  message: "Name, email and password are required.",
  code: "INVALID_INPUT",
};

export const MOCK_ACCOUNT_DEACTIVATED: AuthErrorMockResponse = {
  success: false,
  error: "Forbidden",
  message: "Your account has been deactivated.",
  code: "ACCOUNT_DEACTIVATED",
};

export const MOCK_RATE_LIMIT: AuthErrorMockResponse = {
  success: false,
  error: "Too Many Requests",
  message:
    "Too many authentication attempts from this IP, please try again after 15 minutes.",
};
