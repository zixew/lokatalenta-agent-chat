import { MessageSquare, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { Agent } from '../types/chat';

interface AgentRosterProps {
  agents: Agent[];
  isOpen: boolean;
  onClose: () => void;
  onSelectDm: (agentId: number) => void;
  onOpenFloor?: (floor: number) => void;
}

export function AgentRoster({ agents, isOpen, onClose, onSelectDm, onOpenFloor }: AgentRosterProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  if (!isOpen) return null;

  const filtered =
    selectedDivision === 'all' ? agents : agents.filter((a) => a.division === selectedDivision);

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">ONLINE</span>;
      case 'coding':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">CODING</span>;
      case 'testing':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">TESTING</span>;
      case 'reviewing':
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">REVIEW</span>;
      default:
        return <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">IDLE</span>;
    }
  };

  return (
    <aside className="w-72 lg:w-80 border-l border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white">
            13 Karyawan AI LokaTalenta
          </h2>
          <p className="text-[10px] text-[#71717A] dark:text-slate-400">
            {filtered.length} agen aktif • Floor 0–4
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar agen"
          className="p-1 rounded text-[#71717A] hover:bg-[#F4F4F1] dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-2 border-b border-[#D4D4CE] dark:border-[#282E3D] flex flex-wrap gap-1 bg-slate-50/60 dark:bg-[#11141B]/40">
        {['all', 'executive', 'architecture', 'engineering', 'qa', 'devops'].map((div) => (
          <button
            key={div}
            type="button"
            onClick={() => setSelectedDivision(div)}
            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase cursor-pointer border transition-colors ${
              selectedDivision === div
                ? 'bg-[#0F766E] border-[#0F766E] text-white font-bold'
                : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      <div className="p-2.5 space-y-2 flex-1">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className={`p-2.5 rounded-lg border transition-all ${
              agent.id === 0
                ? 'border-amber-400/80 bg-amber-50/40 dark:bg-amber-950/20'
                : 'border-[#D4D4CE] dark:border-[#282E3D] bg-slate-50/50 dark:bg-[#11141B]/60 hover:border-[#0F766E]/50'
            }`}
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded bg-[#0F766E]/15 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30 text-[10px] font-bold flex items-center justify-center font-mono shrink-0">
                  {agent.avatar}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-white truncate">
                    {agent.id === 0 ? '👑 ' : ''}#{agent.id} {agent.name}
                  </h4>
                  <p className="text-[10px] text-[#71717A] dark:text-slate-400 truncate">
                    {agent.role}
                  </p>
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(agent.status)}</div>
            </div>

            <p className="text-[11px] text-[#52525B] dark:text-slate-300 line-clamp-2 mt-1 leading-snug">
              {agent.currentTask}
            </p>

            <div className="flex items-center justify-between pt-1.5 border-t border-[#E5E5E0] dark:border-[#282E3D]/60 mt-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => onOpenFloor?.(agent.floor)}
                className="inline-flex items-center gap-1 text-[#0F766E] dark:text-teal-400 hover:underline cursor-pointer"
              >
                <MapPin className="w-2.5 h-2.5" />
                <span>Lantai {agent.floor}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectDm(agent.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] text-[#18181B] dark:text-slate-200 hover:border-[#0F766E] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-2.5 h-2.5 text-[#0F766E]" />
                <span>Kirim DM</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
