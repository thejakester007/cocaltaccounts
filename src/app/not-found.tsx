'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center p-8 text-center">
      <div className="rounded-2xl border border-white/10 bg-black/30 px-8 py-10 shadow-xl">
        <div className="mb-2 text-sm uppercase tracking-widest text-white/40">Error</div>
        <h1 className="text-3xl font-semibold text-white/90">Page not found</h1>
        <p className="mt-2 max-w-prose text-white/60">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/accounts"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 hover:bg-white/10"
          >
            Manage Accounts
          </Link>
        </div>
      </div>
    </main>
  );
}
