import React, { useState, useRef, useEffect } from 'react';
import { Sliders, RotateCcw, AlertCircle, HelpCircle, ShieldAlert, Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { DemoScenario } from '../types';

interface DemoControlsProps {
  currentScenario: DemoScenario;
  onSelectScenario: (scenario: DemoScenario) => void;
  onResetDemo: () => void;
  onOpenHowItDecides: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  currentScenario,
  onSelectScenario,
  onResetDemo,
  onOpenHowItDecides
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scenarios: Array<{
    id: DemoScenario;
    label: string;
    tag: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'MAIN_REJECTION',
      label: 'Main Flow: Category Rejection',
      tag: 'Step 1-4',
      desc: 'diwali_offer_2026 rejected. Utility ➔ Marketing fix.',
      icon: Sparkles,
    },
    {
      id: 'EDGE_CASE_A',
      label: 'Edge Case A: Rejected Again (No Reason)',
      tag: 'Human Handoff',
      desc: 'Meta gives no code. Transparent handoff card.',
      icon: AlertCircle,
    },
    {
      id: 'EDGE_CASE_B',
      label: 'Edge Case B: Out-of-Scope Pricing Question',
      tag: 'Policy Guard',
      desc: '"Can you reduce plan price?" Pre-filled ticket form.',
      icon: HelpCircle,
    },
    {
      id: 'EDGE_CASE_C',
      label: 'Edge Case C: Verification Stuck 5 Days',
      tag: 'Meta SLA',
      desc: 'Dashboard banner ➔ 1-sentence explanation ➔ Human.',
      icon: ShieldAlert,
    },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-4 left-4 lg:left-72 z-40 select-none">
      {/* Expanded Popover Menu */}
      {isOpen && (
        <div className="mb-2 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 w-80 p-3 space-y-2 animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Case Study Scenarios
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-slate-400 px-1">
            Jump directly to any scenario or edge case to evaluate Ask Cheerio's guardrails:
          </p>

          <div className="space-y-1">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isActive = currentScenario === sc.id;

              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                    isActive
                      ? 'bg-emerald-950/80 border border-emerald-600/80 text-white'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs truncate">{sc.label}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded shrink-0 ml-1">
                        {sc.tag}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{sc.desc}</p>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-1">
            <button
              onClick={() => {
                onOpenHowItDecides();
                setIsOpen(false);
              }}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              How Cheerio decides &rarr;
            </button>

            <button
              onClick={() => {
                onResetDemo();
                setIsOpen(false);
              }}
              className="flex items-center space-x-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800/60 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-slate-700/80 backdrop-blur-xs transition-all hover:scale-102 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          title="Open demo scenario switcher"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Demo controls</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded-full border border-emerald-500/30">
            {currentScenario === 'MAIN_REJECTION'
              ? 'Main'
              : currentScenario === 'EDGE_CASE_A'
              ? 'Edge A'
              : currentScenario === 'EDGE_CASE_B'
              ? 'Edge B'
              : 'Edge C'}
          </span>
          {isOpen ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronUp className="w-3 h-3 text-slate-400" />}
        </button>

        <button
          onClick={onResetDemo}
          className="bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white p-1.5 rounded-full text-xs shadow-lg border border-slate-700/80 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          title="Reset demo to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
