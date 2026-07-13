'use client';

import React, { useState, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { ClaimCodeResult } from '@/types';

// ── Icons ──────────────────────────────────────────────────────────
const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
  </span>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth={2.5} className="w-5 h-5">
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth={2.5} className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
  </svg>
);

type Status = 'idle' | 'loading' | 'success' | 'error';

// Hard-coded demo userId — replace with auth.user.id in production
const DEMO_USER_ID = 'your-auth-user-id-here';

export default function LiveCodeBox({ userId }: { userId?: string }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ClaimCodeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserClient();

  const handleSubmit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || status === 'loading') return;

    setStatus('loading');
    setResult(null);

    try {
      const { data, error } = await supabase.rpc('claim_live_code', {
        p_user_id: userId || DEMO_USER_ID,
        p_code: trimmed,
      });

      if (error) throw error;

      const res = data as ClaimCodeResult;
      setResult(res);
      setStatus(res.success ? 'success' : 'error');

      if (res.success) {
        setCode('');
        // Auto-reset after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: 'Bağlantı hatası. Tekrar deneyin.' });
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="
      relative rounded-lg border border-zinc-700/50 bg-[#111111]
      overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]
    ">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
        <LiveDot />
        <span className="text-red-400 font-black text-xs uppercase tracking-widest">
          CANLI YAYIN ŞİFRESİ
        </span>
        <span className="ml-auto text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
          Yayında duyurulan şifreyi girin
        </span>
      </div>

      {/* Input area */}
      <div className="p-5 flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="ŞİFRE — örn: YAYIN2026"
          maxLength={20}
          disabled={status === 'loading' || status === 'success'}
          className="
            flex-1 bg-zinc-900 border border-zinc-700/60 rounded-lg
            px-5 py-3.5 text-white font-mono font-bold text-base
            placeholder:text-zinc-600 tracking-widest
            focus:outline-none focus:border-[#F5A623]/50
            focus:shadow-[0_0_0_2px_rgba(0,230,118,0.1)]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
        <button
          onClick={handleSubmit}
          disabled={!code.trim() || status === 'loading' || status === 'success'}
          className="
            flex items-center justify-center gap-2.5
            px-7 py-3.5 rounded-lg font-black text-sm uppercase tracking-widest
            transition-all duration-200
            disabled:cursor-not-allowed
            bg-[#F5A623] text-black
            hover:shadow-[0_0_24px_rgba(0,230,118,0.4)] hover:scale-[1.02]
            active:scale-[0.98]
            disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:scale-100
          "
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <SendIcon />
              Şifreyi Gönder
            </>
          )}
        </button>
      </div>

      {/* Result feedback */}
      {result && (
        <div
          className={`
            mx-5 mb-5 flex items-start gap-3 rounded-lg px-4 py-3 border
            animate-in fade-in slide-in-from-top-2 duration-300
            ${result.success
              ? 'bg-[#F5A623]/5 border-[#F5A623]/20'
              : 'bg-orange-500/5 border-orange-500/20'
            }
          `}
        >
          {result.success ? <CheckIcon /> : <ErrorIcon />}
          <div className="flex-1">
            <p className={`text-sm font-bold ${result.success ? 'text-[#F5A623]' : 'text-orange-400'}`}>
              {result.message}
            </p>
            {result.success && result.reward_coin && (
              <p className="text-xs text-zinc-400 mt-0.5">
                +{result.reward_coin.toLocaleString('tr-TR')} Coin hesabınıza eklendi.
                Yeni bakiye:{' '}
                <span className="text-[#F5A623] font-black">
                  {result.new_balance?.toLocaleString('tr-TR')} Coin
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
