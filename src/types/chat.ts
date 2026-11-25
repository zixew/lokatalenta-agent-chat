export type Division = 'executive' | 'architecture' | 'engineering' | 'qa' | 'devops' | 'lounge';

export type AgentStatus = 'online' | 'busy' | 'reviewing' | 'coding' | 'testing' | 'idle';

export interface Agent {
  id: number;
  name: string;
  role: string;
  division: Division;
  avatar: string;
  status: AgentStatus;
  currentTask: string;
  floor: number; // 0: Entrance, 1: Engineering/QA, 2: Exec, 3: Architecture/DevOps, 4: Lounge
  bio: string;
  isUser?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  topic: string;
  category: 'sprint' | 'design' | 'engineering' | 'general';
  unreadCount?: number;
  isPrivate?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  agentIds: number[];
}

export interface Message {
  id: string;
  channelId: string;
  senderId: number;
  senderName: string;
  senderRole: string;
  senderDivision: Division;
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  taskRef?: {
    id: string;
    title: string;
    status: string;
  };
  reactions: MessageReaction[];
  threadCount?: number;
  isPinned?: boolean;
}

export type ProposalStatus = 'pending_approval' | 'approved' | 'revision_requested' | 'rejected';

export interface DocumentProposal {
  id: string; // e.g. PRP-2101
  title: string;
  summary: string;
  fullDocMarkdown: string;
  authorId: number;
  authorName: string;
  authorRole: string;
  authorDivision: Division;
  targetBacklogId: string;
  targetBacklogTitle: string;
  status: ProposalStatus;
  submittedAt: string;
  reviewedAt?: string;
  leadNotes?: string;
}
