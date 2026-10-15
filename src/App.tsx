import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TemplatesTable } from './components/TemplatesTable';
import { AskCheerioDrawer } from './components/AskCheerioDrawer';
import { TemplateReviewModal } from './components/TemplateReviewModal';
import { HowItDecidesModal } from './components/HowItDecidesModal';
import { DemoControls } from './components/DemoControls';
import { Toast } from './components/Toast';
import { INITIAL_TEMPLATES, ACCOUNT_CONTEXT } from './data/mockData';
import { Template, ChatMessage, ToastNotification, DemoScenario, HandoffData, TicketFormData } from './types';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('templates');
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(INITIAL_TEMPLATES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isHowItDecidesOpen, setIsHowItDecidesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Demo Scenarios state
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>('MAIN_REJECTION');
  const [isDiwaliSubmitted, setIsDiwaliSubmitted] = useState(false);
  const [isVerificationStuck, setIsVerificationStuck] = useState(false);

  // Initial chat messages
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

  // Toast manager
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast_' + Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard accessibility: Escape key closes modal / drawer / how-it-decides
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHowItDecidesOpen) {
          setIsHowItDecidesOpen(false);
        } else if (isReviewModalOpen) {
          setIsReviewModalOpen(false);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isHowItDecidesOpen, isReviewModalOpen, isDrawerOpen, isMobileMenuOpen]);

  // URL state parameter support for direct linking and screenshotting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state') || window.location.hash.replace('#', '');
    if (!stateParam) return;

    if (stateParam === '01_templates_rejected') {
      setCurrentTab('templates');
      setIsDrawerOpen(false);
      setIsReviewModalOpen(false);
      setTemplates(INITIAL_TEMPLATES);
      setActiveTemplate(INITIAL_TEMPLATES[0]);
    } else if (stateParam === '02_assistant_explains_fix') {
      setCurrentTab('templates');
      setActiveTemplate(INITIAL_TEMPLATES[0]);
      setIsDrawerOpen(true);
      setIsReviewModalOpen(false);
      setChatMessages(initialChatMessages);
    } else if (stateParam === '03_review_old_vs_new') {
      setCurrentTab('templates');
      setActiveTemplate(INITIAL_TEMPLATES[0]);
      setIsReviewModalOpen(true);
      setIsDrawerOpen(false);
    } else if (stateParam === '04_handoff_summary_edge_case') {
      setCurrentTab('templates');
      setCurrentScenario('EDGE_CASE_A');
      const targetTpl = {
        ...INITIAL_TEMPLATES[0],
        status: 'REJECTED' as const,
        category: 'MARKETING' as const,
        rejectionReason: undefined,
        metaErrorCode: '132000 (No reason payload returned)',
        isSecondRejection: true,
      };
      setTemplates((prev) =>
        prev.map((t) => (t.id === 'tpl_diwali_2026' ? targetTpl : t))
      );
      setActiveTemplate(targetTpl);
      const handoff: HandoffData = {
        ticketId: 'Ticket #ESC-89211',
        issue: 'Template rejected again without specific Meta policy reason code',
        tried: 'Category changed from Utility ➔ Marketing, resubmitted to Meta',
        templateName: 'diwali_offer_2026',
        businessId: `${ACCOUNT_CONTEXT.wabaId} (${ACCOUNT_CONTEXT.businessName})`,
        metaResponse: 'Error 132000 (Generic rejection / No detail payload)',
        agentStatus: 'Waiting for a support specialist',
      };
      setChatMessages([
        {
          id: 'msg_edge_a_honest',
          sender: 'assistant',
          content:
            "Meta rejected diwali_offer_2026 again, but this time they did not return a specific error code or policy explanation. I can't see a clear reason this time and won't guess. Let's get our senior WhatsApp team to review this directly with Meta.",
          timestamp: 'Just now',
          basedOn: 'Meta Graph API response (No policy violation detail returned)',
          type: 'rejected-again',
        },
        {
          id: 'msg_handoff_a_card',
          sender: 'assistant',
          content:
            "I've packaged your complete case history for our senior WhatsApp team. A support specialist will reply here in this chat. You won't need to repeat anything.",
          timestamp: 'Just now',
          basedOn: 'Cheerio Priority Escalation Queue',
          type: 'human-handoff',
          handoffData: handoff,
        },
      ]);
      setIsDrawerOpen(true);
      setIsReviewModalOpen(false);
    } else if (stateParam === '05_out_of_scope_ticket_form') {
      setCurrentTab('templates');
      setCurrentScenario('EDGE_CASE_B');
      const ticketData: TicketFormData = {
        subject: 'Pricing & Plan Discount Request — Riya Jewels',
        summary:
          'Customer Riya is inquiring about a custom discount or price adjustment for their current Growth Plan for Riya Jewels.',
        department: 'Billing & Accounts Team',
        submitted: false,
      };
      setChatMessages([
        {
          id: 'msg_user_b_scope',
          sender: 'user',
          content: 'Can you reduce my plan price?',
          timestamp: 'Just now',
        },
        {
          id: 'msg_bot_b_scope',
          sender: 'assistant',
          content:
            'I can only help with WhatsApp setups, message templates, and campaign errors. I cannot modify subscription plans, apply billing discounts, or change pricing.',
          timestamp: 'Just now',
          basedOn: 'Cheerio Platform Scope & Billing Policy',
          type: 'ticket-form',
          ticketFormData: ticketData,
        },
      ]);
      setIsDrawerOpen(true);
      setIsReviewModalOpen(false);
    }
  }, []);

  // RESET DEMO
  const handleResetDemo = () => {
    setTemplates(INITIAL_TEMPLATES);
    setActiveTemplate(INITIAL_TEMPLATES[0]);
    setCurrentScenario('MAIN_REJECTION');
    setIsDiwaliSubmitted(false);
    setIsVerificationStuck(false);
    setIsDrawerOpen(false);
    setIsReviewModalOpen(false);
    setIsHowItDecidesOpen(false);
    setIsTyping(false);
    setChatMessages(initialChatMessages);
    setCurrentTab('templates');
    addToast('Demo Reset', 'All templates and assistant state restored to the initial scenario.', 'info');
  };

  // Scenario Selector (Demo controls)
  const handleSelectScenario = (scenario: DemoScenario) => {
    setCurrentScenario(scenario);

    if (scenario === 'MAIN_REJECTION') {
      setTemplates(INITIAL_TEMPLATES);
      setActiveTemplate(INITIAL_TEMPLATES[0]);
      setIsDiwaliSubmitted(false);
      setIsVerificationStuck(false);
      setCurrentTab('templates');
      setChatMessages(initialChatMessages);
      setIsDrawerOpen(false);
      addToast('Main Flow Loaded', 'diwali_offer_2026 rejected. Click "Fix with Ask Cheerio" to test.', 'info');
    } else if (scenario === 'EDGE_CASE_A') {
      // Edge Case A: Rejected again, no reason from Meta
      setCurrentTab('templates');
      setIsVerificationStuck(false);
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === 'tpl_diwali_2026'
            ? {
                ...t,
                status: 'REJECTED',
                category: 'MARKETING',
                rejectionReason: undefined,
                metaErrorCode: '132000 (No reason payload returned)',
                updatedAt: 'Just now',
                isSecondRejection: true,
              }
            : t
        )
      );
      const targetTpl = {
        ...INITIAL_TEMPLATES[0],
        status: 'REJECTED' as const,
        category: 'MARKETING' as const,
        rejectionReason: undefined,
        metaErrorCode: '132000 (No reason payload returned)',
        isSecondRejection: true,
      };
      setActiveTemplate(targetTpl);
      setIsDrawerOpen(true);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setChatMessages([
          {
            id: 'msg_edge_a_' + Date.now(),
            sender: 'assistant',
            content:
              "Meta rejected diwali_offer_2026 again, but this time they did not return a specific error code or policy explanation. I can't see a clear reason this time and won't guess. Let's connect our senior WhatsApp specialist directly with Meta on your behalf.",
            timestamp: 'Just now',
            basedOn: 'Meta Graph API response (No policy violation detail returned)',
            type: 'rejected-again',
          },
        ]);
      }, 500);

      addToast('Edge Case A Simulated', 'Template rejected again with no error reason from Meta.', 'warning');
    } else if (scenario === 'EDGE_CASE_B') {
      // Edge Case B: Out-of-scope question
      setIsVerificationStuck(false);
      setIsDrawerOpen(true);
      const userText = 'Can you reduce my plan price?';
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg_user_b_' + Date.now(),
          sender: 'user',
          content: userText,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const ticketData: TicketFormData = {
          subject: 'Pricing & Plan Discount Request — Riya Jewels',
          summary:
            'Customer Riya is inquiring about a custom discount or price adjustment for their current Growth Plan for Riya Jewels.',
          department: 'Billing & Accounts Team',
          submitted: false,
        };

        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_bot_b_' + Date.now(),
            sender: 'assistant',
            content:
              'I can only help with WhatsApp setups, message templates, and campaign errors. I cannot modify subscription plans, apply billing discounts, or change pricing.',
            timestamp: 'Just now',
            basedOn: 'Cheerio Platform Scope & Billing Policy',
            type: 'ticket-form',
            ticketFormData: ticketData,
          },
        ]);
      }, 600);

      addToast('Edge Case B Simulated', 'Out-of-scope pricing question submitted to Ask Cheerio.', 'info');
    } else if (scenario === 'EDGE_CASE_C') {
      // Edge Case C: Business verification stuck for 5 days
      setIsVerificationStuck(true);
      setCurrentTab('dashboard');
      setIsDrawerOpen(false);
      addToast(
        'Edge Case C Simulated',
        'Verification stuck for 5 days. Check the alert banner on the Dashboard.',
        'warning'
      );
    }
  };

  // Step 1 -> Step 2: Clicking "Fix with Ask Cheerio"
  const handleFixWithAskCheerio = (template: Template) => {
    setActiveTemplate(template);
    setIsDrawerOpen(true);

    if (template.isSecondRejection) {
      // Edge Case A behavior
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages([
          {
            id: 'msg_second_rej_' + Date.now(),
            sender: 'assistant',
            content:
              "Meta rejected diwali_offer_2026 again without providing a policy reason code. Cheerio never guesses when the source data is missing. I can hand this off to our human support team with your full context.",
            timestamp: 'Just now',
            basedOn: 'Meta Graph API response (No policy violation detail returned)',
            type: 'rejected-again',
          },
        ]);
      }, 500);
    } else if (template.status === 'SUBMITTED') {
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

  // Step 2 -> Step 3: Review Modal
  const handleOpenReviewModal = (template: Template) => {
    setActiveTemplate(template);
    setIsReviewModalOpen(true);
  };

  // Step 3 -> Step 4: Resubmission to Meta
  const handleResubmit = (updatedText: string, newCategory: 'MARKETING') => {
    setIsReviewModalOpen(false);
    setIsDiwaliSubmitted(true);

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

    addToast('Template Submitted', "Submitted. We'll notify you when Meta responds.");

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

  // EDGE CASE A: Clicking "Talk to a person" after second rejection
  const handleSecondRejectionHandoff = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const handoff: HandoffData = {
        ticketId: 'Ticket #ESC-89211',
        issue: 'Template rejected again without specific Meta policy reason code',
        tried: 'Category changed from Utility ➔ Marketing, resubmitted to Meta',
        templateName: 'diwali_offer_2026',
        businessId: `${ACCOUNT_CONTEXT.wabaId} (${ACCOUNT_CONTEXT.businessName})`,
        metaResponse: 'Error 132000 (Generic rejection / No detail payload)',
        agentStatus: 'Waiting for a support specialist',
      };

      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg_handoff_a_' + Date.now(),
          sender: 'assistant',
          content: "I've packaged your complete case history for our senior WhatsApp team. A support specialist will reply here in this chat. You won't need to repeat anything.",
          timestamp: 'Just now',
          basedOn: 'Cheerio Priority Escalation Queue',
          type: 'human-handoff',
          handoffData: handoff,
        },
      ]);
    }, 500);
  };

  // EDGE CASE B: Submitting pre-filled ticket form
  const handleSubmitTicketForm = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.ticketFormData
          ? {
              ...m,
              ticketFormData: { ...m.ticketFormData, submitted: true, ticketNumber: '#BILL-4401' },
            }
          : m
      )
    );
    addToast('Ticket #BILL-4401 Sent', 'Our billing team will review your account and email you.', 'success');
  };

  // EDGE CASE C: Trigger from Dashboard verification banner
  const handleOpenVerificationStuckChat = () => {
    setIsDrawerOpen(true);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const handoff: HandoffData = {
        ticketId: 'Ticket #VERIF-9912',
        issue: 'WhatsApp Business verification stuck for 5 days in "Pending Review"',
        tried: 'Automated verification polling (5 days elapsed without status update from Meta)',
        businessId: `BM-881920-IN (${ACCOUNT_CONTEXT.businessName})`,
        metaResponse: 'Verification Pending Review > 72h SLA',
        agentStatus: 'Waiting for Meta Partner Liaison to file Tier 2 ticket',
      };

      setChatMessages([
        {
          id: 'msg_edge_c_' + Date.now(),
          sender: 'assistant',
          content:
            "Meta business verifications taking longer than 72 hours require direct manual intervention with Meta's developer tier support — our team needs to contact Meta on your behalf.",
          timestamp: 'Just now',
          basedOn: 'Meta Business Manager Verification SLA (> 72 hours)',
          type: 'verification-handoff',
          handoffData: handoff,
        },
      ]);
    }, 500);
  };

  // Free-form user chat input
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();

      // Check Edge Case B trigger
      if (lower.includes('price') || lower.includes('discount') || lower.includes('plan') || lower.includes('reduce')) {
        const ticketData: TicketFormData = {
          subject: 'Pricing & Plan Discount Request — Riya Jewels',
          summary:
            'Customer Riya is inquiring about a custom discount or price adjustment for their current Growth Plan for Riya Jewels.',
          department: 'Billing & Accounts Team',
          submitted: false,
        };

        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          content:
            'I can only help with WhatsApp setups, message templates, and campaign errors. I cannot modify subscription plans, apply billing discounts, or change pricing.',
          timestamp: 'Just now',
          basedOn: 'Cheerio Platform Scope & Billing Policy',
          type: 'ticket-form',
          ticketFormData: ticketData,
        };
        setChatMessages((prev) => [...prev, botMsg]);
        return;
      }

      if (lower.includes('utility') || lower.includes('category') || lower.includes('marketing')) {
        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          content:
            "Meta classifies WhatsApp templates into three categories:\n\n• **Utility:** Transactional updates tied to an existing order, shipping tracking, or account alerts.\n• **Marketing:** Promotional messages, discounts, festive sales, product launches, or cart recovery.\n• **Authentication:** One-time passwords (OTP).\n\nBecause this message includes a 20% discount code (DIWALI20), Meta requires the Marketing category.",
          timestamp: 'Just now',
          basedOn: 'WhatsApp Business Messaging Policy (Categories)',
          type: 'text',
        };
        setChatMessages((prev) => [...prev, botMsg]);
        return;
      }

      if (lower.includes('waiting') || lower.includes('approval') || lower.includes('when') || lower.includes('time')) {
        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          content:
            "Meta reviews templates independently through an automated and human check. To set accurate expectations: Cheerio never promises approval timelines, as Meta's queue volume fluctuates. As soon as Meta returns a response, we'll notify you immediately on your dashboard and via WhatsApp.",
          timestamp: 'Just now',
          basedOn: 'Cheerio SLA & Meta Business Platform Guidelines',
          type: 'text',
        };
        setChatMessages((prev) => [...prev, botMsg]);
        return;
      }

      if (lower.includes('human') || lower.includes('support') || lower.includes('agent') || lower.includes('person') || lower.includes('escalate')) {
        const handoff: HandoffData = {
          ticketId: 'Ticket #CH-88219',
          issue: activeTemplate?.name ? `Assistance with ${activeTemplate.name}` : 'General WhatsApp setup question',
          tried: 'In-app account diagnostics with Ask Cheerio',
          templateName: activeTemplate?.name,
          businessId: `${ACCOUNT_CONTEXT.wabaId} (${ACCOUNT_CONTEXT.businessName})`,
          metaResponse: activeTemplate?.rejectionReason || 'No Meta error code',
          agentStatus: 'Waiting for a support specialist',
        };

        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          content:
            "I've initiated a handoff to our senior support team. Because I can read your account context, you won't need to explain the problem again. All template details and Meta rejection codes have been attached to your ticket.",
          timestamp: 'Just now',
          basedOn: 'Cheerio Support Ticket Router',
          type: 'human-handoff',
          handoffData: handoff,
        };
        setChatMessages((prev) => [...prev, botMsg]);
        return;
      }

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        content:
          "I've inspected your Riya Jewels account. Your WhatsApp phone line is active with High quality rating, and your wallet balance is ₹2,450.00. Let me know if you would like me to inspect any template or setup step.",
        timestamp: 'Just now',
        basedOn: 'Account Health & WABA Diagnostics',
        type: 'text',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setChatMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedbackGiven: feedback } : msg))
    );
  };

  const rejectedCount = templates.filter((t) => t.status === 'REJECTED').length;

  return (
    <div className="flex h-[100dvh] bg-[#F8FAFC] overflow-hidden text-slate-800">
      {/* Left Sidebar */}
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
        {/* Top Scenario Banner */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2 flex items-center justify-between text-xs border-b border-slate-800 shrink-0 gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-semibold text-slate-200 shrink-0 text-[11px] sm:text-xs">
              Scenario:
            </span>
            <span className="text-slate-300 truncate text-[11px] sm:text-xs">
              {currentScenario === 'MAIN_REJECTION' && 'Main Flow: Category Rejection Fix (Utility ➔ Marketing)'}
              {currentScenario === 'EDGE_CASE_A' && 'Edge Case A: Rejected Again (No Reason) ➔ Transparent Handoff'}
              {currentScenario === 'EDGE_CASE_B' && 'Edge Case B: Out-of-Scope Pricing Inquiry ➔ Pre-filled Ticket'}
              {currentScenario === 'EDGE_CASE_C' && 'Edge Case C: Verification Stuck for 5 Days ➔ Partner Escalation'}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={() => setIsHowItDecidesOpen(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium hidden sm:inline"
            >
              How Cheerio decides
            </button>
            <button
              onClick={handleResetDemo}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors border border-slate-700 shrink-0"
              title="Reset demo to initial rejected template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Top Bar */}
        <TopBar
          onToggleAskCheerio={() => setIsDrawerOpen((prev) => !prev)}
          isAskCheerioOpen={isDrawerOpen}
          hasRejection={rejectedCount > 0}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenHowItDecides={() => setIsHowItDecidesOpen(true)}
        />

        {/* Main Routed Views */}
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
              {/* EDGE CASE C BANNER: Business Verification Stuck for 5 Days */}
              {isVerificationStuck && (
                <div className="p-4 sm:p-5 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-fade-in">
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl mt-0.5 shrink-0">
                      <ShieldAlert className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-amber-950">
                          Your WhatsApp business verification is taking longer than usual.
                        </h3>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                          5 Days In Review
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Meta's automated verification window has elapsed. Ask Cheerio can route this directly to our partner team to contact Meta on your behalf.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenVerificationStuckChat}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex items-center justify-center space-x-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Cheerio to resolve</span>
                  </button>
                </div>
              )}

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

              {/* Template alert card on dashboard */}
              {rejectedCount > 0 ? (
                <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-xl mt-0.5 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-rose-900">Campaign Alert: Diwali Template Blocked</h3>
                      <p className="text-xs text-rose-700 mt-1 max-w-xl">
                        Meta rejected "diwali_offer_2026". Your Diwali broadcast cannot be sent until this template is approved.
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

              {/* Quick metrics grid */}
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
        onEscalateToHuman={() => handleSendMessage('I would like to escalate this to human support.')}
        onOpenHowItDecides={() => setIsHowItDecidesOpen(true)}
        onSubmitTicketForm={handleSubmitTicketForm}
        onRequestSecondRejectionHandoff={handleSecondRejectionHandoff}
      />

      {/* Template Review Modal */}
      {activeTemplate && (
        <TemplateReviewModal
          template={activeTemplate}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onResubmit={handleResubmit}
        />
      )}

      {/* How Ask Cheerio Decides Modal */}
      <HowItDecidesModal
        isOpen={isHowItDecidesOpen}
        onClose={() => setIsHowItDecidesOpen(false)}
      />

      {/* Demo Controls Floating Menu in Bottom-Left */}
      <DemoControls
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onResetDemo={handleResetDemo}
        onOpenHowItDecides={() => setIsHowItDecidesOpen(true)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
