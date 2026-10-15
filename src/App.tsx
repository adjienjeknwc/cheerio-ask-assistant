import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TemplatesTable } from './components/TemplatesTable';
import { AskCheerioDrawer } from './components/AskCheerioDrawer';
import { TemplateReviewModal } from './components/TemplateReviewModal';
import { Toast } from './components/Toast';
import { INITIAL_TEMPLATES, ACCOUNT_CONTEXT } from './data/mockData';
import { Template, ChatMessage, ToastNotification } from './types';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('templates');
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(INITIAL_TEMPLATES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Track whether the diwali offer has been submitted in the session
  const [isDiwaliSubmitted, setIsDiwaliSubmitted] = useState(false);

  // Initial chat history when Ask Cheerio is opened for diwali_offer_2026
  const initialChatMessages: ChatMessage[] = [
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content:
        "Meta treated this message as a promotion, but it was submitted as a Utility template. Promotional offers need the Marketing category.",
      timestamp: 'Just now',
      basedOn: 'Template status + Meta rejection reason (Error code: 132001)',
      type: 'fix-proposal',
      fixData: {
        templateId: 'tpl_diwali_2026',
        currentCategory: 'UTILITY',
        proposedCategory: 'MARKETING',
        summary:
          'Utility is strictly for transactional notifications like order dispatch or OTPs. Meta requires any message mentioning "sale", "20% off", or festive offers to use Marketing.',
      },
    },
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  // Show Toast
  const addToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    const id = 'toast_' + Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset entire scenario for easy case study testing
  const handleResetScenario = () => {
    setTemplates(INITIAL_TEMPLATES);
    setActiveTemplate(INITIAL_TEMPLATES[0]);
    setIsDiwaliSubmitted(false);
    setIsDrawerOpen(false);
    setIsReviewModalOpen(false);
    setIsTyping(false);
    setChatMessages(initialChatMessages);
    addToast('Scenario Reset', 'All template statuses and assistant state restored to initial view.', 'info');
  };

  // Step 1 -> Step 2: Clicking "Fix with Ask Cheerio"
  const handleFixWithAskCheerio = (template: Template) => {
    setActiveTemplate(template);
    setIsDrawerOpen(true);

    // If template is already submitted, show status context
    if (template.status === 'SUBMITTED') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_submitted_status_' + Date.now(),
            sender: 'assistant',
            content:
              `Template **${template.name}** was submitted under the **Marketing** category. It is currently in Meta's independent review queue.\n\nWe'll notify you as soon as Meta responds. No further action is required right now.`,
            timestamp: 'Just now',
            basedOn: 'Meta Graph API submission receipt',
            type: 'text',
          },
        ]);
      }, 600);
    }
  };

  // Step 2 -> Step 3: Clicking "Review the fix"
  const handleOpenReviewModal = (template: Template) => {
    setActiveTemplate(template);
    setIsReviewModalOpen(true);
  };

  // Step 3 -> Step 4: Clicking "Resubmit to Meta" inside modal
  const handleResubmit = (updatedText: string, newCategory: 'MARKETING') => {
    setIsReviewModalOpen(false);
    setIsDiwaliSubmitted(true);

    // 1. Update status badge in the table to "Submitted" (amber)
    setTemplates((prev) =>
      prev.map((tpl) => {
        if (tpl.id === 'tpl_diwali_2026') {
          return {
            ...tpl,
            category: newCategory,
            status: 'SUBMITTED',
            text: updatedText,
            updatedAt: 'Just now',
          };
        }
        return tpl;
      })
    );

    // 2. Show toast: "Submitted. We'll notify you when Meta responds."
    addToast(
      'Template Submitted',
      "Submitted. We'll notify you when Meta responds."
    );

    // 3. Keep Ask Cheerio drawer open, show typing indicator (~600ms), and append follow-up message
    setIsDrawerOpen(true);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const followUpMsg: ChatMessage = {
        id: 'msg_resubmitted_' + Date.now(),
        sender: 'assistant',
        content:
          "Done! I've resubmitted **diwali_offer_2026** as a **Marketing** template to Meta.\n\nWe'll notify you via WhatsApp & in-app alert as soon as Meta responds. You can safely prepare your Diwali campaign draft while waiting.",
        timestamp: 'Just now',
        basedOn: 'Meta Graph API submission receipt & WhatsApp Business Policy',
        type: 'review-complete',
        feedbackGiven: null,
      };
      setChatMessages((prev) => [...prev, followUpMsg]);
    }, 600);
  };

  // User sends custom query into chat
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Assistant replies with short realistic typing animation (~600ms)
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = '';
      let replyBasedOn = '';
      let replyType: 'text' | 'human-handoff' = 'text';

      const lower = text.toLowerCase();
      if (lower.includes('utility') || lower.includes('category') || lower.includes('marketing')) {
        replyContent =
          "Meta classifies WhatsApp templates into three categories:\n\n• **Utility:** Transactional updates tied to an existing order, shipping tracking, or account alerts.\n• **Marketing:** Promotional messages, discounts, festive sales, product launches, or cart recovery.\n• **Authentication:** One-time passwords (OTP).\n\nBecause this message includes a 20% discount code (DIWALI20), Meta requires the Marketing category.";
        replyBasedOn = 'WhatsApp Business Messaging Policy (Categories)';
      } else if (lower.includes('waiting') || lower.includes('approval') || lower.includes('when') || lower.includes('time')) {
        replyContent =
          "Meta reviews templates independently through an automated and human check. To set accurate expectations: Cheerio never promises approval timelines, as Meta's queue volume fluctuates. As soon as Meta returns a response, we'll notify you immediately on your dashboard and via WhatsApp.";
        replyBasedOn = 'Cheerio SLA & Meta Business Platform Guidelines';
      } else if (lower.includes('human') || lower.includes('support') || lower.includes('agent') || lower.includes('escalate')) {
        replyContent =
          "I've initiated a handoff to our senior support team. Because I can read your account context, you won't need to explain the problem again. All template details and Meta rejection codes have been attached to your ticket.";
        replyBasedOn = 'Cheerio Support Ticket Router';
        replyType = 'human-handoff';
      } else {
        replyContent =
          "I've inspected your Riya Jewels account. Your WhatsApp phone line is active with High quality rating, and your wallet balance is ₹2,450.00. The primary blocker for your Diwali campaign was the category mismatch on diwali_offer_2026.";
        replyBasedOn = 'Account Health & WABA Diagnostics';
      }

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
        basedOn: replyBasedOn,
        type: replyType,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // Feedback handler (thumbs up / thumbs down)
  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setChatMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedbackGiven: feedback } : msg))
    );
  };

  // Escalate to human support
  const handleEscalateToHuman = () => {
    handleSendMessage('I would like to escalate this to human support.');
  };

  // Toggle Ask Cheerio Drawer from top bar or sidebar
  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const rejectedCount = templates.filter((t) => t.status === 'REJECTED').length;

  return (
    <div className="flex h-[100dvh] bg-[#F8FAFC] overflow-hidden text-slate-800">
      {/* Left Sidebar (Desktop + Mobile off-canvas) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        openAskCheerio={() => setIsDrawerOpen(true)}
        rejectedCount={rejectedCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Case Study Guided Scenario Banner (Responsive) */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2 flex items-center justify-between text-xs border-b border-slate-800 shrink-0 gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-semibold text-slate-200 shrink-0 text-[11px] sm:text-xs">
              Walkthrough:
            </span>
            <span className="text-slate-300 truncate text-[11px] sm:text-xs">
              Fix Diwali template rejection with <em>Ask Cheerio</em>
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden md:inline">
              Step: {isDiwaliSubmitted ? '4 of 4 (Submitted)' : isDrawerOpen ? '2 of 4 (Drawer Open)' : '1 of 4 (Start)'}
            </span>
            <button
              onClick={handleResetScenario}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors border border-slate-700 shrink-0"
              title="Reset prototype state to initial rejected template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Top Bar with hamburger trigger on mobile */}
        <TopBar
          onToggleAskCheerio={handleToggleDrawer}
          isAskCheerioOpen={isDrawerOpen}
          hasRejection={rejectedCount > 0}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Tabs router */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'templates' && (
            <TemplatesTable
              templates={templates}
              onFixWithAskCheerio={handleFixWithAskCheerio}
              onPreviewTemplate={(tpl) => {
                setActiveTemplate(tpl);
                setIsReviewModalOpen(true);
              }}
            />
          )}

          {currentTab === 'dashboard' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">Riya Jewels Dashboard</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Overview of WhatsApp audience reach and active campaigns.</p>
                </div>
                <button
                  onClick={() => setCurrentTab('templates')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto"
                >
                  View All Templates &rarr;
                </button>
              </div>

              {/* Alert card on dashboard */}
              {rejectedCount > 0 ? (
                <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-xl mt-0.5 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-rose-900">Campaign Alert: Diwali Template Blocked</h3>
                      <p className="text-xs text-rose-700 mt-1 max-w-xl">
                        Meta rejected "diwali_offer_2026" because it was submitted as Utility instead of Marketing. Your Diwali broadcast cannot be sent until this is resolved.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const rejectedTpl = templates.find((t) => t.status === 'REJECTED');
                      if (rejectedTpl) handleFixWithAskCheerio(rejectedTpl);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fix with Ask Cheerio</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-900 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Diwali template is under review with Meta. You will receive an instant notification once approved.
                  </span>
                </div>
              )}

              {/* Quick metrics grid (Responsive columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">WhatsApp Delivery Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">98.4%</p>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> High Meta Quality
                  </span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Messages Sent This Month</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">14,290</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">Jaipur & Delhi shoppers</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Wallet Balance</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">{ACCOUNT_CONTEXT.walletBalance}</p>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Auto-recharge active</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">Active Templates</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {templates.filter((t) => t.status === 'APPROVED').length} Approved
                  </p>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {templates.filter((t) => t.status === 'SUBMITTED').length} In review
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'campaigns' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Campaigns</h1>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled and broadcast WhatsApp campaigns for Riya Jewels.</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Diwali Festive Mega Sale (Draft)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Audience: All Jaipur & Rajasthan Customers (3,400 contacts)</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
                    {isDiwaliSubmitted ? 'Ready (Awaiting Approval)' : 'Blocked: Template Rejected'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Target Template: <span className="font-mono font-medium">diwali_offer_2026</span>
                </p>
                <button
                  onClick={() => setCurrentTab('templates')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline inline-block"
                >
                  Manage template in Templates tab &rarr;
                </button>
              </div>
            </div>
          )}

          {currentTab === 'wallet' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Wallet & Meta Conversation Billing</h1>
                <p className="text-xs text-slate-500 mt-0.5">Prepaid balance for WhatsApp Marketing and Utility messages.</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 max-w-md space-y-3">
                <p className="text-xs text-slate-500">Current Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{ACCOUNT_CONTEXT.walletBalance}</p>
                <p className="text-xs text-slate-600">
                  Marketing conversation rate: ~₹0.78 / conversation (Meta India rate card)
                </p>
                <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold mt-2">
                  + Add ₹1,000 via UPI / Card
                </button>
              </div>
            </div>
          )}

          {['chatbots', 'contacts', 'integrations', 'settings'].includes(currentTab) && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 capitalize">{currentTab}</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center text-slate-500 text-xs">
                <p>
                  You are viewing the {currentTab} section for <strong>Riya Jewels</strong>.
                </p>
                <button
                  onClick={() => setCurrentTab('templates')}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 inline-block"
                >
                  Back to Message Templates
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ask Cheerio Drawer */}
      <AskCheerioDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTemplate={activeTemplate}
        onReviewFix={handleOpenReviewModal}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onFeedback={handleFeedback}
        isTyping={isTyping}
        isSubmitted={isDiwaliSubmitted}
        onEscalateToHuman={handleEscalateToHuman}
      />

      {/* Template Review Modal (Old vs New Side-by-Side) */}
      {activeTemplate && (
        <TemplateReviewModal
          template={activeTemplate}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onResubmit={handleResubmit}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
