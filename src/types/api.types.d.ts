/**
 * Type definitions for API request/response interfaces
 */

/**
 * Interface for user session initialization request
 * Used in POST /user/startheaderinfo endpoint
 */
interface UserSessionRequest {
  /** Unique device identifier */
  deviceId: string;
  /** User's geographic region */
  region: string;
  /** Device platform (e.g., iOS, Android, Web) */
  platform: string;
  /** Application version number */
  appVersion: string;
}

/**
 * Interface for user header information response
 * Contains user profile and notification data
 */
interface UserHeaderInfo {
  /** Unique user identifier */
  userId: string;
  /** User's display name */
  displayName: string;
  /** URL to user's avatar image */
  avatar: string;
  /** Number of unread notifications */
  notifications: number;
}

/**
 * Generic API response wrapper interface
 * @template T - Type of the response data
 */
interface ApiResponse<T> {
  /** Response status (e.g., 'success', 'error') */
  status: string;
  /** Response payload */
  data: T;
}

/**
 * Interface for error response
 * Used when API encounters an error
 */
interface ErrorResponse {
  /** Error status (always 'error') */
  status: string;
  /** Error message description */
  message: string;
  /** Optional error code for specific error types */
  code?: string;
}

declare global {
  export {
    UserSessionRequest,
    UserHeaderInfo,
    ApiResponse,
    ErrorResponse
  }
}