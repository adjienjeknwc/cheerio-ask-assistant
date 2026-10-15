import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2, Send, Edit3, Sparkles } from 'lucide-react';
import { Template } from '../types';
import { WhatsAppPreview } from './WhatsAppPreview';

interface TemplateReviewModalProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onResubmit: (updatedText: string, newCategory: 'MARKETING') => void;
}

export const TemplateReviewModal: React.FC<TemplateReviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onResubmit,
}) => {
  const [templateText, setTemplateText] = useState(template.text);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'PROPOSED' | 'ORIGINAL'>('PROPOSED');

  // Accessible keyboard support: Esc key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate brief network submission to Meta Graph API
    setTimeout(() => {
      setIsSubmitting(false);
      onResubmit(templateText, 'MARKETING');
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full h-[96dvh] sm:h-auto sm:max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span id="review-modal-title" className="text-sm sm:text-base font-bold text-slate-900">
                Review & Resubmit Template
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 hidden xs:inline">
                Ask Cheerio Fix
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Compare the rejected submission with the recommended Marketing category before sending to Meta.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safeguard Banner: Read-only on account, explicit user approval */}
        <div className="bg-emerald-50/90 border-b border-emerald-100/80 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center space-x-2 text-[11px] sm:text-xs text-emerald-900 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Read-only safeguard:</strong> No changes are applied to your Meta account until you click <em>Resubmit to Meta</em>.
          </span>
        </div>

        {/* Mobile Tab Switcher (Visible on < md) */}
        <div className="md:hidden px-4 pt-3 pb-1 bg-white border-b border-slate-100 flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setMobileTab('PROPOSED')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
              mobileTab === 'PROPOSED'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proposed Fix (New)</span>
          </button>
          <button
            onClick={() => setMobileTab('ORIGINAL')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
              mobileTab === 'ORIGINAL'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span>Original (Rejected)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column: Old / Rejected Template */}
            <div
              className={`bg-rose-50/30 rounded-2xl p-4 sm:p-5 border border-rose-200/80 space-y-4 flex flex-col ${
                mobileTab === 'ORIGINAL' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-xs text-slate-800">Original Submission</span>
                </div>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200">
                  Rejected by Meta
                </span>
              </div>

              {/* Category Difference Display */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100 text-rose-800 line-through border border-rose-300">
                    <span>Utility</span>
                  </span>
                  <span className="text-xs text-rose-600 font-medium">(Incorrect tier for discounts)</span>
                </div>
              </div>

              {/* Rejection Diagnosis */}
              <div className="bg-white rounded-xl p-3 border border-rose-200 text-xs space-y-1">
                <p className="font-semibold text-rose-900 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Meta Rejection Reason:</span>
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  "Template content appears promotional (discounts/offers) rather than utility/transactional."
                </p>
                <p className="text-[10px] text-slate-400 font-mono pt-1">
                  Error Code: 132001 (Template Category Mismatch)
                </p>
              </div>

              {/* Original Text (Static) */}
              <div className="flex-1">
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Submitted Text
                </label>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  {template.text}
                </div>
              </div>
            </div>

            {/* Right Column: New / Proposed Fix */}
            <div
              className={`bg-emerald-50/20 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-4 flex flex-col ${
                mobileTab === 'PROPOSED' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-xs text-slate-800">Proposed Fix</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300">
                  Ready to Resubmit
                </span>
              </div>

              {/* Category Change */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  New Category
                </label>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marketing</span>
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">
                    (Complies with WhatsApp policy)
                  </span>
                </div>
              </div>

              {/* Editable Text Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    <span>Template Message Text (Editable)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {templateText.length} chars
                  </span>
                </div>
                <textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 sm:p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 leading-relaxed font-sans focus-visible:ring-2 focus-visible:ring-emerald-500"
                  placeholder="Enter template message text..."
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Use {'{{1}}'}, {'{{2}}'} for personalized fields.
                </p>
              </div>

              {/* WhatsApp Bubble Preview */}
              <div className="pt-2 flex-1 flex flex-col justify-center">
                <p className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center space-x-1">
                  <span>Customer Phone Preview</span>
                  <span className="text-[10px] text-slate-400 font-normal">(WhatsApp Live Bubble)</span>
                </p>
                <WhatsAppPreview
                  text={templateText}
                  sampleVariables={template.sampleVariables}
                  category="MARKETING"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Compliance & Actions (Sticky at bottom on mobile) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center space-x-1.5 text-center sm:text-left">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 hidden sm:inline-block"></span>
            <span>
              Meta reviews templates independently. Cheerio does not guarantee approval timelines.
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors text-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-sm transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Resubmitting...' : 'Resubmit to Meta'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
