import { ChevronDown, Moon, Search, Sun, Users, Zap } from 'lucide-react';
import type { Agent } from '../types/chat';
import { HUMAN_LEAD, LOKATALENTA_AGENTS } from '../data/agents';

interface HeaderProps {
  currentUser: Agent;
  onSelectUser: (agent: Agent) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleRoster: () => void;
  rosterOpen: boolean;
  onOpenAutoDiscussion: () => void;
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
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const allUsers = [HUMAN_LEAD, ...LOKATALENTA_AGENTS];

  return (
    <header className="h-14 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] px-4 flex items-center justify-between gap-3 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            LT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#18181B] dark:text-white tracking-tight">
                LokaTalenta Hub
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30">
                v4.0.0
              </span>
              <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[#52525B] dark:text-slate-300 border border-[#D4D4CE] dark:border-[#282E3D]">
                SPR-21 LIVE
              </span>
            </div>
            <p className="text-[10px] text-[#71717A] dark:text-slate-400 leading-none mt-0.5">
              13 Autonomous AI Employees • Industrial Precision
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#71717A] dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pesan / file..."
            className="w-full pl-8 pr-3 py-1 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <button
          type="button"
          onClick={onOpenAutoDiscussion}
          title="Mulai simulasi diskusi otomatis antar agen"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#0F766E] bg-teal-50 dark:bg-teal-950/60 text-xs font-semibold text-[#0F766E] dark:text-teal-300 hover:bg-[#0F766E] hover:text-white transition-colors cursor-pointer active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="hidden sm:inline">Simulasi Diskusi</span>
        </button>

        <div className="relative">
          <select
            aria-label="Pilih Persona Akun"
            value={currentUser.id}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              const found = allUsers.find((u) => u.id === id);
              if (found) onSelectUser(found);
            }}
            className="appearance-none pl-2.5 pr-7 py-1 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs font-semibold text-[#18181B] dark:text-white cursor-pointer focus:outline-none focus:border-[#0F766E]"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id === -1 ? '👤' : '🤖'} {u.name} ({u.role})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A] dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Ganti mode gelap atau terang"
          className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800 cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onToggleRoster}
          title="Tampilkan daftar karyawan agent"
          className={`p-1.5 rounded border cursor-pointer ${
            rosterOpen
              ? 'bg-[#0F766E] border-[#0F766E] text-white'
              : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
