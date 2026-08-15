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

  // Solid black while checking the cookie
  if (status === 'loading') {
    return <div className="fixed inset-0 z-50 bg-zinc-950" />;
  }

  if (status === 'verified') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="w-full max-w-sm mx-4 border border-zinc-800 bg-zinc-900 p-10 text-center shadow-2xl animate-in fade-in duration-300"
      >
        <h1
          id="age-gate-title"
          className="text-2xl font-serif tracking-[0.25em] text-white mb-8"
        >
          ROOM 23
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed mb-10">
          This space is reserved for adults.
          <br />
          By continuing you confirm you are 18 or older.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleVerify}
            aria-label="Confirm I am 18 or older and enter"
            className="w-full py-3.5 bg-red-800 hover:bg-red-700 text-white text-sm tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            ENTER
          </button>

          <a
            href="https://www.google.com"
            aria-label="Exit if under 18"
            className="w-full py-3 text-zinc-500 hover:text-zinc-300 text-xs tracking-wider transition-colors"
          >
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
