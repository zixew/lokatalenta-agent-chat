import type { Message } from '../types/chat';

export interface SDLCEventPayload {
  type:
    | 'proposal_approved'
    | 'proposal_revision_requested'
    | 'proposal_rejected'
    | 'proposal_created'
    | 'release_authorized';
  proposalId?: string;
  proposalTitle?: string;
  authorId?: number;
  authorName?: string;
  targetBacklogId?: string;
  targetBacklogTitle?: string;
  version?: string;
  notes?: string;
  timestamp: string;
}

const CHANNEL_NAME = 'lokatalenta-sdlc-events';

export function setupSDLCEventListener(onEvent: (event: SDLCEventPayload) => void): () => void {
  let broadcastChannel: BroadcastChannel | null = null;

  // 1. Listen via BroadcastChannel
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (e) => {
        if (e.data && e.data.type) {
          onEvent(e.data as SDLCEventPayload);
        }
      };
    }
  } catch {
    // Ignore BroadcastChannel errors
  }

  // 2. Storage event listener fallback
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'lokatalenta-latest-sdlc-event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        onEvent(parsed as SDLCEventPayload);
      } catch {
        // Ignore parse error
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (broadcastChannel) {
      broadcastChannel.close();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

export function formatEventToChatMessage(event: SDLCEventPayload): Message {
  const time = event.timestamp || 'Baru saja';

  switch (event.type) {
    case 'proposal_approved':
      return {
        id: `msg-portal-approve-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: 0,
        senderName: 'Rizco Renova (Portal Gateway)',
        senderRole: 'Team Lead & Release Arbiter',
        senderDivision: 'executive',
        content: `📢 **[OTORISASI RESMI DITERIMA DARI PORTAL]**\n\nTeam Lead **@Rizco Renova** telah **MENYETUJUI** proposal **${event.proposalId}: ${event.proposalTitle || ''}** via Executive Approval Portal!\n\nTarget Backlog: \`${event.targetBacklogId || '-'}\` (${event.targetBacklogTitle || ''})\nCatatan Lead: *"${event.notes || 'Disetujui penuh oleh Team Lead.'}"*\n\n✅ Seluruh pengerjaan teknis resmi dibuka (**IN PROGRESS**). Tim dipersilakan melanjutkan implementasi!`,
        timestamp: time,
        taskRef: event.targetBacklogId
          ? {
              id: event.targetBacklogId,
              title: event.targetBacklogTitle || '',
              status: 'approved',
            }
          : undefined,
        reactions: [{ emoji: '🎉', count: 5, agentIds: [1, 2, 5, 7, 10] }],
      };

    case 'proposal_revision_requested':
      return {
        id: `msg-portal-rev-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: 0,
        senderName: 'Rizco Renova (Portal Gateway)',
        senderRole: 'Team Lead & Release Arbiter',
        senderDivision: 'executive',
        content: `⚠️ **[PERMINTAAN REVISI DITERIMA DARI PORTAL]**\n\nProposal **${event.proposalId}** memerlukan penyesuaian spesifikasi sebelum disetujui.\n\nArahan Lead: *"${event.notes || ''}"*\n\nTask teknis tetap dibekukan (**FROZEN**) sampai revisi diajukan kembali.`,
        timestamp: time,
        reactions: [{ emoji: '📝', count: 2, agentIds: [0, event.authorId || 1] }],
      };

    case 'proposal_created':
      return {
        id: `msg-portal-create-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: event.authorId || 12,
        senderName: event.authorName || 'Tara Wulandari',
        senderRole: 'Documentarian & Confluence Lead',
        senderDivision: 'executive',
        content: `📄 **[PROPOSAL BARU DIAJUKAN KE PORTAL]**\n\nProposal **${event.proposalId}: ${event.proposalTitle || ''}** telah diajukan ke Approval Portal untuk ditinjau oleh Mas Lead @Rizco Renova.\n\nTarget Backlog: \`${event.targetBacklogId || '-'}\``,
        timestamp: time,
        reactions: [{ emoji: '👀', count: 3, agentIds: [0, 2, 12] }],
      };

    case 'release_authorized':
      return {
        id: `msg-portal-release-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: 0,
        senderName: 'Rizco Renova (Portal Gateway)',
        senderRole: 'Team Lead & Release Arbiter',
        senderDivision: 'executive',
        content: `🚀 **[OTORISASI RILIS PRODUKSI RESMI DIBERIKAN]**\n\nTeam Lead & Release Arbiter telah mengesahkan deployment **${event.version || 'v4.0.0'}** ke lingkungan produksi Vercel!\n\nCatatan Rilis: *"${event.notes || 'Zero defect release certified.'}"*\n\nKepada @Aris Munandar (DevOps) dan seluruh tim, silakan eksekusi release pipeline!`,
        timestamp: time,
        reactions: [{ emoji: '🚀', count: 8, agentIds: [0, 1, 2, 5, 7, 10, 11] }],
      };

    default:
      return {
        id: `msg-portal-generic-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: 0,
        senderName: 'System Gateway',
        senderRole: 'Platform Bridge',
        senderDivision: 'architecture',
        content: `ℹ️ Event SDLC diterima dari portal: ${event.type}`,
        timestamp: time,
        reactions: [],
      };
  }
}
