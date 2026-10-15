import React from 'react';
import { CheckCheck } from 'lucide-react';

interface WhatsAppPreviewProps {
  text: string;
  sampleVariables?: Record<string, string>;
  category?: string;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  text,
  sampleVariables = { '1': 'Priya', '2': 'https://riyajewels.in/diwali-sale' },
  category = 'MARKETING'
}) => {
  // Replace {{1}}, {{2}} with sample variables
  let formattedText = text;
  Object.entries(sampleVariables).forEach(([key, val]) => {
    formattedText = formattedText.replaceAll(`{{${key}}}`, val);
  });

  return (
    <div className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-[#EFEAE2]">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-1 ring-white/40">
            RJ
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-xs text-white">Riya Jewels</span>
              <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-[10px] text-emerald-100/90 leading-tight">Official Business Account</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">
          {category}
        </span>
      </div>

      {/* WhatsApp Message Body */}
      <div className="p-3.5 space-y-2 min-h-[170px] flex flex-col justify-end">
        {/* Date pill */}
        <div className="text-center my-1">
          <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-2 py-0.5 rounded-full shadow-2xs font-medium">
            Today
          </span>
        </div>

        {/* Message bubble */}
        <div className="relative self-start max-w-[92%] bg-white rounded-lg rounded-tl-none p-2.5 shadow-xs text-slate-800 text-[12px] leading-relaxed border border-slate-100">
          {/* Bubble tail */}
          <div className="absolute top-0 -left-1.5 w-2 h-2 overflow-hidden">
            <div className="w-3 h-3 bg-white rotate-45 transform origin-top-right shadow-2xs" />
          </div>

          <div className="whitespace-pre-wrap break-words">
            {formattedText.split(' ').map((word, i) => {
              if (word.startsWith('http://') || word.startsWith('https://')) {
                return (
                  <span key={i} className="text-blue-600 underline font-medium break-all">
                    {word}{' '}
                  </span>
                );
              }
              if (word.startsWith('DIWALI20') || word.startsWith('WELCOME10')) {
                return (
                  <span key={i} className="font-bold bg-amber-50 text-amber-900 px-1 rounded border border-amber-200">
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </div>

          <div className="flex items-center justify-end space-x-1 mt-1.5 pt-0.5 text-[9px] text-slate-400">
            <span>10:45 AM</span>
            <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
          </div>
        </div>

        {/* Action Button Preview */}
        <div className="self-start w-[92%] bg-white rounded-lg p-2 text-center text-xs font-medium text-emerald-700 hover:bg-emerald-50 cursor-default border border-slate-100 shadow-2xs flex items-center justify-center space-x-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Shop Diwali Sale</span>
        </div>
      </div>

      {/* WhatsApp Input Mock Bar */}
      <div className="bg-[#F0F2F5] px-3 py-1.5 border-t border-slate-200 flex items-center justify-between text-slate-400 text-[11px]">
        <span>Message preview</span>
        <span className="text-[10px] text-slate-400 font-mono">Meta WhatsApp Cloud</span>
      </div>
    </div>
  );
};
