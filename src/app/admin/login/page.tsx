"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginResult } from "@/admin/actions/auth";
import { Loader2, Lock } from "lucide-react";

const initial: LoginResult | null = null;

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initial);

  return (
    <div className="admin-root flex min-h-screen items-center justify-center bg-[var(--admin-bg)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="serif text-3xl font-semibold tracking-[0.28em] text-[var(--admin-ink)]">
            TIMECT
          </p>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            Catalog administration
          </p>
        </div>

        <div className="admin-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-accent-soft)]">
              <Lock className="h-4 w-4 text-[var(--admin-accent)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sign in</h1>
              <p className="text-xs text-[var(--admin-muted)]">
                Secure access for authorized staff only
              </p>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="admin-input"
                placeholder="admin@timect.com"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="admin-input"
                placeholder="••••••••"
              />
            </div>

            {state && !state.ok && (
              <p
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--admin-danger)]"
                role="alert"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="admin-btn admin-btn-primary w-full py-3"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--admin-muted)]">
          Protected by JWT session · Credentials stored with bcrypt
        </p>
      </div>
    </div>
  );
}
