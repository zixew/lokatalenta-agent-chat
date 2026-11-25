import { Activity, Cpu, Radio, Send, Users } from 'lucide-react';
import { useState } from 'react';
import type { Agent } from '../types/chat';

interface SwarmMissionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onBroadcastToSwarm: (message: string) => void;
  onOpenOffice3D: (floor: number) => void;
}

interface SwarmActivity {
  id: string;
  agentName: string;
  role: string;
  division: string;
  message: string;
  time: string;
  status: 'done' | 'working' | 'blocked';
  taskRef: string;
}

export function SwarmMissionControlModal({
  isOpen,
  onClose,
  agents,
  onBroadcastToSwarm,
  onOpenOffice3D,
}: SwarmMissionControlModalProps) {
  const [broadcastInput, setBroadcastInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'engineering' | 'architecture' | 'qa' | 'executive'>('all');

  const [activities] = useState<SwarmActivity[]>([
    {
      id: 'act-1',
      agentName: 'Qonita Anindya',
      role: 'QA Lead',
      division: 'qa',
      message: 'Audit Multi-Viewport & WCAG 2.1 AA Sign-off selesai 100% PASS. 176 LMS tests & 13 Chat tests valid.',
      time: '18:26',
      status: 'done',
      taskRef: 'QAE-211',
    },
    {
      id: 'act-2',
      agentName: 'Dimas Saputra',
      role: 'LMS Core Engineer',
      division: 'engineering',
      message: 'LessonTheatrePlayer.tsx & CourseCurriculumRail.tsx siap di-wire ke CoursePlayerPage.tsx (BL-217).',
      time: '18:30',
      status: 'done',
      taskRef: 'BL-217',
    },
    {
      id: 'act-3',
      agentName: 'Bayu Pratama',
      role: 'Design Systems Lead',
      division: 'engineering',
      message: 'Anti-Slop Visual Precision terkunci: zero bouncy hover, industrial border #D4D4CE, canvas min-w-360px.',
      time: '18:25',
      status: 'done',
      taskRef: 'AGT-104',
    },
    {
      id: 'act-4',
      agentName: 'Fajar Nugraha',
      role: 'Fullstack Lead',
      division: 'engineering',
      message: 'Direct messaging engine dua arah aktif dengan routing real-time dan context-aware auto response.',
      time: '18:26',
      status: 'done',
      taskRef: 'AGT-101',
    },
    {
      id: 'act-5',
      agentName: 'Bagas Prakoso',
      role: 'Platform Architect',
      division: 'architecture',
      message: 'Event Gateway SSE streaming telemetri live antara Chat, Backlog DB, dan Kantor 3D latensi <15ms.',
      time: '18:18',
      status: 'working',
      taskRef: 'ARC-212',
    },
    {
      id: 'act-6',
      agentName: 'Raka Mahendra',
      role: 'Principal 3D Engineer',
      division: 'architecture',
      message: 'Optimasi draw calls dan spatial audio kantor 3D Three.js stabil 60 FPS pada semua lantai 0–4.',
      time: '18:12',
      status: 'working',
      taskRef: 'ARC-211',
    },
  ]);

  if (!isOpen) return null;

  const filteredAgents =
    activeFilter === 'all'
      ? agents
      : agents.filter((a) => a.division === activeFilter);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    onBroadcastToSwarm(broadcastInput.trim());
    setBroadcastInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#18181B] dark:text-white tracking-tight">
                  Swarm Mission Control — Embedded UI
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                  LIVE SWARM ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#71717A] dark:text-slate-400 mt-0.5">
                Pusat Kendali Kolaborasi 13 Agen Otonom LokaTalenta terintegrasi langsung dalam aplikasi web tanpa IDE eksternal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] text-[#18181B] dark:text-slate-200 hover:bg-[#E5E5E0] dark:hover:bg-[#21262D] transition-colors cursor-pointer"
          >
            Tutup [Esc]
          </button>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-slate-50 dark:bg-[#141820] text-xs">
          <div className="p-3 border-r border-[#D4D4CE] dark:border-[#282E3D]">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Karyawan AI Aktif</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">13 Anggota</span>
          </div>
          <div className="p-3 border-r border-[#D4D4CE] dark:border-[#282E3D]">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Status Sprint 21</span>
            <span className="text-base font-bold font-mono text-[#0F766E] dark:text-teal-400">149 SP Committed</span>
          </div>
          <div className="p-3 border-r border-[#D4D4CE] dark:border-[#282E3D]">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Quality Gate Tests</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">189 / 189 PASS</span>
          </div>
          <div className="p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Visual Defect</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">0 DEFECT (CLEAN)</span>
          </div>
        </div>

        {/* 2-Column: Live Swarm Activity Feed & Agent Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Live Swarm Stream */}
          <div className="flex-1 flex flex-col border-r border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] overflow-hidden">
            <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#FAFAF8] dark:bg-[#11141B] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0F766E]" />
                Live Multi-Agent Activity & Task Handoff Stream
              </span>
              <span className="text-[10px] font-mono text-slate-500">Real-time Event Gateway</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1]/50 dark:bg-[#11141B]/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.agentName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {act.role}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-teal-700 dark:text-teal-400">
                        [{act.division}]
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{act.time}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30">
                        {act.taskRef}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {act.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Broadcast Input */}
            <form onSubmit={handleSendBroadcast} className="p-3 border-t border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex items-center gap-2">
              <input
                type="text"
                value={broadcastInput}
                onChange={(e) => setBroadcastInput(e.target.value)}
                placeholder="Broadcast instruksi Team Lead ke seluruh anggota Swarm..."
                className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
              />
              <button
                type="submit"
                disabled={!broadcastInput.trim()}
                className="px-3.5 py-1.5 rounded bg-[#0F766E] text-white hover:bg-[#115E59] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3 h-3" />
                <span>Broadcast</span>
              </button>
            </form>
          </div>

          {/* Right Column: Roster of 13 Agents with Floor Telemetry */}
          <div className="w-80 sm:w-96 flex flex-col bg-slate-50/50 dark:bg-[#11141B]/40 overflow-hidden">
            <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#FAFAF8] dark:bg-[#11141B] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                Roster Divisi & Lokasi 3D ({filteredAgents.length})
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="p-2 border-b border-[#D4D4CE] dark:border-[#282E3D] flex flex-wrap gap-1 bg-white dark:bg-[#161B22]">
              {(['all', 'engineering', 'architecture', 'qa', 'executive'] as const).map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setActiveFilter(div)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer border ${
                    activeFilter === div
                      ? 'bg-[#0F766E] border-[#0F766E] text-white font-bold'
                      : 'border-[#D4D4CE] dark:border-[#282E3D] text-slate-600 dark:text-slate-400 hover:bg-[#F4F4F1]'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-2.5 rounded-lg border bg-white dark:bg-[#161B22] space-y-1.5 ${
                    agent.id === 0
                      ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-[#D4D4CE] dark:border-[#282E3D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded bg-[#0F766E]/15 text-[#0F766E] dark:text-teal-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 border border-[#0F766E]/30">
                        {agent.avatar}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {agent.id === 0 ? '👑 ' : ''}#{agent.id} {agent.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {agent.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                      {agent.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    {agent.currentTask}
                  </p>

                  <div className="pt-1.5 border-t border-[#E5E5E0] dark:border-[#282E3D]/60 flex items-center justify-between text-[10px]">
                    <button
                      type="button"
                      onClick={() => onOpenOffice3D(agent.floor)}
                      className="text-[#0F766E] dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1 font-mono"
                    >
                      <span>📍 Lantai {agent.floor}</span>
                    </button>
                    <span className="text-[9px] font-mono uppercase text-slate-400">
                      {agent.division}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
