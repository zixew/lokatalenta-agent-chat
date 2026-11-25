import type { Agent, Message } from '../types/chat';
import { LOKATALENTA_AGENTS } from '../data/agents';

interface PersonaReplyContext {
  sender: Agent;
  targetAgent: Agent;
  userMessage: string;
  channelId: string;
}

export function generatePersonaReply({
  sender,
  targetAgent,
  userMessage,
  channelId,
}: PersonaReplyContext): Omit<Message, 'id' | 'timestamp'> {
  const query = userMessage.toLowerCase();

  let content = '';
  let codeSnippet: { language: string; code: string } | undefined;
  let taskRef: { id: string; title: string; status: string } | undefined;

  switch (targetAgent.id) {
    case 0: // Rizco Renova
      if (query.includes('status') || query.includes('sprint') || query.includes('rilis') || query.includes('release')) {
        content = `Halo @${sender.name}, status Sprint 21 saat ini sangat solid. Dari total kapasitas 145 SP, kita sudah commit 136 SP (93.8% kapasitas). LMS resmi kita kawal ke Major v4.0.0 dengan standar anti-slop penuh. Ada blocking di tim kamu?`;
        taskRef = { id: 'SPR-21', title: 'Sprint 21 Capacity & Major Release', status: 'ACTIVE' };
      } else {
        content = `Terima kasih update-nya @${sender.name}. Sebagai Sprint Lead, saya pastikan koordinasi antar divisi tetap sinkron. Silakan lanjutkan pass pekerjaanmu, dan kabari jika butuh eskalasi prioritas.`;
      }
      break;

    case 1: // Raka Mahendra
      if (query.includes('3d') || query.includes('kantor') || query.includes('audio') || query.includes('elevator') || query.includes('lag')) {
        content = `Halo @${sender.name}! Kantor 3D di Lantai 3 dan Boardroom Lantai 2 sudah tersinkronisasi live. Kemarin kita sudah bereskan Z-fighting di pintu masuk lantai 0 dan optimasi draw calls. Sekarang stabil di 60 FPS pada semua browser.`;
      } else {
        content = `Siap @${sender.name}! Di Lantai 3 studio 3D semuanya berjalan lancar. Ada aset Three.js atau shader baru yang perlu di-sync ke display kantor?`;
      }
      break;

    case 2: // Pranadipa Wicaksana
      if (query.includes('backlog') || query.includes('moscow') || query.includes('prioritas') || query.includes('sp')) {
        content = `Catatan diterima @${sender.name}. Di backlog database (lokatalenta-backlog), kita baru saja memasukkan EPIC-LMS-UI (55 SP) dan EPIC-AGENT-CHAT (34 SP). Semuanya sudah digrooming dengan kriteria MoSCoW: Must-Have untuk anti-slop surfaces utama.`;
        taskRef = { id: 'BL-211', title: 'LMS UI Anti-Slop Overhaul', status: 'IN_SPRINT' };
      } else {
        content = `Sebagai Product Owner, fokus utama kita adalah zero-paywall dan pengalaman belajar yang transparan tanpa dark patterns. Saya catat poinmu untuk grooming berikutnya!`;
      }
      break;

    case 7: // Bayu Pratama
      if (query.includes('desain') || query.includes('token') || query.includes('border') || query.includes('warna') || query.includes('font')) {
        content = `Tepat sekali @${sender.name}! Berdasarkan DESIGN.md v4.0.0, kita wajib pakai token \`--border-industrial\` (#D4D4CE di light, #282E3D di dark) dan font JetBrains Mono untuk semua angka tabular. Dilarang keras pakai border warm-cream #E5E3DC atau drop shadow melayang.`;
        codeSnippet = {
          language: 'css',
          code: `/* DESIGN.md Industrial Token Reference */
--border-industrial: #D4D4CE;
--bg-canvas: #F4F4F1;
--status-teal: #0F766E;
font-family: 'Plus Jakarta Sans', sans-serif;`,
        };
      } else {
        content = `Halo @${sender.name}, komponen design system sedang terus distandarisasi. Pastikan semua elemen UI punya garis 1px solid yang tegas dan zero hover-bounce ya!`;
      }
      break;

    case 9: // Maya Putri
      if (query.includes('mobile') || query.includes('touch') || query.includes('sheet') || query.includes('gesture')) {
        content = `Halo @${sender.name}! Untuk mobile viewport, saya pastikan CourseSyllabusDrawer sudah pakai Apple fluid physics: drag 1:1, upward resistance 0.2, dan velocity-aware dismissal (>0.6px/ms). Tap target selalu di atas 44px.`;
      } else {
        content = `Siap @${sender.name}! Saya pantau performa UX di mobile Safari dan Android Chrome agar bebas jank dan responsif di layar 375px.`;
      }
      break;

    case 10: // Qonita Anindya
      if (query.includes('qa') || query.includes('test') || query.includes('audit') || query.includes('wcag') || query.includes('kontras')) {
        content = `Laporan QA: Seluruh 168 unit tests di LMS client lulus 100%! Kontras teks terhadap panel mencapai 16.1:1 (lolos WCAG AAA). Keyboard focus-visible ring juga sudah aktif. Saya akan terus kawal visual regression test di multi-viewport!`;
        taskRef = { id: 'QAE-211', title: 'Multi-Viewport Visual Audit', status: 'VERIFIED' };
      } else {
        content = `Halo @${sender.name}. Sebagai QA Lead, saya pastikan tidak ada bug visual atau fungsional yang lolos ke produksi. Kabari jika ada PR baru yang siap di-audit!`;
      }
      break;

    case 6: // Dimas Saputra
      if (query.includes('bl-217') || query.includes('player') || query.includes('theatre') || query.includes('video')) {
        content = `Halo @${sender.name}, CoursePlayerPage Lesson Theatre (BL-217) sedang saya matangkan. Sidebar materi siap dibuat collapsible 150ms agar kanvas video mendapat 100% viewport.`;
        taskRef = { id: 'BL-217', title: 'CoursePlayerPage Lesson Theatre Revamp', status: 'IN_SPRINT' };
      } else {
        content = `Halo @${sender.name}, QuizRunnerPage dan tes Kraepelin sudah dimigrasikan ke industrial workbench. Fitur cek pembahasan langsung di Mode Latihan berjalan mulus tanpa reload halaman. Ada feedback modul soal?`;
      }
      break;

    case 8: // Hendra Gunawan
      content = `Dari segi keamanan dan backend: CSP headers, rate-limiting, dan token integritas tab-switch monitor berjalan aman. Zero vulnerabilities pada build v4.0.0.`;
      break;

    case 11: // Aris Munandar
      content = `Monitoring DevOps: Edge caching Vercel aktif, FCP rata-rata 64ms, dan Brotli compression memangkas ukuran aset GLTF 3D hingga 68%. Server stabil 100% uptime.`;
      break;

    case 12: // Tara Wulandari
      content = `Halo @${sender.name}! Semua dokumentasi retrospektif Sprint 20, planning Sprint 21, dan protokol anti-slop sudah terarsip rapi di Confluence lokatalenta-docs.`;
      break;

    default:
      content = `Halo @${sender.name}! Pesanmu sudah saya terima di ${targetAgent.role} (Lantai ${targetAgent.floor}). Tugas aktif saya saat ini: "${targetAgent.currentTask}". Siap membantu kolaborasi!`;
      break;
  }

  return {
    channelId,
    senderId: targetAgent.id,
    senderName: targetAgent.name,
    senderRole: targetAgent.role,
    senderDivision: targetAgent.division,
    content,
    codeSnippet,
    taskRef,
    reactions: [{ emoji: '👍', count: 1, agentIds: [sender.id] }],
  };
}

export function detectMentionedAgent(text: string): Agent | null {
  const lower = text.toLowerCase();
  for (const agent of LOKATALENTA_AGENTS) {
    const firstName = agent.name.split(' ')[0].toLowerCase();
    const fullName = agent.name.toLowerCase();
    if (lower.includes(`@${firstName}`) || lower.includes(`@${fullName}`) || lower.includes(firstName)) {
      return agent;
    }
  }
  return null;
}
