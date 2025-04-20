/**
 * Type definitions for API request/response schemas
 */

// User Session Types
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UserSessionRequest {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-_]{1,64}$/)
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/)
  region: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/)
  appVersion: string;
}

export interface UserHeaderInfo {
  userId: string;
  displayName: string;
  avatar: string;
  notifications: number;
  region: string;
  deviceId: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
}

export interface NavigationResponse {
  navigation: NavigationItem[];
}

// Asset Types
export interface AssetRequest {
  id: string;
  deviceId: string;
  resolution?: string;
  format?: string;
}

export interface AssetConfig {
  id: string;
  title: string;
  type: 'movie' | 'series';
  duration: number;
  streamUrl: string;
  thumbnailUrl: string;
  availableUntil: string;
  isHD: boolean;
  hasSubtitles: boolean;
  supportedFormats: string[];
  supportedResolutions: string[];
  drm?: {
    provider: string;
    token: string;
  };
}

// Metadata Types
export interface MetadataRequest {
  id: string;
  language?: string;
}

export interface ContentMetadata {
  assetId: string;
  title: string;
  description: string;
  releaseYear: number;
  genres: string[];
  cast: string[];
  director?: string;
  creator?: string;
  rating: string;
  language: string;
  subtitles: string[];
  runtime?: string;
  seasons?: number;
  episodes?: number;
  posterUrl: string;
  trailerUrl: string;
  tags: string[];
  popularity: number;
  averageRating: number;
}

// Common Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
}
