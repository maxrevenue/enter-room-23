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
      // API Stub
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
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
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] md:w-[380px] p-6 bg-zinc-900 border border-zinc-800 shadow-2xl">
      <button 
        onClick={handleDismiss} 
        aria-label="Close newsletter popup"
        className="absolute top-4 right-4 text-zinc-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
        <X className="w-4 h-4" />
      </button>
      
      {status === 'success' ? (
        <div className="text-center py-4">
          <h3 className="text-white font-serif text-lg mb-2">Check Your Inbox</h3>
          <p className="text-zinc-400 text-sm">
            Your {siteConfig.discountPercentage}% off code is on the way. Welcome to Room 23.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-white font-serif text-lg mb-2">A Private Invitation</h3>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            Join our private list for {siteConfig.discountPercentage}% off your first order. We respect your inbox—no spam, and emails always arrive discreetly as &quot;Room 23&quot;.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              disabled={status === 'submitting'}
              className="w-full bg-zinc-950 border border-zinc-700 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-800 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-red-800 hover:bg-red-700 text-white py-2.5 text-sm font-medium tracking-wide disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {status === 'submitting' ? 'PROCESSING...' : 'SECURE MY DISCOUNT'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
