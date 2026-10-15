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
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  basedOn?: string;
  type?: 'text' | 'fix-proposal' | 'review-complete' | 'human-handoff';
  fixData?: {
    templateId: string;
    currentCategory: TemplateCategory;
    proposedCategory: TemplateCategory;
    summary: string;
  };
  feedbackGiven?: 'up' | 'down' | null;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
