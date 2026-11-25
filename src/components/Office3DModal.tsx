import { Building2, ExternalLink, RefreshCw, Volume2, VolumeX, X } from 'lucide-react';
import { useState } from 'react';

interface Office3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFloor?: number;
}

const FLOORS = [
  { id: 0, label: 'Lantai 0: Lobby & Resepsionis', division: 'Public / Welcome' },
  { id: 1, label: 'Lantai 1: Engineering & QA Hub', division: 'Tech Core (#5, #6, #7, #8, #9, #10)' },
  { id: 2, label: 'Lantai 2: Executive Boardroom', division: 'Leadership (#0 Rizco, #2 Pranadipa, #12)' },
  { id: 3, label: 'Lantai 3: Architecture & Lab', division: 'Graphics & Infra (#1 Raka, #3, #4)' },
  { id: 4, label: 'Lantai 4: Rooftop Garden Lounge', division: 'DevOps & Breakout (#11 Aris Munandar)' },
];

function playElevatorChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // AudioContext blocked by browser policy
  }
}

export function Office3DModal({ isOpen, onClose, initialFloor = 2 }: Office3DModalProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(initialFloor);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [transitNotice, setTransitNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFloorChange = (floorId: number) => {
    if (floorId === selectedFloor) return;
    setSelectedFloor(floorId);
    if (audioEnabled) {
      playElevatorChime();
    }
    const targetFloor = FLOORS.find((f) => f.id === floorId);
    setTransitNotice(`🛗 Lift Menuju ${targetFloor?.label} (${targetFloor?.division})`);
    setTimeout(() => {
      setTransitNotice(null);
    }, 2400);
  };

  const officeUrl = 'https://lokatalenta-office-3d.vercel.app';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[88vh] rounded-lg bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] shadow-2xl flex flex-col overflow-hidden select-none"
      >
        {/* Modal Header */}
        <div className="h-12 border-b border-[#D4D4CE] dark:border-[#282E3D] px-4 flex items-center justify-between shrink-0 bg-[#F4F4F1] dark:bg-[#11141B]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
            <h2 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
              Kantor Virtual 3D LokaTalenta (Live Telemetri)
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
              60 FPS SYNC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Matikan Audio Spasial Lift' : 'Nyalakan Audio Spasial Lift'}
              className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={() => setIframeKey((k) => k + 1)}
              title="Reload Kantor 3D"
              className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a
              href={officeUrl}
              target="_blank"
              rel="noreferrer"
              title="Buka di tab baru"
              className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup kantor 3D"
              className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floor Selection Strip */}
        <div className="px-4 py-2 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {FLOORS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFloorChange(f.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                  selectedFloor === f.id
                    ? 'bg-[#0F766E] border-[#0F766E] text-white font-bold shadow-xs'
                    : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#71717A] dark:text-slate-400 font-mono hidden md:block">
            Gunakan WASD / Mouse Drag untuk berjalan & rotasi kamera
          </p>
        </div>

        {/* 3D Viewport iframe */}
        <div className="flex-1 w-full bg-slate-950 relative">
          {transitNotice && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-teal-950/90 text-teal-200 border border-teal-500/80 text-xs font-mono font-bold shadow-lg animate-fade-in flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>{transitNotice}</span>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={officeUrl}
            title="LokaTalenta 3D Virtual Office"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}
