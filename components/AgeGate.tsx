'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { siteConfig } from '@/lib/config';
import { Lock } from 'lucide-react';

export default function AgeGate() {
  const [status, setStatus] = useState<'loading' | 'verified' | 'unverified'>('loading');

  useEffect(() => {
    const verified = Cookies.get('room23_age_verified');
    if (verified) {
      setStatus('verified');
    } else {
      setStatus('unverified');
    }
  }, []);

  const handleVerify = () => {
    Cookies.set('room23_age_verified', 'true', { 
      expires: siteConfig.ageCookieDurationDays,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    setStatus('verified');
  };

  if (status === 'loading') {
    return <div className="fixed inset-0 z-50 bg-zinc-950" />; // Prevents flash
  }

  if (status === 'verified') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="age-gate-title"
        className="w-full max-w-md p-8 border border-zinc-800 bg-zinc-900 text-center shadow-2xl mx-4"
      >
        <div className="flex justify-center mb-4">
          <Lock className="w-6 h-6 text-zinc-500" aria-hidden="true" />
        </div>
        <h1 id="age-gate-title" className="text-2xl font-serif text-white tracking-widest mb-1">ROOM 23</h1>
        <h2 className="text-xs font-semibold tracking-widest text-red-600 mb-4">AGE VERIFICATION REQUIRED</h2>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          Our products are intended for adults. <br />
          By entering, you confirm you are 18 years of age or older. <br />
          <span className="text-zinc-300 font-medium">No tracking, no judgment.</span>
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleVerify}
            aria-label="Confirm I am 18 or older and enter the site"
            className="w-full py-3 bg-red-800 hover:bg-red-700 text-white font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            I AM 18+ — ENTER
          </button>
          <a 
            href="https://www.google.com"
            aria-label="Exit the site if under 18"
            className="w-full py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors block focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            I AM UNDER 18 — EXIT
          </a>
        </div>
      </div>
    </div>
  );
}
