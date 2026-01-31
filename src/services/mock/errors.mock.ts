/**
 * Common Swagger-style errors (same JSON schema).
 * { success:false, error, message, code? }
 */

export interface SwaggerErrorMock {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export const MOCK_TOKEN_MISSING: SwaggerErrorMock = {
  success: false,
  error: "Unauthorized",
  message: "An access token is required for authentication.",
  code: "TOKEN_MISSING",
};

export const MOCK_UNEXPECTED_ERROR: SwaggerErrorMock = {
  success: false,
  error: "InternalServerError",
  message: "An unexpected error occurred on the server.",
  code: "UNEXPECTED_ERROR",
};

export const MOCK_USER_NOT_FOUND: SwaggerErrorMock = {
  success: false,
  error: "NotFound",
  message: "User not found.",
  code: "USER_NOT_FOUND",
};

