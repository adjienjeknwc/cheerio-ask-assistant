export type TemplateCategory = 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';

export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUBMITTED';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  language: string;
  text: string;
  rejectionReason?: string;
  metaErrorCode?: string;
  updatedAt: string;
  createdAt: string;
  sampleVariables?: Record<string, string>;
  header?: string;
  buttons?: Array<{ type: string; text: string }>;
  isSecondRejection?: boolean;
}

export interface HandoffData {
  ticketId: string;
  issue: string;
  tried: string;
  templateName?: string;
  businessId: string;
  metaResponse: string;
  agentStatus: string;
  submittedAt?: string;
}

export interface TicketFormData {
  subject: string;
  summary: string;
  department: string;
  submitted: boolean;
  ticketNumber?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  basedOn?: string;
  type?:
    | 'text'
    | 'fix-proposal'
    | 'review-complete'
    | 'human-handoff'
    | 'rejected-again'
    | 'ticket-form'
    | 'verification-handoff';
  fixData?: {
    templateId: string;
    currentCategory: TemplateCategory;
    proposedCategory: TemplateCategory;
    summary: string;
  };
  handoffData?: HandoffData;
  ticketFormData?: TicketFormData;
  feedbackGiven?: 'up' | 'down' | null;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type DemoScenario = 'MAIN_REJECTION' | 'EDGE_CASE_A' | 'EDGE_CASE_B' | 'EDGE_CASE_C';
