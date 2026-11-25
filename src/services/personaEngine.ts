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
    case 0: // Rizco Renova (Team Lead)
      if (query.includes('status') || query.includes('sprint') || query.includes('rilis') || query.includes('release')) {
        content = `Halo @${sender.name}! Status Sprint 21 saat ini sangat solid. Dari total kapasitas 158 SP, kita alokasikan 149 SP across 6 divisi. Seluruh mandat kerja sudah diaktifkan di Swarm Agent dan task teknis diprioritaskan untuk mengunci Group Chat sebelum kita masuk ke LMS Major v4.0.0. Ada blocking yang butuh eskalasi?`;
        taskRef = { id: 'SPR-21', title: 'Sprint 21 Master Execution Plan', status: 'ACTIVE' };
      } else if (query.includes('dokumen') || query.includes('approve') || query.includes('proposal')) {
        content = `Semua pengajuan dokumen proposal (PRP) wajib melalui otorisasi saya di Document Approval Hub. Tidak ada task teknis yang boleh jalan sebelum saya setujui. Silakan ajukan draft RFC-nya ya @${sender.name}!`;
        taskRef = { id: 'PRP-2101', title: 'Sprint Execution Charter RFC', status: 'APPROVED' };
      } else {
        content = `Instruksi diterima, @${sender.name}. Sebagai Team Lead, saya pastikan koordinasi Agile SDLC kita berjalan disiplin. Lanjutkan pekerjaan sesuai spesifikasi DESIGN.md v4.0.0!`;
      }
      break;

    case 1: // Raka Mahendra (Principal 3D Engineer)
      if (query.includes('3d') || query.includes('kantor') || query.includes('lantai') || query.includes('fps') || query.includes('lag')) {
        content = `Halo @${sender.name}! Di Lantai 3 studio 3D semuanya optimal. Z-fighting pintu masuk Lantai 0 sudah dibereskan, draw calls dipangkas, dan elevator physics antar lantai 0–4 stabil di 60 FPS. Boardroom Lantai 2 juga sudah terhubung live!`;
      } else {
        content = `Siap @${sender.name}! Saya sedang memantau rendering Three.js dan spatial audio di kantor virtual. Ada aset atau display board yang ingin di-sync ke 3D office?`;
      }
      break;

    case 2: // Pranadipa Wicaksana (Product Owner)
      if (query.includes('backlog') || query.includes('prioritas') || query.includes('moscow') || query.includes('story') || query.includes('sp')) {
        content = `Halo @${sender.name}. Backlog database (lokatalenta-backlog) sudah diperbarui: EPIC-AGENT-CHAT (34 SP) dan EPIC-LMS-UI (55 SP) sekarang memegang prioritas P0 Must. Kita juga baru menambahkan AGT-106 (Autonomous Collaboration) dan AGT-107 (Embedded Swarm UI) agar seluruh agent terintegrasi penuh!`;
        taskRef = { id: 'AGT-106', title: 'Cross-Agent Autonomous Collaboration Bus', status: 'IN_SPRINT' };
      } else {
        content = `Sebagai Product Owner, komitmen utama kita adalah integritas Agile SDLC: zero-paywall, tidak ada dark patterns, dan scope sprint yang terukur dengan acceptance criteria yang sangat ketat. Saya catat masukanmu!`;
      }
      break;

    case 3: // Bagas Prakoso (Platform & Infrastructure Architect)
      if (query.includes('sse') || query.includes('sync') || query.includes('event') || query.includes('gateway') || query.includes('infra')) {
        content = `Halo @${sender.name}! Event Gateway SSE sedang menghubungkan telemetri live antara Chat Hub, Backlog DB, dan Kantor 3D. Latensi broadcast event dipertahankan di bawah 15ms. Kontrak data aman!`;
        taskRef = { id: 'ARC-212', title: 'Real-time Event Gateway & SSE Bridge', status: 'IN_SPRINT' };
      } else {
        content = `Halo @${sender.name}, arsitektur microservices dan distributed event bus kita berjalan stabil. Seluruh data state tersinkronisasi tanpa polling liar.`;
      }
      break;

    case 4: // Gilang Ramadhan (Data & Analytics Architect)
      content = `Halo @${sender.name}! Analisis kurva psikometrik Kraepelin dan matriks radar bakat siswa (BL-219) sedang saya persiapkan dengan normal distribution SVG tanpa kalkulasi berat di main thread.`;
      taskRef = { id: 'BL-219', title: 'Skill Radar & Talent Assessment Analytics', status: 'READY' };
      break;

    case 5: // Fajar Nugraha (Fullstack Web Lead)
      if (query.includes('bug') || query.includes('chat') || query.includes('ui') || query.includes('layout') || query.includes('cramp')) {
        content = `Halo @${sender.name}! Masalah layout chat yang sempat terjepit sudah kita bereskan tuntas: feed chat sekarang punya minimum width 360px, header dibuat flex-nowrap yang rapi, dan direct message routing berjalan dua arah secara real-time. Seluruh unit tests 13/13 PASS!`;
        taskRef = { id: 'AGT-104', title: 'Agent Chat Industrial UI Polish & Anti-Slop Redesign', status: 'DONE' };
      } else {
        content = `Siap @${sender.name}! Sebagai Fullstack Lead, saya mengawal arsitektur React 19 + Vite agar modular, bebas debt, dan siap menerima integrasi Swarm Mission Control langsung di aplikasi web.`;
      }
      break;

    case 6: // Dimas Saputra (LMS Core & Assessment Engineer)
      if (query.includes('player') || query.includes('theatre') || query.includes('video') || query.includes('bl-217')) {
        content = `Halo @${sender.name}! Komponen LessonTheatrePlayer.tsx dan CourseCurriculumRail.tsx untuk BL-217 sudah saya tuntaskan dan lulus 8 unit tests baru. Begitu Mas Rizco merilis approval resmi PRP-2102, saya langsung sambungkan ke CoursePlayerPage.tsx!`;
        taskRef = { id: 'BL-217', title: 'CoursePlayerPage Collapsible Lesson Theatre', status: 'IN_SPRINT' };
      } else {
        content = `Halo @${sender.name}! Assessment Quiz-Runner dan modul tes Kraepelin sudah berjalan dengan mode industrial workbench tanpa reload halaman. Ada kebutuhan modul soal baru?`;
      }
      break;

    case 7: // Bayu Pratama (Frontend & Design Systems Engineer)
      if (query.includes('warna') || query.includes('token') || query.includes('border') || query.includes('desain') || query.includes('slop')) {
        content = `Halo @${sender.name}! Sesuai pedoman DESIGN.md v4.0.0, kita mengunci standar Industrial Precision: canvas #F4F4F1 / #0D1117, border #D4D4CE, dan zero bounce hover. Bouncy zoom pada reaction picker sudah kita bersihkan dan diganti tactile scale 0.98.`;
        codeSnippet = {
          language: 'css',
          code: `/* DESIGN.md Industrial Precision Palette */
--bg-canvas: #F4F4F1;
--surface-panel: #FFFFFF;
--border-industrial: #D4D4CE;
--status-teal: #0F766E;
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';`,
        };
      } else {
        content = `Siap @${sender.name}! Design system sedang mengawal kepatuhan token di seluruh 16 permukaan LMS dan Group Chat.`;
      }
      break;

    case 8: // Hendra Gunawan (Backend & Security Engineer)
      content = `Halo @${sender.name}. Audit keamanan build v4.0.0 mencatat zero-vulnerabilities. CSP headers ketat diterapkan tanpa unsafe-eval, dan anti-cheat focus monitor melindungi integritas ujian psikotes.`;
      taskRef = { id: 'FIX-211', title: 'Zero-Vulnerability CSP & Anti-Cheat Protocol', status: 'VERIFIED' };
      break;

    case 9: // Maya Putri (Mobile & Responsive UX Engineer)
      content = `Halo @${sender.name}! Untuk pengalaman mobile di iPhone dan Android, CourseSyllabusDrawer sudah memakai Apple fluid gesture: upward resistance 0.2, flick velocity dismissal >0.6px/ms, dan tap target aman >44px.`;
      break;

    case 10: // Qonita Anindya (QA Lead & Visual Testing Arbiter)
      if (query.includes('qa') || query.includes('test') || query.includes('audit') || query.includes('wcag') || query.includes('pass')) {
        content = `Laporan resmi QA: Seluruh 176 unit tests di LMS client dan 13 unit tests di Agent Chat Hub LULUS 100%! Audit kontras WCAG 2.1 AA & AAA mencapai rasio 17.04:1 pada canvas ink, dan pengujian multi-viewport (375px, 768px, 1280px, 1920px) mencatat 0 DEFECT!`;
        taskRef = { id: 'QAE-211', title: 'Multi-Viewport Visual QA & WCAG AA Protocol', status: 'VERIFIED' };
      } else {
        content = `Halo @${sender.name}! Sebagai QA Lead, saya memvalidasi setiap merge request dengan kriteria tes komprehensif. Tidak ada kode yang lolos tanpa passing test suites!`;
      }
      break;

    case 11: // Aris Munandar (DevOps & SRE)
      content = `Halo @${sender.name}! Infrastruktur Vercel Edge caching berjalan mulus dengan FCP rata-rata 64ms. Kompresi Brotli memangkas aset statis hingga 68%, dan deployment pipeline kita zero-downtime.`;
      taskRef = { id: 'OPS-211', title: 'Edge Brotli Compression & Zero-Downtime Pipeline', status: 'IN_SPRINT' };
      break;

    case 12: // Tara Wulandari (Documentarian & Confluence Lead)
      content = `Halo @${sender.name}! Seluruh RFC, PRD, dan changelog Sprint 21 telah terarsip lengkap di Confluence lokatalenta-docs. PRP-2106 (Agent Chat RFC) sudah disetujui Mas Rizco dan PRP-2102 (CoursePlayer Blueprint) sedang menunggu giliran sign-off.`;
      taskRef = { id: 'PRP-2106', title: 'Agent Discussion Hub Architecture RFC', status: 'APPROVED' };
      break;

    default:
      content = `Halo @${sender.name}! Pesanmu sudah saya terima di divisi ${targetAgent.division.toUpperCase()} (Lantai ${targetAgent.floor}). Tugas aktif saya: "${targetAgent.currentTask}". Siap berkolaborasi!`;
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
    reactions: [{ emoji: '🤝', count: 1, agentIds: [sender.id] }],
  };
}

export function detectMentionedAgent(text: string): Agent | null {
  const lower = text.toLowerCase();
  for (const agent of LOKATALENTA_AGENTS) {
    const firstName = agent.name.split(' ')[0].toLowerCase();
    const fullName = agent.name.toLowerCase();
    if (
      lower.includes(`@${firstName}`) ||
      lower.includes(`@${fullName}`) ||
      lower.includes(firstName)
    ) {
      return agent;
    }
  }
  return null;
}
