import { Play, X, Zap } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '../types/chat';

interface AutonomousDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChannelName: string;
  onInjectMessages: (newMessages: Omit<Message, 'id' | 'timestamp'>[]) => void;
}

interface Scenario {
  id: string;
  title: string;
  desc: string;
  steps: {
    senderId: number;
    senderName: string;
    senderRole: string;
    senderDivision: 'executive' | 'architecture' | 'engineering' | 'qa' | 'devops';
    content: string;
    codeSnippet?: { language: string; code: string };
    taskRef?: { id: string; title: string; status: string };
  }[];
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'course-player-unslop',
    title: 'Audit & Purge Slop pada CoursePlayerPage (BL-217)',
    desc: 'Diskusi teknis antara Bayu, Dimas, Qonita, dan Fajar untuk membersihkan video lesson theater dan layout.',
    steps: [
      {
        senderId: 7,
        senderName: 'Bayu Pratama',
        senderRole: 'Frontend & Design Systems Engineer',
        senderDivision: 'engineering',
        content: 'Hasil audit pada `CoursePlayerPage.tsx`: masih ditemukan border `#E5E3DC` pada panel notes dan video controls. Kita perlu migrasikan ke `--border-industrial` (#D4D4CE) sesuai DESIGN.md v4.0.0.',
        taskRef: { id: 'BL-217', title: 'CoursePlayerPage Lesson Theatre Revamp', status: 'IN_SPRINT' },
      },
      {
        senderId: 6,
        senderName: 'Dimas Saputra',
        senderRole: 'LMS Core & Assessment Engineer',
        senderDivision: 'engineering',
        content: 'Sepakat @Bayu. Saya juga akan membuat sidebar silabus materi dapat di-collapse dengan transisi 150ms agar kanvas video mendapatkan 100% viewport saat diputar di layar laptop 13 inch.',
      },
      {
        senderId: 10,
        senderName: 'Qonita Anindya',
        senderRole: 'QA Lead & Visual Testing Arbiter',
        senderDivision: 'qa',
        content: 'Tolong pastikan kontrol fullscreen dan tombol pause/play memiliki `focus-visible:ring-2` yang jelas untuk aksesibilitas keyboard (WCAG 2.1 AA). Saya akan siapkan test case multi-viewportnya.',
      },
      {
        senderId: 5,
        senderName: 'Fajar Nugraha',
        senderRole: 'Fullstack Web Lead',
        senderDivision: 'engineering',
        content: 'Rencana mantap. Dimas pimpin implementasi BL-217, Bayu review tokennya, dan Qonita verifikasi di QA suite. Commit langsung ke branch dev!',
      },
    ],
  },
  {
    id: 'sprint-capacity',
    title: 'Review MoSCoW Prioritas Sprint 21 & Capacity Allocation',
    desc: 'Diskusi evaluasi komitmen sprint 21 (136 SP) antara Pranadipa, Rizco, dan Tara.',
    steps: [
      {
        senderId: 2,
        senderName: 'Pranadipa Wicaksana',
        senderRole: 'Product Owner & Backlog Arbiter',
        senderDivision: 'executive',
        content: 'Kita telah memasukkan 20 work items di Sprint 21 dengan 136 SP committed. Buffer kita sisa 9 SP. Apakah ada dependensi kritis yang blocking antar divisi?',
        taskRef: { id: 'SPR-21', title: 'Sprint 21 Execution & Capacity Matrix', status: 'ACTIVE' },
      },
      {
        senderId: 0,
        senderName: 'Rizco Renova',
        senderRole: 'Sprint Lead & Release Arbiter',
        senderDivision: 'executive',
        content: 'Dependensi utama ada pada token `DESIGN.md` (BL-211) yang sudah mendarat. Seluruh divisi engineering sekarang unblocked untuk melanjutkan unslop pada halaman masing-masing.',
      },
      {
        senderId: 12,
        senderName: 'Tara Wulandari',
        senderRole: 'Documentarian & Confluence Lead',
        senderDivision: 'executive',
        content: 'Semua dokumentasi sprint planning, anti-slop guidelines, dan versioning v4.0.0 sudah terpublikasi di portal Confluence lokatalenta-docs.',
      },
    ],
  },
  {
    id: '3d-office-sync',
    title: 'Sinkronisasi Telemetri 3D Office Boardroom Display',
    desc: 'Koordinasi teknis antara Raka, Bagas, dan Aris mengenai sinkronisasi live display dan ambient audio.',
    steps: [
      {
        senderId: 1,
        senderName: 'Raka Mahendra',
        senderRole: 'Principal 3D & Graphics Engineer',
        senderDivision: 'architecture',
        content: 'Boardroom Floor 2 screen sekarang sudah menampilkan target Sprint 21 (136 SP Committed). Shaders dan ambient audio kantor 3D berjalan stabil 60 FPS tanpa lag.',
      },
      {
        senderId: 3,
        senderName: 'Bagas Prakoso',
        senderRole: 'Platform & Infrastructure Architect',
        senderDivision: 'architecture',
        content: 'SSE Gateway siap mengirimkan heartbeat setiap 3 detik agar posisi avatar karyawan di kantor 3D tersinkronisasi dengan status aktif di aplikasi chat ini.',
      },
      {
        senderId: 11,
        senderName: 'Aris Munandar',
        senderRole: 'DevOps & Site Reliability Engineer',
        senderDivision: 'devops',
        content: 'Edge latency Vercel terpantau di 24ms. Brotli compression aktif pada GLTF asset chunks, FCP konsisten di bawah 80ms.',
      },
    ],
  },
];

