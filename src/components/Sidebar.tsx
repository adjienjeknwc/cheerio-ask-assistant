import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Bot,
  Users,
  Layers,
  Wallet,
  Settings,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { ACCOUNT_CONTEXT } from '../data/mockData';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  openAskCheerio: () => void;
  rejectedCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openAskCheerio,
  rejectedCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'templates', label: 'Templates', icon: FileText, badge: rejectedCount > 0 ? '1 action' : undefined },
    { id: 'chatbots', label: 'Chatbots', icon: Bot },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Layers },
  ];

  const bottomNavItems = [
    { id: 'wallet', label: 'Wallet', icon: Wallet, extra: ACCOUNT_CONTEXT.walletBalance },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleOpenAskCheerio = () => {
    openAskCheerio();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white border-r border-slate-200 flex flex-col h-[100dvh] lg:h-screen shrink-0 select-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <span className="font-extrabold text-base tracking-tight">c</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base">cheerio</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/60">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">WhatsApp Marketing Platform</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Business Workspace Switcher */}
        <div className="px-3 py-3 border-b border-slate-100">
          <button
            type="button"
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-left transition-colors group"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center border border-amber-200 shrink-0">
                RJ
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700">
                  {ACCOUNT_CONTEXT.businessName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Jaipur • {ACCOUNT_CONTEXT.currentPlan}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-1" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs border border-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse-gentle">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <p className="px-3 pt-5 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Settings & Billing
          </p>

          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs border border-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.extra && (
                  <span className="text-[11px] font-medium text-emerald-700 font-mono bg-emerald-50/70 px-1.5 py-0.5 rounded">
                    {item.extra}
                  </span>
                )}
              </button>
            );
          })}

          {/* Feature Highlight Pill */}
          <div className="pt-4">
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/70 rounded-xl">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ask Cheerio AI</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Connected directly to your Meta WABA account to solve rejections and setup issues.
              </p>
              <button
                onClick={handleOpenAskCheerio}
                className="mt-2.5 w-full bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 font-medium text-[11px] py-2 px-2.5 rounded-lg transition-colors shadow-2xs flex items-center justify-center space-x-1"
              >
                <span>Open Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Meta Status Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700">WhatsApp API</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded border border-emerald-200/60">
              Online
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono truncate">
            {ACCOUNT_CONTEXT.phone}
          </p>

          {/* Persona profile */}
          <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center justify-center">
                R
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-800">Riya</p>
                <p className="text-[10px] text-slate-400">Jaipur, IN</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded font-medium">
              Admin
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
