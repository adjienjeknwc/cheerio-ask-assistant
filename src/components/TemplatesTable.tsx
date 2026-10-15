import React, { useState } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  MoreVertical,
  ChevronRight,
  Info
} from 'lucide-react';
import { Template, TemplateStatus } from '../types';

interface TemplatesTableProps {
  templates: Template[];
  onFixWithAskCheerio: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
}

export const TemplatesTable: React.FC<TemplatesTableProps> = ({
  templates,
  onFixWithAskCheerio,
  onPreviewTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | TemplateStatus>('ALL');

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'ALL') return matchesSearch;
    return matchesSearch && tpl.status === selectedFilter;
  });

  const getStatusBadge = (status: TemplateStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Submitted</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>In Review</span>
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    if (category === 'MARKETING') {
      return (
        <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200/80">
          Marketing
        </span>
      );
    }
    if (category === 'UTILITY') {
      return (
        <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/80">
          Utility
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
        {category}
      </span>
    );
  };

  const counts = {
    all: templates.length,
    approved: templates.filter((t) => t.status === 'APPROVED').length,
    rejected: templates.filter((t) => t.status === 'REJECTED').length,
    submitted: templates.filter((t) => t.status === 'SUBMITTED').length,
    pending: templates.filter((t) => t.status === 'PENDING').length,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>WhatsApp Message Templates</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Meta Sync Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage, and inspect WhatsApp pre-approved templates for your campaigns and automated replies.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Sync with Meta</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Rejection Notice Banner if any rejected template exists */}
      {counts.rejected > 0 && (
        <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-rose-900">
                1 template rejected by Meta — Action needed before launching your campaign
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5 truncate">
                Meta flagged category mismatch on <span className="font-mono font-medium">diwali_offer_2026</span>. Ask Cheerio can diagnose and propose the fix.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const rejectedTpl = templates.find((t) => t.status === 'REJECTED');
              if (rejectedTpl) onFixWithAskCheerio(rejectedTpl);
            }}
            className="shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fix with Ask Cheerio</span>
          </button>
        </div>
      )}

      {/* Filters and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setSelectedFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                selectedFilter === 'APPROVED'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Approved</span>
              <span className="text-[10px] opacity-80">({counts.approved})</span>
            </button>
            <button
              onClick={() => setSelectedFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                selectedFilter === 'REJECTED'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Rejected</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedFilter === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {counts.rejected}
              </span>
            </button>
            <button
              onClick={() => setSelectedFilter('SUBMITTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                selectedFilter === 'SUBMITTED'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Submitted</span>
              <span className="text-[10px] opacity-80">({counts.submitted})</span>
            </button>
            <button
              onClick={() => setSelectedFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                selectedFilter === 'PENDING'
                  ? 'bg-slate-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Pending</span>
              <span className="text-[10px] opacity-80">({counts.pending})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search template name or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Template Name & Message Snippet</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Meta Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTemplates.map((template) => {
                const isRejected = template.status === 'REJECTED';
                const isSubmitted = template.status === 'SUBMITTED';

                return (
                  <tr
                    key={template.id}
                    className={`transition-colors ${
                      isRejected
                        ? 'bg-rose-50/20 hover:bg-rose-50/40'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Name & Snippet */}
                    <td className="py-3.5 px-5 max-w-sm">
                      <div className="flex items-start space-x-2.5">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 font-mono text-xs flex items-center space-x-1.5">
                            <span>{template.name}</span>
                            {isRejected && (
                              <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-sans font-medium">
                                Needs Fix
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {template.text}
                          </p>
                          {isRejected && template.rejectionReason && (
                            <p className="text-[10px] text-rose-700 bg-rose-50/90 rounded px-2 py-0.5 mt-1 border border-rose-200/60 inline-flex items-center space-x-1">
                              <Info className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>Meta: {template.rejectionReason}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getCategoryBadge(template.category)}
                    </td>

                    {/* Language */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {template.language}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(template.status)}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {template.updatedAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      {isRejected ? (
                        <button
                          onClick={() => onFixWithAskCheerio(template)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs hover:shadow transition-all group"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-200 group-hover:rotate-12 transition-transform" />
                          <span>Fix with Ask Cheerio</span>
                        </button>
                      ) : isSubmitted ? (
                        <button
                          onClick={() => onFixWithAskCheerio(template)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>View in Ask Cheerio</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onPreviewTemplate(template)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Preview message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No templates found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Showing {filteredTemplates.length} of {templates.length} templates</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Meta Graph API v20.0</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">All submissions adhere to WhatsApp Commerce Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
