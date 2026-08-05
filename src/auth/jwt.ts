/**
 * Mock JWT utilities.
 *
 * Real JWTs are three base64url segments separated by dots:
 *   header.payload.signature
 *
 * We replicate that structure but the "signature" is just a
 * deterministic hash of the payload — enough to detect tampering
 * in a demo context while keeping the familiar JWT shape.
 */

export interface JwtPayload {
  sub: string;    // subject (username)
  iat: number;    // issued-at  (unix seconds)
  exp: number;    // expiry     (unix seconds)
  role: string;   // e.g. "user" | "admin"
}

// ── Encoding helpers ──────────────────────────────────────────

function b64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64Decode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const result = pad ? padded + '='.repeat(4 - pad) : padded;
  return decodeURIComponent(escape(atob(result)));
}

/** Cheap deterministic "signature" — not cryptographic, just a demo. */
function mockSign(payload: string, secret: string): string {
  let hash = 0;
  const combined = payload + secret;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
  }
  return b64Encode(String(hash >>> 0));
}

const MOCK_SECRET = 'swapi-archive-terminal-secret';
const HEADER = b64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

// ── Public API ────────────────────────────────────────────────

/** Creates a signed mock JWT string. */
export function createToken(
  sub: string,
  role: string,
  ttlSeconds: number,
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = { sub, iat: now, exp: now + ttlSeconds, role };
  const encodedPayload = b64Encode(JSON.stringify(payload));
  const sig = mockSign(`${HEADER}.${encodedPayload}`, MOCK_SECRET);
  return `${HEADER}.${encodedPayload}.${sig}`;
}

/** Parses a mock JWT string and returns the payload, or null if invalid. */
export function parseToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, encodedPayload, sig] = parts;
    const expectedSig = mockSign(`${header}.${encodedPayload}`, MOCK_SECRET);
    if (sig !== expectedSig) return null;

    return JSON.parse(b64Decode(encodedPayload)) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns true if the token is expired (or invalid). */
export function isTokenExpired(token: string): boolean {
  const payload = parseToken(token);
  if (!payload) return true;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

/** Returns seconds until the token expires (negative if already expired). */
export function secondsUntilExpiry(token: string): number {
  const payload = parseToken(token);
  if (!payload) return -1;
  return payload.exp - Math.floor(Date.now() / 1000);
}
