import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, UserCheck, Eye } from 'lucide-react';

interface HowItDecidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItDecidesModal: React.FC<HowItDecidesModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-decides-title"
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="how-it-decides-title" className="text-sm font-bold text-slate-900">
                How Ask Cheerio Decides
              </h3>
              <p className="text-[10px] text-slate-400">Our safety & transparent intelligence principles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            title="Close dialog (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Core Rules/Bullets */}
        <div className="py-4 space-y-3.5 text-xs text-slate-700">
          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">1. Reads your account read-only</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Inspects template statuses, Meta rejection error codes, and setup progress. It cannot alter your account or send messages in the background.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">2. Asks before changing anything</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Proposes ONE clear next step in plain language. Any resubmission or modification requires your explicit review and click.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">3. Hands off to a person when unsure</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Never guesses, hallucinates discounts, or makes false policy promises. If Meta returns no code or a query is out of scope, it packages full context for a human specialist.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono text-[10px]">Verified against Meta v20.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
