import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Send,
  User,
  Database,
  ExternalLink,
  LifeBuoy,
  CheckCircle2,
  Clock,
  HelpCircle,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { Template, ChatMessage } from '../types';
import { ACCOUNT_CONTEXT } from '../data/mockData';

interface AskCheerioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplate: Template | null;
  onReviewFix: (template: Template) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  isTyping: boolean;
  isSubmitted: boolean;
  onEscalateToHuman: () => void;
}

export const AskCheerioDrawer: React.FC<AskCheerioDrawerProps> = ({
  isOpen,
  onClose,
  activeTemplate,
  onReviewFix,
  messages,
  onSendMessage,
  onFeedback,
  isTyping,
  isSubmitted,
  onEscalateToHuman,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickQuestions = [
    { label: 'Why was Utility rejected?', query: 'Why did Meta reject the Utility category for this message?' },
    { label: 'What happens while waiting?', query: 'How does Meta review work and when will I know?' },
    { label: 'Talk to human agent', action: onEscalateToHuman },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-in">
      {/* Drawer Top Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-slate-900">Ask Cheerio</h2>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                Connected to Account
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Context-aware assistant for Riya Jewels</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onEscalateToHuman}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Escalate to human support"
          >
            <Headphones className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Context Pill & Safety Safeguards */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1.5 text-slate-600">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active context:</span>
          <span className="font-mono font-medium text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            {activeTemplate ? activeTemplate.name : 'Account overview'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Read-only</span>
        </span>
      </div>

      {/* Feature Rules Transparent Strip */}
      <div className="px-4 py-1.5 bg-amber-50/50 border-b border-amber-100 text-[10px] text-amber-900/90 flex items-center justify-between">
        <span>Cheerio acts on your approval • Never promises Meta approval times</span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBFBFC]">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-fade-in`}
            >
              {/* Sender Pill */}
              <div className="flex items-center space-x-1.5 mb-1 px-1">
                {isAssistant ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                      C
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700">Ask Cheerio</span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-semibold text-slate-700">Riya</span>
                    <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center text-[9px] font-bold">
                      R
                    </span>
                  </>
                )}
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                  isAssistant
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-emerald-600 text-white font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Proposed Fix Card (Feature Step 2) */}
                {msg.type === 'fix-proposal' && msg.fixData && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Suggested One-Click Fix</span>
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                          100% compliant
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 my-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 line-through font-mono">
                          {msg.fixData.currentCategory}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold font-mono shadow-2xs">
                          {msg.fixData.proposedCategory}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug">
                        {msg.fixData.summary}
                      </p>

                      <div className="mt-3">
                        <button
                          onClick={() => {
                            if (activeTemplate) onReviewFix(activeTemplate);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5"
                        >
                          <span>Review the fix</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Human Support Handoff Card */}
                {msg.type === 'human-handoff' && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between text-amber-900 font-semibold">
                        <span className="flex items-center space-x-1">
                          <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
                          <span>Human Support Handoff Card</span>
                        </span>
                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono">
                          Ticket #CH-88219
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-amber-200/80 text-[11px] text-slate-700 space-y-1">
                        <p><strong>Account:</strong> Riya Jewels ({ACCOUNT_CONTEXT.phone})</p>
                        <p><strong>Template:</strong> diwali_offer_2026 (ID: tpl_diwali_2026)</p>
                        <p><strong>Diagnosed Issue:</strong> Meta Category Mismatch (Utility ➔ Marketing required)</p>
                        <p><strong>Status:</strong> Assigned to Senior WABA Specialist. No repeat explanation needed.</p>
                      </div>
                      <p className="text-[10px] text-amber-800">
                        Our support team has this entire conversation context. You will be notified in chat and on WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update / Resubmission Receipt */}
                {msg.type === 'review-complete' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Meta Graph API receipt generated: <strong>msg_tpl_sub_891038</strong></span>
                  </div>
                )}

                {/* Verification Source Line (Feature Rule 5) */}
                {msg.basedOn && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center space-x-1.5 text-[10px] text-slate-400">
                    <Database className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="italic font-sans">Based on: {msg.basedOn}</span>
                  </div>
                )}
              </div>

              {/* Feedback Thumbs Up / Down (Feature Step 4) */}
              {isAssistant && (
                <div className="flex items-center space-x-2 mt-1 px-1 text-[11px] text-slate-400">
                  <span>Was this helpful?</span>
                  <button
                    onClick={() => onFeedback(msg.id, 'up')}
                    className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                      msg.feedbackGiven === 'up' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-400'
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onFeedback(msg.id, 'down')}
                    className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                      msg.feedbackGiven === 'down' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-400'
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                  {msg.feedbackGiven && (
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Thanks for the feedback!
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator (~600ms animation) */}
        {isTyping && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="flex items-center space-x-1.5 mb-1 px-1">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                C
              </span>
              <span className="text-[11px] font-semibold text-slate-700">Ask Cheerio is typing...</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xs">
              <div className="flex space-x-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center space-x-1.5 overflow-x-auto">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              if (q.action) {
                q.action();
              } else if (q.query) {
                onSendMessage(q.query);
              }
            }}
            className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Cheerio about your templates, errors, or setup..."
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-700 transition-all shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2 leading-tight">
          Cheerio is read-only. We will never make changes to your Meta account without your explicit click.
        </p>
      </form>
    </div>
  );
};