export function AutonomousDiscussionModal({
  isOpen,
  onClose,
  activeChannelName,
  onInjectMessages,
}: AutonomousDiscussionModalProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState('course-player-unslop');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const currentScenario = PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId);

  const handleStartDiscussion = () => {
    if (!currentScenario) return;
    setIsSimulating(true);

    const formatted = currentScenario.steps.map((step) => ({
      channelId: activeChannelName,
      senderId: step.senderId,
      senderName: step.senderName,
      senderRole: step.senderRole,
      senderDivision: step.senderDivision,
      content: step.content,
      codeSnippet: step.codeSnippet,
      taskRef: step.taskRef,
      reactions: [{ emoji: '👍', count: 2, agentIds: [0, 2] }],
    }));

    setTimeout(() => {
      onInjectMessages(formatted);
      setIsSimulating(false);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] shadow-2xl p-6 space-y-5 select-none"
      >
        <div className="flex items-center justify-between border-b border-[#D4D4CE] dark:border-[#282E3D] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-bold text-[#18181B] dark:text-white">
              Simulasi Diskusi Otonom Antar Agen
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#71717A] hover:bg-[#F4F4F1] dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#52525B] dark:text-slate-300 leading-relaxed">
          Pilih topik diskusi. Para agen akan melakukan percakapan kolaboratif secara mandiri dan hasilnya akan langsung diposting ke kanal <strong>#{activeChannelName}</strong>.
        </p>

        <div className="space-y-2">
          {PRESET_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                selectedScenarioId === sc.id
                  ? 'border-[#0F766E] bg-teal-50/50 dark:bg-teal-950/40 ring-1 ring-[#0F766E]'
                  : 'border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1]/50 dark:bg-[#11141B] hover:border-slate-400'
              }`}
            >
              <p className="text-xs font-bold text-[#18181B] dark:text-white">{sc.title}</p>
              <p className="text-[11px] text-[#71717A] dark:text-slate-400 mt-1">{sc.desc}</p>
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-[#D4D4CE] dark:border-[#282E3D] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-xs font-medium hover:bg-[#F4F4F1] cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleStartDiscussion}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isSimulating ? 'Menjalankan Diskusi...' : 'Jalankan Diskusi Agen'}
          </button>
        </div>
      </div>
    </div>
  );
}
