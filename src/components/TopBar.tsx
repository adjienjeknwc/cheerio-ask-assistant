import React from 'react';
import { Sparkles, Wallet, Bell, HelpCircle, Search, ExternalLink } from 'lucide-react';
import { ACCOUNT_CONTEXT } from '../data/mockData';

interface TopBarProps {
  onToggleAskCheerio: () => void;
  isAskCheerioOpen: boolean;
  hasRejection: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleAskCheerio,
  isAskCheerioOpen,
  hasRejection
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span>Marketing</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Message Templates</span>
        </div>
        <span className="text-xs text-slate-300">|</span>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
          Official Meta Cloud API
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Wallet Balance Chip */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors">
          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-3 h-3" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Wallet Balance</p>
            <p className="text-xs font-semibold text-slate-800 font-mono leading-tight">
              {ACCOUNT_CONTEXT.walletBalance}
            </p>
          </div>
          <button
            type="button"
            className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs ml-1"
          >
            + Add
          </button>
        </div>

        {/* Support & Docs Icon */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors relative"
          title="Cheerio Help Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasRejection && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* Persistent Ask Cheerio Button */}
        <button
          onClick={onToggleAskCheerio}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all shadow-xs ${
            isAskCheerioOpen
              ? 'bg-emerald-700 text-white shadow-emerald-700/20'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-3.5 h-3.5 ${isAskCheerioOpen ? 'text-emerald-200' : 'text-emerald-600'}`} />
            {hasRejection && !isAskCheerioOpen && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            )}
          </div>
          <span>Ask Cheerio</span>
          {hasRejection && (
            <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
              1 issue
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
