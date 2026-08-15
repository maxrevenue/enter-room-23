'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { siteConfig } from '@/lib/config';

export default function AgeGate() {
  const [status, setStatus] = useState<'loading' | 'verified' | 'unverified'>('loading');

  useEffect(() => {
    const verified = Cookies.get('room23_age_verified');
    setStatus(verified ? 'verified' : 'unverified');
  }, []);

  const handleVerify = () => {
    Cookies.set('room23_age_verified', 'true', {
      expires: siteConfig.ageCookieDurationDays,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    setStatus('verified');
  };

  if (status === 'loading') {
    return <div className="fixed inset-0 z-50 bg-zinc-950" />;
  }

  if (status === 'verified') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="relative w-full max-w-sm overflow-hidden bg-zinc-900/90 text-center shadow-[0_24px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
      >
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.55), transparent)' }}
          aria-hidden="true"
        />

        <div className="px-10 py-12">
          <h1
            id="age-gate-title"
            className="font-syne text-2xl font-semibold text-white tracking-[0.42em] mb-10"
          >
            ROOM 23
          </h1>

          <p className="text-zinc-300 text-[15px] leading-relaxed mb-2">
            This space is reserved for adults.
          </p>
          <p className="text-zinc-500 text-sm leading-relaxed mb-10">
            By continuing you confirm you are 18 or older.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleVerify}
              aria-label="Confirm I am 18 or older and enter the site"
              className="w-full py-3.5 bg-red-800 hover:bg-red-700 text-white text-sm font-medium tracking-[0.22em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Enter
            </button>
            <a
              href="https://www.google.com"
              aria-label="Leave the site if under 18"
              className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 text-sm tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Leave
            </a>
          </div>

          <p className="mt-10 text-[10px] tracking-[0.22em] uppercase text-zinc-600">
            Private · No tracking
          </p>
        </div>
      </div>
    </div>
  );
}
