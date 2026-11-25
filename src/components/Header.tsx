import { Building2, ChevronDown, Moon, Search, Sun, Users, Zap, ShieldAlert, Cpu } from 'lucide-react';
import type { Agent } from '../types/chat';
import { LOKATALENTA_AGENTS } from '../data/agents';

interface HeaderProps {
  currentUser: Agent;
  onSelectUser: (agent: Agent) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleRoster: () => void;
  rosterOpen: boolean;
  onOpenAutoDiscussion: () => void;
  onOpenOffice3D: () => void;
  onOpenDocumentApproval: () => void;
  onOpenSwarmControl: () => void;
  pendingProposalsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  currentUser,
  onSelectUser,
  isDark,
  onToggleTheme,
  onToggleRoster,
  rosterOpen,
  onOpenAutoDiscussion,
  onOpenOffice3D,
  onOpenDocumentApproval,
  onOpenSwarmControl,
  pendingProposalsCount,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const allUsers = LOKATALENTA_AGENTS;

  return (
    <header className="h-14 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 shrink-0 select-none z-20">
      {/* Brand & Workspace title */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-md bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
          LT
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-white tracking-tight whitespace-nowrap">
              LokaTalenta Hub
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30 whitespace-nowrap">
              v4.0.0
            </span>
          </div>
          <p className="hidden md:block text-[10px] text-[#71717A] dark:text-slate-400 leading-tight">
            13 Autonomous Employees • Industrial Precision
          </p>
        </div>
      </div>

      {/* Middle: Compact Search */}
      <div className="relative flex-1 max-w-xs hidden lg:block">
        <Search className="w-3.5 h-3.5 text-[#71717A] dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari pesan, file, atau backlog..."
          className="w-full pl-8 pr-3 py-1 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Swarm Mission Control Embedded Button */}
        <button
          type="button"
          onClick={onOpenSwarmControl}
          title="Buka Swarm Mission Control (Pusat Kendali Kolaborasi 13 Agen AI)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-[#0F766E] dark:text-teal-300 hover:bg-[#0F766E] hover:text-white transition-all cursor-pointer active:scale-[0.98]"
        >
          <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="hidden sm:inline font-sans font-bold">Swarm Control</span>
        </button>

        {/* Document Approval Gatekeeper Pill */}
        <button
          type="button"
          onClick={onOpenDocumentApproval}
          title="Buka Hub Otorisasi Dokumen & Proposal Sprint (Wewenang Penuh Team Lead Rizco Renova)"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer active:scale-[0.98] ${
            pendingProposalsCount > 0
              ? 'border border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs'
              : 'border border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="hidden sm:inline font-sans">Otorisasi Dokumen</span>
          {pendingProposalsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500 text-white leading-none">
              {pendingProposalsCount}
            </span>
          )}
        </button>

        {/* 3D Virtual Office Button */}
        <button
          type="button"
          onClick={onOpenOffice3D}
          title="Buka Kantor Virtual 3D LokaTalenta (5 Lantai)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] text-xs font-semibold text-[#18181B] dark:text-white hover:border-[#0F766E] transition-colors cursor-pointer active:scale-[0.98]"
        >
          <Building2 className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400 shrink-0" />
          <span className="hidden sm:inline">Kantor 3D</span>
        </button>

        {/* Auto Discussion Simulation */}
        <button
          type="button"
          onClick={onOpenAutoDiscussion}
          title="Mulai simulasi diskusi otomatis antar agen"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#0F766E]/60 bg-teal-50/70 dark:bg-teal-950/50 text-xs font-semibold text-[#0F766E] dark:text-teal-300 hover:bg-[#0F766E] hover:text-white transition-colors cursor-pointer active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          <span className="hidden md:inline">Simulasi Diskusi</span>
        </button>

        {/* User / Persona Switcher */}
        <div className="relative max-w-[140px] sm:max-w-[200px]">
          <select
            aria-label="Pilih Persona Akun"
            value={currentUser.id}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              const found = allUsers.find((u) => u.id === id);
              if (found) onSelectUser(found);
            }}
            className="w-full appearance-none pl-2 pr-6 py-1 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs font-semibold text-[#18181B] dark:text-white cursor-pointer focus:outline-none focus:border-[#0F766E] truncate"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id === 0 ? '👑' : '🤖'} {u.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A] dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Ganti mode gelap atau terang"
          className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Toggle Roster Pane */}
        <button
          type="button"
          onClick={onToggleRoster}
          title="Tampilkan daftar karyawan agent"
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            rosterOpen
              ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xs'
              : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
