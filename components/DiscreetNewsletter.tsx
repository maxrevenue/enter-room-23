'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { siteConfig } from '@/lib/config';
import { X } from 'lucide-react';

export default function DiscreetNewsletter() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const hasSeen = Cookies.get('room23_newsletter_seen');
    const hasSubscribed = Cookies.get('room23_subscribed');
    
    if (!hasSeen && !hasSubscribed) {
      const timer = setTimeout(() => setIsVisible(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Cookies.set('room23_newsletter_seen', 'true', { expires: 14 });
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Subscription failed');
      }
      
      Cookies.set('room23_newsletter_seen', 'true', { expires: 365 });
      Cookies.set('room23_subscribed', 'true', { expires: 365 });
      
      setStatus('success');
      setTimeout(() => setIsVisible(false), 4000);
    } catch (error) {
      console.error("Subscription failed", error);
      setStatus('idle');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] md:w-[380px] p-6 bg-theme-surface border border-theme-border shadow-2xl">
      <button 
        onClick={handleDismiss} 
        aria-label="Close newsletter popup"
        className="absolute top-4 right-4 text-theme-muted hover:text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-muted"
      >
        <X className="w-4 h-4" />
      </button>
      
      {status === 'success' ? (
        <div className="text-center py-4">
          <h3 className="text-theme-text font-serif text-lg mb-2">Check Your Inbox</h3>
          <p className="text-theme-muted text-sm">
            Your {siteConfig.discountPercentage}% off code is on the way. Welcome to Room 23.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-theme-text font-serif text-lg mb-2">Notes from Room 23</h3>
          <p className="text-theme-muted text-sm mb-4 leading-relaxed">
            Join the list for {siteConfig.discountPercentage}% off your first order. Occasional notes. No noise.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              disabled={status === 'submitting'}
              className="w-full border border-theme-border bg-theme-bg px-4 py-2.5 text-theme-text text-sm focus:border-theme-accent focus:outline-none disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-theme-accent py-2.5 text-sm font-medium tracking-wide text-theme-bg transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-surface disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending…' : 'Join the list'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
