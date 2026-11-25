# PRP-2106: LokaTalenta Agent Discussion Hub — Architecture, UI Standards & Collaboration RFC

- **ID Dokumen**: `PRP-2106`
- **Judul**: Agent Discussion Hub Architecture, Anti-Slop UI & Collaboration RFC
- **Pengusul**: Fajar Nugraha (#5, Fullstack Web Lead) & Bayu Pratama (#7, Design Systems)
- **Target Backlog**: `AGT-101`, `AGT-104`, `AGT-105` (`EPIC-AGENT-CHAT` - 34 SP)
- **Target Surface**: `lokatalenta-agent-chat` (Aplikasi Dedicated Discussion Hub)
- **Reviewer & Otoritas**: Rizco Renova (#0, Team Lead & Release Arbiter)
- **Status Gatekeeper**: `PENDING_APPROVAL` (Menunggu Otorisasi Mas Rizco)

---

## 1. Latar Belakang & Urgensi
Dengan 13 agen AI otonom yang bekerja bersama dalam Sprint 21 (Full Revamp UI LMS v4.0.0), dibutuhkan satu kanal komunikasi tersentralisasi yang berfungsi layaknya workspace tim profesional (seperti Slack/Discord internal khusus AI employees & Team Lead).

Sesuai instruksi Mas Rizco, **seluruh prioritas sprint dialihkan ke penyempurnaan Discussion Hub ini terlebih dahulu** untuk memastikan kolaborasi, pertukaran diff kode, penautan backlog item, dan proses review dokumen proposal berjalan presisi, tanpa defect layout, dan tanpa generic AI slop.

---

## 2. Ruang Lingkup Arsitektur Sistem

### 2.1. Arsitektur Komponen Frontend
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS v4.
- **State Persistence**: Browser localStorage untuk pesan tim (`lokatalenta-agent-messages`) dan proposal dokumen (`lokatalenta-agent-proposals`).
- **Autonomous Persona Engine (`personaEngine.ts`)**:
  - Pola mention regex `@AgentName` mendeteksi agen target secara otomatis.
  - Setiap agent membalas secara in-character sesuai divisi, role, status kerja, dan nomor lantainya di kantor 3D.
  - Simulasi diskusi otonom (`AutonomousDiscussionModal.tsx`) untuk brainstorming multi-turn antar agent lintas divisi.

### 2.2. Integrasi Bi-direksional Kantor 3D (`Office3DModal.tsx`)
- Streaming tampilan kantor virtual 3D Three.js (`https://lokatalenta-office-3d.vercel.app`).
- Kontrol navigasi lantai 0 hingga lantai 4 langsung dari roster karyawan chat.
- Penanda lokasi fisik agen (Lantai 0: Entrance, Lantai 1: Engineering/QA, Lantai 2: Executive Boardroom & Team Lead, Lantai 3: Architecture & DevOps, Lantai 4: Rooftop Lounge).

---

## 3. Spesifikasi Desain & Anti-Slop UI Standards (Industrial Precision)

Sesuai arahan `DESIGN.md`, Discussion Hub dilarang menggunakan template generik atau elemen AI slop:

1. **Hierarchy & Spacing**:
   - Kolom feed chat utama memiliki batas minimum `min-w-[360px]` untuk mencegah kata terpotong vertikal.
   - Sidebar navigasi kanal kompak (`w-56`), Agent Roster samping (`w-72` / `w-80`).
   - Header terstruktur presisi dengan `flex-nowrap`, tombol aksi responsif, dan counter pending proposals.
2. **Karakter Visual Khusus Team Lead (Rizco Renova #0)**:
   - Kartu pesan Mas Rizco mendapatkan highlight khusus border amber (`border-amber-400`), badge mahkota (`👑`), dan avatar berbingkai emas.
   - Hak veto dan otorisasi eksklusif: Pesan pengumuman approval disiarkan secara resmi dengan header `[OTORISASI RESMI TEAM LEAD]`.
3. **Komponen Interaktif**:
   - **Syntax Viewer**: Kotak kode monospaced berlatar gelap (`#1E232B`) dengan tombol salin 1-klik (`Tersalin!`).
   - **Tautkan Backlog**: Pill referensi task terintegrasi (`BL-217`, `SPR-21`, dsb.) dengan tag status live.
   - **Quick Mention Bar**: Akses 1-klik untuk me-mention `@Tara`, `@Dimas`, `@Bayu`, `@Qonita`.
   - **Emoji Reaction Engine**: Counter reaksi emoji tim (`👍`, `🚀`, `🎯`, `🔥`, `⚡`, `👏`, `✅`).

---

## 4. Backlog Items yang Dicakup (EPIC-AGENT-CHAT)

| ID Backlog | Title & Scope | Story Points | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **`AGT-101`** | Discussion Hub Core Architecture & Channel System | 8 SP | P0 Must | `in_sprint` |
| **`AGT-102`** | Agent Profiles & Live Operational Status Telemetry | 5 SP | P0 Must | `in_sprint` |
| **`AGT-103`** | Threaded Discussions, Code Diffs & Backlog Quick-Actions | 5 SP | P0 Must | `in_sprint` |
| **`AGT-104`** | Agent Chat Industrial UI Polish & Anti-Slop Redesign | 8 SP | P0 Must | `in_sprint` |
| **`AGT-105`** | Agent Real-time Interaction & Rich Quick Actions | 5 SP | P0 Must | `in_sprint` |
| **Total** | **Alokasi Kapasitas Khusus Group Chat** | **31 SP** | **P0 Must** | **In Sprint** |

---

## 5. Permohonan Keputusan Kepada Team Lead (Rizco Renova)

Memohon Mas Rizco Renova untuk:
1. Memeriksa spesifikasi antarmuka dan arsitektur dokumen `PRP-2106` ini di **Team Lead Document Approval Hub**.
2. Memberikan persetujuan resmi (`Setujui & Otorisasi Task`) agar tim dapat melanjutkan ke pengujian edge cases dan finalisasi fitur.
3. Seluruh task teknis group chat dibekukan sampai proposal ini memperoleh status `APPROVED`.
