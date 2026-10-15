import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Send,
  Database,
  LifeBuoy,
  CheckCircle2,
  Headphones,
  Info,
  Clock,
  UserCheck,
  FileText,
  AlertCircle
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
  onOpenHowItDecides?: () => void;
  onSubmitTicketForm?: (messageId: string) => void;
  onRequestSecondRejectionHandoff?: () => void;
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
  onOpenHowItDecides,
  onSubmitTicketForm,
  onRequestSecondRejectionHandoff,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Accessible keyboard support: Esc key closes the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Auto-focus input on open
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    { label: 'Can you reduce plan price?', query: 'Can you reduce my plan price?' },
    { label: 'Talk to human agent', action: onEscalateToHuman },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-35 sm:hidden transition-opacity"
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] max-w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col h-[100dvh] animate-slide-in"
        role="dialog"
        aria-label="Ask Cheerio Help Assistant"
      >
        {/* Drawer Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-sm font-bold text-slate-900 truncate">Ask Cheerio</h2>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                  Account Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Context-aware assistant for Riya Jewels</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {onOpenHowItDecides && (
              <button
                onClick={onOpenHowItDecides}
                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                title="How Ask Cheerio decides"
                aria-label="How Ask Cheerio decides"
              >
                <Info className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onEscalateToHuman}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              title="Escalate to human support"
              aria-label="Escalate to human support"
            >
              <Headphones className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              title="Close drawer (Esc)"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Account Context Pill & Safety Safeguards */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center space-x-1.5 text-slate-600 min-w-0">
            <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="shrink-0">Context:</span>
            <span className="font-mono font-medium text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate">
              {activeTemplate ? activeTemplate.name : 'Account overview'}
            </span>
          </div>

          {onOpenHowItDecides ? (
            <button
              onClick={onOpenHowItDecides}
              className="text-[10px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1 underline decoration-dotted ml-2 shrink-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>How Cheerio decides</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-400 flex items-center space-x-1 shrink-0 ml-2">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Read-only</span>
            </span>
          )}
        </div>

        {/* Feature Rules Transparent Strip */}
        <div className="px-4 py-1.5 bg-amber-50/50 border-b border-amber-100 text-[10px] text-amber-900/90 flex items-center justify-between shrink-0">
          <span className="truncate">Explicit approvals only • Zero guessing • Full human handoff when needed</span>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#FBFBFC]">
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
                  className={`max-w-[95%] sm:max-w-[92%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed shadow-2xs ${
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
                            Compliant
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                          >
                            <span>Review the fix</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EDGE CASE A: Honest Rejection Card with "Talk to a person" */}
                  {msg.type === 'rejected-again' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center space-x-1.5 text-rose-900 font-semibold text-xs">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>No Meta Error Code Returned</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Rather than guessing what went wrong, Cheerio connects you directly with a human specialist who will contact Meta on your behalf.
                        </p>
                        <button
                          onClick={onRequestSecondRejectionHandoff || onEscalateToHuman}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors shadow-xs flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Talk to a person</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* HANDOFF SUMMARY CARD (Used in Edge Case A, Edge Case C, and General Escalation) */}
                  {(msg.type === 'human-handoff' || msg.type === 'verification-handoff') && msg.handoffData && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 text-xs space-y-2.5">
                        <div className="flex items-center justify-between text-amber-950 font-bold">
                          <span className="flex items-center space-x-1.5">
                            <LifeBuoy className="w-4 h-4 text-amber-700" />
                            <span>Handoff Summary to Human Support</span>
                          </span>
                          <span className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-full border border-amber-300 font-mono">
                            {msg.handoffData.ticketId}
                          </span>
                        </div>

                        {/* Detailed Handoff Key-Values */}
                        <div className="bg-white p-3 rounded-xl border border-amber-200 text-[11px] text-slate-700 space-y-1.5">
                          <p>
                            <strong className="text-slate-900">Issue:</strong> {msg.handoffData.issue}
                          </p>
                          <p>
                            <strong className="text-slate-900">What was already tried:</strong> {msg.handoffData.tried}
                          </p>
                          {msg.handoffData.templateName && (
                            <p>
                              <strong className="text-slate-900">Template name:</strong>{' '}
                              <span className="font-mono bg-slate-100 px-1 rounded">{msg.handoffData.templateName}</span>
                            </p>
                          )}
                          <p>
                            <strong className="text-slate-900">Business ID:</strong>{' '}
                            <span className="font-mono">{msg.handoffData.businessId}</span>
                          </p>
                          <p>
                            <strong className="text-slate-900">Meta response:</strong>{' '}
                            <span className="font-mono text-rose-700">{msg.handoffData.metaResponse}</span>
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-800 font-medium">
                          A support specialist will reply here in this chat. You won't need to repeat anything.
                        </p>

                        {/* Agent-side Status Line (No promised response time) */}
                        <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10px] text-amber-900">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="font-semibold">{msg.handoffData.agentStatus}</span>
                          </div>
                          <span className="text-slate-500">Live priority queue</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EDGE CASE B: Pre-filled Ticket Form */}
                  {msg.type === 'ticket-form' && msg.ticketFormData && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
                          <span className="flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Billing Support Ticket (Pre-filled)</span>
                          </span>
                          <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono">
                            Auto-drafted
                          </span>
                        </div>

                        {!msg.ticketFormData.submitted ? (
                          <>
                            <div className="space-y-2 text-[11px]">
                              <div>
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                  Subject
                                </label>
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800 font-medium">
                                  {msg.ticketFormData.subject}
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                  Auto-Summary from Chat
                                </label>
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                                  {msg.ticketFormData.summary}
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                  Routing Department
                                </label>
                                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[10px] border border-blue-200">
                                  {msg.ticketFormData.department}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (onSubmitTicketForm) onSubmitTicketForm(msg.id);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send to support</span>
                            </button>
                          </>
                        ) : (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                            <p className="font-bold flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Ticket {msg.ticketFormData.ticketNumber || '#BILL-4401'} Submitted</span>
                            </p>
                            <p className="text-slate-600 leading-snug">
                              Our billing team will review your account history and email you at <strong>riya@riyajewels.in</strong>.
                            </p>
                          </div>
                        )}
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
                      className={`p-1 rounded hover:bg-slate-100 transition-colors focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                        msg.feedbackGiven === 'up' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-400'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onFeedback(msg.id, 'down')}
                      className={`p-1 rounded hover:bg-slate-100 transition-colors focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                        msg.feedbackGiven === 'down' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-400'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    {msg.feedbackGiven && (
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Thanks for feedback!
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

        {/* Quick Suggestions Chips (Horizontal scrolling) */}
        <div className="px-3 sm:px-4 py-2 border-t border-slate-100 bg-white flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0">
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
              className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about templates, errors, setup..."
              className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-1.5 p-2 rounded-lg bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-700 transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
            Read-only assistant. Never makes changes without your explicit click. Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[9px]">Esc</kbd> to close.
          </p>
        </form>
      </div>
    </>
  );
};
