import { type FormEvent, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0f14] px-4">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, #E0B84B33 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E0B84B]">
            Archive Terminal // Auth
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#f1f2f6]">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Access the Star Wars Character Directory
          </p>
        </div>

        {/* Card */}
        <form
          id="login-form"
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#22262f] bg-[#12151c] p-8 shadow-xl"
        >
          {/* Username */}
          <div className="mb-5">
            <label
              htmlFor="login-username"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[#8b93a7]"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-lg border border-[#22262f] bg-[#0d0f14] px-4 py-2.5 text-sm text-[#f1f2f6] placeholder-[#3d4455] outline-none transition focus:border-[#E0B84B] focus:ring-1 focus:ring-[#E0B84B]"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[#8b93a7]"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#22262f] bg-[#0d0f14] px-4 py-2.5 text-sm text-[#f1f2f6] placeholder-[#3d4455] outline-none transition focus:border-[#E0B84B] focus:ring-1 focus:ring-[#E0B84B]"
            />
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              id="login-error"
              className="mb-4 rounded-lg border border-[#CE626244] bg-[#CE626211] px-4 py-2.5 text-sm text-[#CE6262]"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E0B84B] px-4 py-2.5 text-sm font-semibold text-[#0d0f14] transition hover:bg-[#f0c95c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Authenticating…' : 'Sign in'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-5 rounded-lg border border-[#22262f] bg-[#12151c] px-5 py-4 text-xs">
          <p className="mb-2 font-mono uppercase tracking-widest text-[#E0B84B]">
            Demo credentials
          </p>
          <div className="space-y-1 font-mono text-[#8b93a7]">
            <p>
              <span className="text-[#f1f2f6]">admin</span> /{' '}
              <span className="text-[#f1f2f6]">password123</span>
            </p>
            <p>
              <span className="text-[#f1f2f6]">demo</span> /{' '}
              <span className="text-[#f1f2f6]">demo123</span>
            </p>
          </div>
          <p className="mt-3 leading-relaxed text-[#3d4455]">
            Access token expires in 5 min. Silent refresh fires 60 s before
            expiry — no re-login needed.
          </p>
        </div>
      </div>
    </div>
  );
}
