/**
 * Token service — storage & silent-refresh scheduling.
 *
 * Strategy (mirroring production best-practice):
 *   • Access token  → lives in React state (memory only, never touches disk)
 *   • Refresh token → localStorage (simulates httpOnly cookie in a pure-SPA demo)
 *
 * Silent refresh fires REFRESH_BEFORE_EXPIRY_SECS before the access token
 * expires, so users never see an interruption.
 */

import { createToken, secondsUntilExpiry, isTokenExpired, parseToken } from './jwt';

export { isTokenExpired } from './jwt';

const REFRESH_TOKEN_KEY = 'swapi_refresh_token';
const REFRESH_BEFORE_EXPIRY_SECS = 60; // refresh 60 s before access token expires

export const ACCESS_TOKEN_TTL = 5 * 60;   // 5 minutes
export const REFRESH_TOKEN_TTL = 60 * 60; // 1 hour

// ── Refresh token (localStorage) ──────────────────────────────

export function storeRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Silent refresh scheduling ─────────────────────────────────

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Schedules a silent refresh that fires `REFRESH_BEFORE_EXPIRY_SECS` before
 * the current access token expires.
 *
 * @param accessToken  The current access token (used to read its expiry).
 * @param onRefresh    Called with the new access token on success.
 * @param onLogout     Called if the refresh token is missing or expired.
 */
export function scheduleRefresh(
  accessToken: string,
  onRefresh: (newAccessToken: string) => void,
  onLogout: () => void,
): void {
  cancelScheduledRefresh();

  const secsLeft = secondsUntilExpiry(accessToken);
  const delayMs = Math.max(0, (secsLeft - REFRESH_BEFORE_EXPIRY_SECS) * 1000);

  console.debug(
    `[Auth] Silent refresh scheduled in ${Math.round(delayMs / 1000)}s`,
  );

  refreshTimerId = setTimeout(() => {
    const refreshToken = getRefreshToken();

    if (!refreshToken || isTokenExpired(refreshToken)) {
      console.warn('[Auth] Refresh token missing or expired — logging out.');
      onLogout();
      return;
    }

    const payload = parseToken(refreshToken);
    if (!payload) {
      console.warn('[Auth] Refresh token invalid — logging out.');
      onLogout();
      return;
    }

    // Issue a new access token from the refresh token's identity.
    const newAccessToken = createToken(
      payload.sub,
      payload.role,
      ACCESS_TOKEN_TTL,
    );

    console.info(`[Auth] Silent refresh complete for "${payload.sub}".`);
    onRefresh(newAccessToken);
  }, delayMs);
}

export function cancelScheduledRefresh(): void {
  if (refreshTimerId !== null) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}
