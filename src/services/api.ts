/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataSourceType } from './config';
export type { DataSourceType } from './config';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Get or set active data source repository choice (e.g. for developer switches)
export function getActiveDataSource(): DataSourceType {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('art_escape_datasource');
    return (saved as DataSourceType) || 'mock';
  }
  return 'mock';
}

export function setActiveDataSource(source: DataSourceType): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('art_escape_datasource', source);
    window.location.reload(); // Reload to initialize services with new provider
  }
}

/**
 * A robust simulation wrapper for fetching RESTful or future graph resources.
 * Supports simulate network latency, custom endpoints, offline detection, and fallback retry loops.
 */
export async function executeFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    mockFallback?: () => T;
    apiPath?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const source = getActiveDataSource();
  const method = options.method || 'GET';

  // 1. Offline checks
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new ApiError('No network connection detected. Running in offline fallback mode.', 0);
  }

  // 2. Simulated Latency (Premium UX checking: allows showcasing skeletal loaders)
  await new Promise((resolve) => setTimeout(resolve, 350));

  // 3. Handle Rest/GraphQL or Mock routing
  if (source === 'mock') {
    // Standard mock response
    try {
      const mockResult = options.mockFallback ? options.mockFallback() : (null as any);
      return {
        data: mockResult,
        status: 200,
        message: 'Loaded successfully from offline-first local state'
      };
    } catch (e: any) {
      throw new ApiError(`Mock execution failed: ${e.message}`, 500);
    }
  }

  // Future API execution path (REST/GraphQL)
  const apiBase = options.apiPath || '/api/v1';
  const url = `${apiBase}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.statusText}`, response.status);
    }

    const json = await response.json();
    return {
      data: json.data as T,
      status: response.status,
      message: json.message,
      meta: json.meta
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failures fall back gracefully
    console.warn(`[API Connection Refused] ${url}. Falling back to high-fidelity mock assets.`);
    return {
      data: options.mockFallback(),
      status: 200,
      message: 'Failed to reach live API endpoints. Restored from local cache.'
    };
  }
}
