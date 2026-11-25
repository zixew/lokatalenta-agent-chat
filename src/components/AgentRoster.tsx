import { MessageSquare, X } from 'lucide-react';
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
        return <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300">ONLINE</span>;
      case 'coding':
        return <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300">CODING</span>;
      case 'testing':
        return <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300">TESTING</span>;
      case 'reviewing':
        return <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300">REVIEW</span>;
      default:
        return <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">IDLE</span>;
    }
  };

  return (
    <aside className="w-80 border-l border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-4 border-b border-[#D4D4CE] dark:border-[#282E3D] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white">
            13 Karyawan AI LokaTalenta
          </h2>
          <p className="text-[11px] text-[#71717A] dark:text-slate-400">
            {filtered.length} agen aktif
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar agen"
          className="p-1 rounded text-[#71717A] hover:bg-[#F4F4F1] dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] flex flex-wrap gap-1">
        {['all', 'executive', 'architecture', 'engineering', 'qa', 'devops'].map((div) => (
          <button
            key={div}
            type="button"
            onClick={() => setSelectedDivision(div)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer border ${
              selectedDivision === div
                ? 'bg-[#0F766E] border-[#0F766E] text-white font-bold'
                : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1]'
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-2.5 flex-1">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className="p-3 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1]/60 dark:bg-[#11141B] space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded bg-[#0F766E]/15 text-[#0F766E] dark:text-teal-300 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-[#0F766E]/30">
                  {agent.avatar}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#18181B] dark:text-white truncate">
                    #{agent.id} {agent.name}
                  </p>
                  <p className="text-[10px] text-[#71717A] dark:text-slate-400 truncate">
                    {agent.role}
                  </p>
                </div>
              </div>
              {getStatusBadge(agent.status)}
            </div>

            <p className="text-[11px] text-[#52525B] dark:text-slate-300 leading-snug">
              {agent.bio}
            </p>

            <div className="pt-2 border-t border-[#D4D4CE] dark:border-[#282E3D] flex items-center justify-between text-[10px]">
              <button
                type="button"
                onClick={() => onOpenFloor?.(agent.floor)}
                title={`Kunjungi ${agent.name} di Lantai ${agent.floor} Kantor 3D`}
                className="font-mono text-[#0F766E] dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>📍 Lantai {agent.floor}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectDm(agent.id)}
                className="inline-flex items-center gap-1 font-semibold text-[#0F766E] dark:text-teal-400 hover:underline cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                Kirim DM
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
