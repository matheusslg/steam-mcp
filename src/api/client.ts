/**
 * Steam API client with retry logic
 */

import { getConfig } from "../config.js";
import { buildEndpointUrl, STEAM_STORE_BASE } from "./endpoints.js";
import type { SteamEndpoint } from "./endpoints.js";

const MAX_RETRIES = 2;
const INITIAL_BACKOFF_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(attempt: number): number {
  const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
  const jitter = delay * Math.random() * 0.25;
  return delay + jitter;
}

export class SteamApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "SteamApiError";
  }
}

function isRetryable(statusCode: number): boolean {
  return statusCode === 429 || statusCode >= 500;
}

/**
 * Make a request to the Steam Web API (requires API key).
 */
export async function steamApiRequest<T>(
  endpoint: SteamEndpoint,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const config = getConfig();
  const url = new URL(buildEndpointUrl(endpoint));

  url.searchParams.set("key", config.apiKey);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  let lastError: SteamApiError | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url.toString());

    if (response.ok) {
      return (await response.json()) as T;
    }

    lastError = new SteamApiError(
      `Steam API ${response.status}: ${response.statusText}`,
      response.status
    );

    if (isRetryable(response.status) && attempt < MAX_RETRIES) {
      await sleep(calculateBackoff(attempt));
      continue;
    }

    throw lastError;
  }

  throw lastError;
}

/**
 * Make a request to the Steam Store API (no API key needed).
 */
export async function storeApiRequest<T>(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const url = new URL(`${STEAM_STORE_BASE}/${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  let lastError: SteamApiError | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url.toString());

    if (response.ok) {
      return (await response.json()) as T;
    }

    lastError = new SteamApiError(
      `Steam Store API ${response.status}: ${response.statusText}`,
      response.status
    );

    if (isRetryable(response.status) && attempt < MAX_RETRIES) {
      await sleep(calculateBackoff(attempt));
      continue;
    }

    throw lastError;
  }

  throw lastError;
}
