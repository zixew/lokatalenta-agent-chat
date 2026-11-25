import { Hash } from 'lucide-react';
import type { Agent, Channel } from '../types/chat';

interface SidebarProps {
  channels: Channel[];
  agents: Agent[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  activeDmAgentId: number | null;
  onSelectDm: (agentId: number) => void;
}

export function Sidebar({
  channels,
  agents,
  activeChannelId,
  onSelectChannel,
  activeDmAgentId,
  onSelectDm,
}: SidebarProps) {
  const categories = [
    { id: 'design', label: 'LMS Revamp & UI' },
    { id: 'sprint', label: 'Sprint & Backlog' },
    { id: 'engineering', label: 'Teknikal & 3D' },
    { id: 'general', label: 'Umum' },
  ] as const;

  return (
    <aside className="w-64 border-r border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400">
          <span>Kanal Diskusi</span>
        </div>

        {categories.map((cat) => {
          const groupChannels = channels.filter((c) => c.category === cat.id);
          if (groupChannels.length === 0) return null;
          return (
            <div key={cat.id} className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] dark:text-slate-500 px-2">
                {cat.label}
              </span>
              <div className="space-y-0.5">
                {groupChannels.map((c) => {
                  const isActive = activeChannelId === c.id && activeDmAgentId === null;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectChannel(c.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 font-bold border border-[#0F766E]/40'
                          : 'text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{c.name}</span>
                      </span>
                      {c.unreadCount && c.unreadCount > 0 ? (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#0F766E] text-white text-[10px] font-mono shrink-0">
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400">
          <span>Pesan Langsung (13 Agen)</span>
        </div>

        <div className="space-y-0.5">
          {agents.map((agent) => {
            const isActive = activeDmAgentId === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onSelectDm(agent.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 font-bold border border-[#0F766E]/40'
                    : 'text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center font-mono">
                      {agent.avatar}
                    </span>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-[#161B22] ${
                        agent.status === 'online'
                          ? 'bg-emerald-500'
                          : agent.status === 'coding'
                            ? 'bg-blue-500'
                            : agent.status === 'reviewing'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{agent.name}</p>
                    <p className="text-[10px] text-[#A1A1AA] dark:text-slate-500 truncate">
                      Fl.{agent.floor} • {agent.role}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
