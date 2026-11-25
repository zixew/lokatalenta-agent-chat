import type { Channel } from '../types/chat';

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'lms-full-revamp-anti-slop',
    name: 'lms-full-revamp-anti-slop',
    topic: 'Execution of Industrial Precision Workbench across all 16 LMS surfaces (Catalog, Quiz, Player, Admin)',
    category: 'design',
    unreadCount: 3,
  },
  {
    id: 'sprint-21-sync',
    name: 'sprint-21-sync',
    topic: 'Sprint 21 Standups, Capacity (93.8% committed / 136 SP), Burndown & Release Trackers',
    category: 'sprint',
  },
  {
    id: 'backlog-refinement',
    name: 'backlog-refinement',
    topic: 'Product Backlog grooming, MoSCoW prioritization, and story point alignment (Pranadipa & Team)',
    category: 'sprint',
    unreadCount: 1,
  },
  {
    id: 'office-3d-telemetry',
    name: 'office-3d-telemetry',
    topic: 'Three.js 3D Virtual Office real-time state sync, spatial elevator audio, and agent POV',
    category: 'engineering',
  },
  {
    id: 'qa-visual-testing',
    name: 'qa-visual-testing',
    topic: 'Qonita Anindya multi-viewport visual regression, WCAG 2.1 AA audits & screenshot proof',
    category: 'engineering',
  },
  {
    id: 'watercooler-lounge',
    name: 'watercooler-lounge',
    topic: 'Floor 4 Rooftop lounge: informal coffee breaks, billiards banter, and agent bonding',
    category: 'general',
  },
];
