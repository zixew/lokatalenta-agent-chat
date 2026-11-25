import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FileText,
  Lock,
  Plus,
  Rocket,
  Shield,
  ShieldAlert,
  Terminal,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { DocumentProposal, ProposalStatus } from '../types/chat';

interface DocumentApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: DocumentProposal[];
  onApprove: (proposalId: string, feedback?: string) => void;
  onRequestRevision: (proposalId: string, feedback: string) => void;
  onReject: (proposalId: string, reason: string) => void;
  onCreateProposal?: (newProp: Omit<DocumentProposal, 'id' | 'status' | 'submittedAt'>) => void;
  onAuthorizeRelease?: (releaseVersion: string, releaseNotes: string) => void;
}

export function DocumentApprovalModal({
  isOpen,
  onClose,
  proposals,
  onApprove,
  onRequestRevision,
  onReject,
  onCreateProposal,
  onAuthorizeRelease,
}: DocumentApprovalModalProps) {
  const [activeTab, setActiveTab] = useState<'proposals' | 'new_proposal' | 'release_gate'>('proposals');
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ''
  );
  const [feedbackNote, setFeedbackNote] = useState<string>('');

  // New Proposal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newMarkdown, setNewMarkdown] = useState('');
  const [newBacklogId, setNewBacklogId] = useState('BL-220');
  const [newBacklogTitle, setNewBacklogTitle] = useState('Course Syllabus Drawer Fluid Gesture Optimization');

  // Release Gate State
  const [releaseVersion, setReleaseVersion] = useState('v4.0.0-PROD');
  const [releaseNotes, setReleaseNotes] = useState('Major release v4.0.0: Industrial Precision Workbench, zero slop, 186 unit tests PASS, WCAG 2.1 AA 17.04:1.');
  const [releaseAuthorized, setReleaseAuthorized] = useState(false);

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
      alert('Mohon cantumkan catatan arahan / revisi untuk author proposal.');
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMarkdown.trim()) return;

    if (onCreateProposal) {
      onCreateProposal({
        title: newTitle,
        summary: newSummary || newTitle,
        fullDocMarkdown: newMarkdown,
        authorId: 12,
        authorName: 'Tara Wulandari',
        authorRole: 'Documentarian & Confluence Lead',
        authorDivision: 'executive',
        targetBacklogId: newBacklogId,
        targetBacklogTitle: newBacklogTitle,
      });
    }

    setNewTitle('');
    setNewSummary('');
    setNewMarkdown('');
    setActiveTab('proposals');
  };

  const handleTriggerRelease = () => {
    if (onAuthorizeRelease) {
      onAuthorizeRelease(releaseVersion, releaseNotes);
    }
    setReleaseAuthorized(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded-xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0F766E] to-[#042F2E] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#18181B] dark:text-white tracking-tight">
                  Executive Document &amp; Release Governance Web Portal
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/40">
                  Rizco Renova Authority (#0)
                </span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-slate-400 mt-0.5">
                Protokol Agile SDLC: Pengerjaan task teknis &amp; deployment rilis dibekukan sampai proposal di-approve resmi oleh Team Lead.
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

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('proposals')}
              className={`py-2.5 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'proposals'
                  ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Daftar Proposal Dokumen ({proposals.length})</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new_proposal')}
              className={`py-2.5 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'new_proposal'
                  ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Proposal Dokumen Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('release_gate')}
              className={`py-2.5 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'release_gate'
                  ? 'border-amber-500 text-amber-700 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Release Deployment Arbiter Gate</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Proposals Approval & Gatekeeper */}
        {activeTab === 'proposals' && (
          <div className="flex-1 flex flex-col overflow-hidden">
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
                  Daftar Dokumen Proposal ({proposals.length})
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
                          className="px-4 py-1.5 text-xs font-bold rounded bg-[#0F766E] text-white hover:bg-[#0D655E] border border-teal-600 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-200" />
                          <span>Setujui &amp; Otorisasi Task ({currentProposal.targetBacklogId})</span>
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
        )}

        {/* Tab 2: New Proposal Authoring Studio */}
        {activeTab === 'new_proposal' && (
          <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-[#161B22]">
            <div className="p-4 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-[#0F766E]/30 space-y-1">
              <h3 className="text-sm font-bold text-[#0F766E] dark:text-teal-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Authoring Studio: Pengajuan Proposal Dokumen SDLC
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Setiap perubahan teknis, arsitektur, dan token desain wajib memiliki dokumen proposal yang ditinjau dan disetujui langsung oleh Team Lead (Rizco Renova).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judul Proposal Dokumen
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Course Syllabus Drawer Fluid Gesture RFC"
                  className="w-full px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Backlog ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newBacklogId}
                    onChange={(e) => setNewBacklogId(e.target.value)}
                    placeholder="BL-220"
                    className="w-28 px-3 py-2 font-mono font-bold bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-teal-600 dark:text-teal-400"
                  />
                  <input
                    type="text"
                    required
                    value={newBacklogTitle}
                    onChange={(e) => setNewBacklogTitle(e.target.value)}
                    placeholder="Judul item backlog"
                    className="flex-1 px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ringkasan Eksekutif (Summary)
              </label>
              <input
                type="text"
                required
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Deskripsi singkat urgensi dan dampak terhadap arsitektur LMS..."
                className="w-full px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dokumen Spesifikasi Lengkap (Markdown RFC)
              </label>
              <textarea
                rows={10}
                required
                value={newMarkdown}
                onChange={(e) => setNewMarkdown(e.target.value)}
                placeholder="# Judul RFC&#10;&#10;## 1. Latar Belakang&#10;...&#10;&#10;## 2. Spesifikasi Teknis&#10;..."
                className="w-full font-mono text-xs px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4D4CE] dark:border-[#282E3D]">
              <button
                type="button"
                onClick={() => setActiveTab('proposals')}
                className="px-4 py-2 text-xs font-semibold rounded border border-[#D4D4CE] text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded bg-[#0F766E] text-white hover:bg-[#0D655E] flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Kirim Proposal ke Otorisasi Lead</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Release Deployment Arbiter Gate */}
        {activeTab === 'release_gate' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white dark:bg-[#161B22]">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Strict Deployment Blocker: Otoritas Mutlak Team Lead Rizco Renova (#0)
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Setiap deployment rilis produksi (Vercel Production &amp; Git Release Tag) <strong>SECARA KETAT DIBEKUKAN</strong> sampai seluruh dokumen proposal di-approve dan tanda tangan otorisasi rilis diberikan langsung oleh Mas Rizco.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] space-y-3 bg-[#F4F4F1]/60 dark:bg-[#11141B]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Pemeriksaan Kesiapan Rilis (Pre-Flight Checklist)
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Proposal Dokumen Pending:</span>
                    <span className="font-mono font-bold text-amber-600">{pendingCount} dokumen</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LMS Automated Tests:</span>
                    <span className="font-mono font-bold text-emerald-600">186/186 PASS (100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Chat Hub Tests:</span>
                    <span className="font-mono font-bold text-emerald-600">15/15 PASS (100%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visual QA &amp; WCAG Contrast:</span>
                    <span className="font-mono font-bold text-emerald-600">17.04:1 (AAA) 0 DEFECT</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] space-y-3 bg-[#F4F4F1]/60 dark:bg-[#11141B]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Informasi Versi &amp; Target Deployment
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] font-mono text-slate-500 block">Target Versi</label>
                    <input
                      type="text"
                      value={releaseVersion}
                      onChange={(e) => setReleaseVersion(e.target.value)}
                      className="w-full px-2 py-1 font-mono font-bold text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-500 block">Release Notes Ringkas</label>
                    <input
                      type="text"
                      value={releaseNotes}
                      onChange={(e) => setReleaseNotes(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Release Action Card */}
            <div className="p-5 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#0F766E]" />
                    Otorisasi &amp; Eksekusi Rilis Produksi
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mengeklik tombol ini akan membubuhkan digital signature Team Lead dan menyiarkan perintah rilis ke DevOps.
                  </p>
                </div>

                {releaseAuthorized ? (
                  <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    ✅ RILIS RESMI DIIZINKAN OLEH RIZCO
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                    ⚠️ MENUNGGU DIGITAL SIGNATURE LEAD
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5E0] dark:border-[#282E3D]">
                <button
                  type="button"
                  onClick={handleTriggerRelease}
                  disabled={releaseAuthorized}
                  className="px-6 py-2.5 rounded bg-linear-to-r from-[#0F766E] to-[#042F2E] text-white hover:from-[#0D655E] hover:to-[#022120] font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Rocket className="w-4 h-4 text-amber-300" />
                  <span>{releaseAuthorized ? 'Otorisasi Rilis Aktif' : `Beri Otorisasi & Buka Kunci Deployment (${releaseVersion})`}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
