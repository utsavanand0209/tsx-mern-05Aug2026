import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createToken, parseToken, type JwtPayload } from './jwt';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  cancelScheduledRefresh,
  clearTokens,
  getRefreshToken,
  isTokenExpired,
  scheduleRefresh,
  storeRefreshToken,
} from './tokenService';

// ── Mock user DB ──────────────────────────────────────────────
// In a real app this lives on the server. Here it's a hardcoded
// lookup so the assignment can demonstrate the full auth flow.

const MOCK_USERS: Record<string, { passwordHash: string; role: string }> = {
  admin: { passwordHash: 'password123', role: 'admin' },
  demo:  { passwordHash: 'demo123',     role: 'user'  },
};

// ── Context types ─────────────────────────────────────────────

export interface AuthUser {
  username: string;
  role: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ── Context ───────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser]               = useState<AuthUser | null>(null);

  // Called on every new access token (login or silent refresh).
  const applyAccessToken = useCallback(
    (token: string, doSchedule = true) => {
      const payload = parseToken(token) as JwtPayload;
      setAccessToken(token);
      setUser({ username: payload.sub, role: payload.role });

      if (doSchedule) {
        scheduleRefresh(
          token,
          (newToken) => applyAccessToken(newToken),
          handleLogout,
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // On mount: restore session from localStorage if refresh token is still valid.
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken || isTokenExpired(refreshToken)) return;

    const payload = parseToken(refreshToken);
    if (!payload) return;

    // Issue a fresh access token immediately (silent restore).
    const newAccessToken = createToken(
      payload.sub,
      payload.role,
      ACCESS_TOKEN_TTL,
    );
    console.info(`[Auth] Session restored for "${payload.sub}".`);
    applyAccessToken(newAccessToken);
  }, [applyAccessToken]);

  function handleLogout() {
    cancelScheduledRefresh();
    clearTokens();
    setAccessToken(null);
    setUser(null);
  }

  async function login(username: string, password: string): Promise<void> {
    // Simulate a small network delay to make the UX feel realistic.
    await new Promise((r) => setTimeout(r, 600));

    const record = MOCK_USERS[username.trim().toLowerCase()];
    if (!record || record.passwordHash !== password) {
      throw new Error('Invalid username or password.');
    }

    const newAccessToken  = createToken(username, record.role, ACCESS_TOKEN_TTL);
    const newRefreshToken = createToken(username, record.role, REFRESH_TOKEN_TTL);

    storeRefreshToken(newRefreshToken);
    applyAccessToken(newAccessToken);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout: handleLogout,
        isAuthenticated: accessToken !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
