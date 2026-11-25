import { CheckCircle2, AlertTriangle, XCircle, FileText, ShieldAlert, Check } from 'lucide-react';
import { useState } from 'react';
import type { DocumentProposal, ProposalStatus } from '../types/chat';

interface DocumentApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: DocumentProposal[];
  onApprove: (proposalId: string, feedback?: string) => void;
  onRequestRevision: (proposalId: string, feedback: string) => void;
  onReject: (proposalId: string, reason: string) => void;
}

export function DocumentApprovalModal({
  isOpen,
  onClose,
  proposals,
  onApprove,
  onRequestRevision,
  onReject,
}: DocumentApprovalModalProps) {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ''
  );
  const [feedbackNote, setFeedbackNote] = useState<string>('');

  if (!isOpen) return null;

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  const pendingCount = proposals.filter((p) => p.status === 'pending_approval').length;
  const approvedCount = proposals.filter((p) => p.status === 'approved').length;
  const revisionCount = proposals.filter((p) => p.status === 'revision_requested').length;

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            DISETUJUI (APPROVED)
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            BUTUH REVISI
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            DITOLAK
          </span>
        );
      case 'pending_approval':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-400 dark:border-amber-700 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            MENUNGGU OTORISASI RIZCO
          </span>
        );
    }
  };

  const handleApproveClick = () => {
    if (!currentProposal) return;
    onApprove(currentProposal.id, feedbackNote);
    setFeedbackNote('');
  };

  const handleRevisionClick = () => {
    if (!currentProposal) return;
    if (!feedbackNote.trim()) {
      alert('Mohon cantumkan catatan arahan / revisi untuk tim pembuat proposal.');
      return;
    }
    onRequestRevision(currentProposal.id, feedbackNote);
    setFeedbackNote('');
  };

  const handleRejectClick = () => {
    if (!currentProposal) return;
    if (!feedbackNote.trim()) {
      alert('Mohon cantumkan alasan penolakan proposal.');
      return;
    }
    onReject(currentProposal.id, feedbackNote);
    setFeedbackNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded-xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0F766E] to-[#042F2E] text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#18181B] dark:text-white tracking-tight">
                  Team Lead Executive Approval Hub
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/40">
                  Rizco Renova Authority (#0)
                </span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-slate-400 mt-0.5">
                Protokol Tata Kelola Sprint 21: Tidak ada task teknis yang dapat dikerjakan sebelum proposal dokumen disetujui.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] text-[#18181B] dark:text-slate-200 hover:bg-[#E5E5E0] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              Tutup [Esc]
            </button>
          </div>
        </div>

        {/* Gatekeeper Banner */}
        <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Gatekeeper Status:</strong> {pendingCount} proposal menunggu otorisasi Anda. Status kerja:{' '}
              {pendingCount > 0 ? (
                <span className="text-amber-700 dark:text-amber-300 font-bold underline">
                  TASK TEKNIS DIBEKUKAN
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  SELURUH WORK ITEMS DIIZINKAN
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-amber-700 dark:text-amber-300">Pending: {pendingCount}</span>
            <span className="text-emerald-700 dark:text-emerald-400">Approved: {approvedCount}</span>
            {revisionCount > 0 && <span className="text-purple-700 dark:text-purple-300">Revisi: {revisionCount}</span>}
          </div>
        </div>

        {/* Body 2-Column: Proposal List & Proposal Document Detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Proposals List */}
          <div className="w-72 sm:w-80 border-r border-[#D4D4CE] dark:border-[#282E3D] bg-slate-50/50 dark:bg-[#11141B]/40 flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] text-[11px] font-bold text-[#71717A] dark:text-slate-400 uppercase tracking-wider">
              Daftar Proposal Sprint 21 ({proposals.length})
            </div>
            <div className="divide-y divide-[#E5E5E0] dark:divide-[#282E3D]/60">
              {proposals.map((prop) => {
                const isSelected = prop.id === currentProposal?.id;
                return (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => {
                      setSelectedProposalId(prop.id);
                      setFeedbackNote(prop.leadNotes || '');
                    }}
                    className={`w-full text-left p-3 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-l-4 border-l-[#0F766E]'
                        : 'hover:bg-slate-100 dark:hover:bg-[#161B22]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400">
                        {prop.id}
                      </span>
                      <span className="text-[10px] text-[#71717A] dark:text-slate-500 font-mono">
                        {prop.submittedAt}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#18181B] dark:text-slate-200 line-clamp-1">
                      {prop.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] dark:text-slate-400 line-clamp-2">
                      {prop.summary}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        Oleh: {prop.authorName.split(' ')[0]}
                      </span>
                      <div>{getStatusBadge(prop.status)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Proposal Document Detail & Decision Panel */}
          {currentProposal ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#161B22]">
              {/* Document Sub-Header */}
              <div className="p-4 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#FAFAF8] dark:bg-[#141820] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30">
                      {currentProposal.id}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      Target Backlog: {currentProposal.targetBacklogId}
                    </span>
                    {getStatusBadge(currentProposal.status)}
                  </div>
                  <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                    {currentProposal.title}
                  </h3>
                  <p className="text-xs text-[#71717A] dark:text-slate-400 mt-0.5">
                    Diajukan oleh: <strong className="text-slate-800 dark:text-slate-200">{currentProposal.authorName}</strong> ({currentProposal.authorRole}) • Divisi: {currentProposal.authorDivision.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Document Content View */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-sm text-[#18181B] dark:text-slate-200">
                <div className="p-3 rounded-lg bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                    Ringkasan Proposal
                  </h4>
                  <p className="text-xs text-[#18181B] dark:text-slate-200 leading-relaxed">
                    {currentProposal.summary}
                  </p>
                </div>

                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-[#11141B]/70 p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D]">
                  {currentProposal.fullDocMarkdown}
                </div>

                {currentProposal.leadNotes && (
                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs">
                    <div className="font-bold text-[#0F766E] dark:text-teal-300 mb-1">
                      Catatan Keputusan Team Lead (Rizco Renova):
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 italic">
                      "{currentProposal.leadNotes}"
                    </p>
                    {currentProposal.reviewedAt && (
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Ditinjau pada pukul {currentProposal.reviewedAt}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action / Decision Footer */}
              <div className="p-4 border-t border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Tulis arahan / catatan keputusan Anda untuk author proposal ini..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[11px] text-[#71717A] dark:text-slate-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>
                      Otorisasi akan otomatis menyiarkan pengumuman resmi ke chat room tim.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRejectClick}
                      className="px-3 py-1.5 text-xs font-semibold rounded border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                    >
                      Tolak Proposal
                    </button>

                    <button
                      type="button"
                      onClick={handleRevisionClick}
                      className="px-3 py-1.5 text-xs font-semibold rounded border border-amber-300 dark:border-amber-900/80 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                    >
                      Minta Revisi
                    </button>

                    <button
                      type="button"
                      onClick={handleApproveClick}
                      className="px-4 py-1.5 text-xs font-bold rounded bg-[#0F766E] text-white hover:bg-[#0D655E] border border-teal-600 shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-200" />
                      <span>Setujui & Otorisasi Task ({currentProposal.targetBacklogId})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Pilih proposal dari daftar sebelah kiri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
