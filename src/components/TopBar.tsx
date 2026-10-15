import React from 'react';
import { Sparkles, Wallet, Bell, HelpCircle, Menu, Info, ShieldCheck } from 'lucide-react';
import { ACCOUNT_CONTEXT } from '../data/mockData';

interface TopBarProps {
  onToggleAskCheerio: () => void;
  isAskCheerioOpen: boolean;
  hasRejection: boolean;
  onOpenMobileMenu?: () => void;
  onOpenHowItDecides?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleAskCheerio,
  isAskCheerioOpen,
  hasRejection,
  onOpenMobileMenu,
  onOpenHowItDecides,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Menu Button + Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium min-w-0">
          <span className="text-slate-400 hidden md:inline">Marketing</span>
          <span className="text-slate-300 hidden md:inline">/</span>
          <span className="text-slate-900 font-semibold truncate text-xs sm:text-sm">
            Templates
          </span>
        </div>

        <span className="text-xs text-slate-300 hidden sm:inline">|</span>
        <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium hidden sm:inline truncate">
          Meta Cloud API
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* How Ask Cheerio Decides Info Button */}
        {onOpenHowItDecides && (
          <button
            onClick={onOpenHowItDecides}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            title="How Ask Cheerio decides"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">How it decides</span>
          </button>
        )}

        {/* Wallet Balance Chip */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors">
          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Wallet className="w-3 h-3" />
          </div>
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-none hidden xs:block">
              Wallet
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-800 font-mono leading-tight">
              {ACCOUNT_CONTEXT.walletBalance}
            </p>
          </div>
          <button
            type="button"
            className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs hidden md:inline-block ml-1"
          >
            + Add
          </button>
        </div>

        {/* Support & Docs Icon (hidden on smallest screens to save room) */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors hidden sm:block focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          title="Cheerio Help Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors relative focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
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
          className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-xs shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
            isAskCheerioOpen
              ? 'bg-emerald-700 text-white shadow-emerald-700/20'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
          title="Toggle Ask Cheerio Assistant"
        >
          <div className="relative">
            <Sparkles className={`w-3.5 h-3.5 ${isAskCheerioOpen ? 'text-emerald-200' : 'text-emerald-600'}`} />
            {hasRejection && !isAskCheerioOpen && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            )}
          </div>
          <span className="inline">Ask Cheerio</span>
          {hasRejection && (
            <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full hidden sm:inline">
              1
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
