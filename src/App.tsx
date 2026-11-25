import { useEffect, useState } from 'react';
import { AgentRoster } from './components/AgentRoster';
import { AutonomousDiscussionModal } from './components/AutonomousDiscussionModal';
import { ChatArea } from './components/ChatArea';
import { DocumentApprovalModal } from './components/DocumentApprovalModal';
import { Header } from './components/Header';
import { Office3DModal } from './components/Office3DModal';
import { Sidebar } from './components/Sidebar';
import { TEAM_LEAD_USER, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { INITIAL_MESSAGES } from './data/initialMessages';
import { INITIAL_PROPOSALS } from './data/initialProposals';
import { detectMentionedAgent, generatePersonaReply } from './services/personaEngine';
import type { Agent, Message, DocumentProposal } from './types/chat';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('lokatalenta-theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState<Agent>(TEAM_LEAD_USER);
  const [activeChannelId, setActiveChannelId] = useState<string>('lms-full-revamp-anti-slop');
  const [activeDmAgentId, setActiveDmAgentId] = useState<number | null>(null);
  const [rosterOpen, setRosterOpen] = useState(true);
  const [autoModalOpen, setAutoModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [office3dOpen, setOffice3dOpen] = useState(false);
  const [office3dFloor, setOffice3dFloor] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');

  const [proposals, setProposals] = useState<DocumentProposal[]>(() => {
    const saved = localStorage.getItem('lokatalenta-agent-proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROPOSALS;
      }
    }
    return INITIAL_PROPOSALS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('lokatalenta-agent-messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lokatalenta-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lokatalenta-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('lokatalenta-agent-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('lokatalenta-agent-proposals', JSON.stringify(proposals));
  }, [proposals]);

  const handleApproveProposal = (proposalId: string, feedback?: string) => {
    const targetProp = proposals.find((p) => p.id === proposalId);
    if (!targetProp) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'approved',
              reviewedAt: timeStr,
              leadNotes: feedback || 'Disetujui penuh oleh Team Lead.',
            }
          : p
      )
    );

    // Broadcast official announcement to #sprint-21-sync from Team Lead (Rizco Renova)
    const announcementMsg: Message = {
      id: `msg-approve-${Date.now()}`,
      channelId: 'sprint-21-sync',
      senderId: 0,
      senderName: 'Rizco Renova (You)',
      senderRole: 'Team Lead & Release Arbiter',
      senderDivision: 'executive',
      content: `📢 **[OTORISASI RESMI TEAM LEAD]** Saya telah MENYETUJUI proposal **${targetProp.id}: ${targetProp.title}**!\n\nTarget Backlog: \`${targetProp.targetBacklogId}\` (${targetProp.targetBacklogTitle})\nAuthor: **@${targetProp.authorName}**\n\n${
        feedback ? `💬 *Catatan Lead:* "${feedback}"\n\n` : ''
      }✅ Status pengerjaan task resmi **DIBUKA (IN PROGRESS)**. Tim dipersilakan memulai commit & implementasi sesuai spesifikasi.`,
      timestamp: timeStr,
      taskRef: {
        id: targetProp.targetBacklogId,
        title: targetProp.targetBacklogTitle,
        status: 'approved',
      },
      reactions: [{ emoji: '🎉', count: 3, agentIds: [1, 2, targetProp.authorId] }],
    };

    setMessages((prev) => [...prev, announcementMsg]);

    // Author agent responds with gratitude and immediate action
    setTimeout(() => {
      const respTime = new Date();
      const respTimeStr = `${String(respTime.getHours()).padStart(2, '0')}:${String(respTime.getMinutes()).padStart(2, '0')}`;
      const authorAgent = LOKATALENTA_AGENTS.find((a) => a.id === targetProp.authorId);

      if (authorAgent) {
        const confirmMsg: Message = {
          id: `msg-confirm-${Date.now()}`,
          channelId: 'sprint-21-sync',
          senderId: authorAgent.id,
          senderName: authorAgent.name,
          senderRole: authorAgent.role,
          senderDivision: authorAgent.division,
          content: `Terima kasih banyak atas otorisasi dan arahannya, Mas @Rizco Renova! 🙏 Siap segera kami eksekusi sesuai standar Industrial Precision tanpa kompromi!`,
          timestamp: respTimeStr,
          reactions: [{ emoji: '🚀', count: 2, agentIds: [0, authorAgent.id] }],
        };
        setMessages((prev) => [...prev, confirmMsg]);
      }
    }, 600);
  };

  const handleRequestRevisionProposal = (proposalId: string, feedback: string) => {
    const targetProp = proposals.find((p) => p.id === proposalId);
    if (!targetProp) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'revision_requested',
              reviewedAt: timeStr,
              leadNotes: feedback,
            }
          : p
      )
    );

    const revisionMsg: Message = {
      id: `msg-rev-${Date.now()}`,
      channelId: 'sprint-21-sync',
      senderId: 0,
      senderName: 'Rizco Renova (You)',
      senderRole: 'Team Lead & Release Arbiter',
      senderDivision: 'executive',
      content: `⚠️ **[PERMINTAAN REVISI PROPOSAL]** Dokumen **${targetProp.id}** membutuhkan penyesuaian sebelum dapat diizinkan.\n\nAuthor: @${targetProp.authorName}\nArahan Team Lead: "${feedback}"\n\nTask teknis tetap **DIBEKUKAN** sampai revisi diajukan kembali dan disetujui.`,
      timestamp: timeStr,
      taskRef: {
        id: targetProp.targetBacklogId,
        title: targetProp.targetBacklogTitle,
        status: 'revision_requested',
      },
      reactions: [{ emoji: '📝', count: 1, agentIds: [targetProp.authorId] }],
    };

    setMessages((prev) => [...prev, revisionMsg]);
  };

  const handleRejectProposal = (proposalId: string, reason: string) => {
    const targetProp = proposals.find((p) => p.id === proposalId);
    if (!targetProp) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'rejected',
              reviewedAt: timeStr,
              leadNotes: reason,
            }
          : p
      )
    );

    const rejectMsg: Message = {
      id: `msg-rej-${Date.now()}`,
      channelId: 'sprint-21-sync',
      senderId: 0,
      senderName: 'Rizco Renova (You)',
      senderRole: 'Team Lead & Release Arbiter',
      senderDivision: 'executive',
      content: `🛑 **[PROPOSAL DITOLAK]** Proposal **${targetProp.id}: ${targetProp.title}** tidak disetujui untuk sprint ini.\n\nAlasan: "${reason}". Task dibatalkan / ditunda.`,
      timestamp: timeStr,
      taskRef: {
        id: targetProp.targetBacklogId,
        title: targetProp.targetBacklogTitle,
        status: 'rejected',
      },
      reactions: [],
    };

    setMessages((prev) => [...prev, rejectMsg]);
  };

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setActiveDmAgentId(null);
  };

  const handleSelectDm = (agentId: number) => {
    setActiveDmAgentId(agentId);
  };

  const handleSendMessage = (
    content: string,
    codeSnippet?: { language: string; code: string },
    taskRef?: { id: string; title: string; status: string }
  ) => {
    const targetChannelId =
      activeDmAgentId !== null
        ? `dm_${Math.min(currentUser.id, activeDmAgentId)}_${Math.max(currentUser.id, activeDmAgentId)}`
        : activeChannelId;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId: targetChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderDivision: currentUser.division,
      content,
      timestamp: timeStr,
      codeSnippet,
      taskRef,
      reactions: [],
    };

    setMessages((prev) => [...prev, newMsg]);

    // Check if an agent should reply automatically in persona!
    let respondingAgent: Agent | null = null;
    if (activeDmAgentId !== null) {
      respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === activeDmAgentId) ?? null;
    } else {
      respondingAgent = detectMentionedAgent(content);
    }

    if (respondingAgent && respondingAgent.id !== currentUser.id) {
      setTimeout(() => {
        const replyPayload = generatePersonaReply({
          sender: currentUser,
          targetAgent: respondingAgent!,
          userMessage: content,
          channelId: targetChannelId,
        });

        const replyTime = new Date();
        const replyTimeStr = `${String(replyTime.getHours()).padStart(2, '0')}:${String(replyTime.getMinutes()).padStart(2, '0')}`;

        const replyMsg: Message = {
          ...replyPayload,
          id: `reply-${Date.now()}`,
          timestamp: replyTimeStr,
        };

        setMessages((prev) => [...prev, replyMsg]);
      }, 550);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          const hasVoted = existing.agentIds.includes(currentUser.id);
          const nextAgentIds = hasVoted
            ? existing.agentIds.filter((id) => id !== currentUser.id)
            : [...existing.agentIds, currentUser.id];

          const nextReactions = m.reactions
            .map((r) =>
              r.emoji === emoji
                ? { ...r, count: nextAgentIds.length, agentIds: nextAgentIds }
                : r
            )
            .filter((r) => r.count > 0);

          return { ...m, reactions: nextReactions };
        } else {
          return {
            ...m,
            reactions: [
              ...m.reactions,
              { emoji, count: 1, agentIds: [currentUser.id] },
            ],
          };
        }
      })
    );
  };

  const handleInjectSimulatedMessages = (
    newMessages: Omit<Message, 'id' | 'timestamp'>[]
  ) => {
    const now = new Date();
    const baseMinutes = now.getMinutes();

    const stamped: Message[] = newMessages.map((m, idx) => {
      const min = (baseMinutes + idx) % 60;
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      return {
        ...m,
        id: `sim-${Date.now()}-${idx}`,
        timestamp: timeStr,
      };
    });

    setMessages((prev) => [...prev, ...stamped]);
  };

  const targetChannelId =
    activeDmAgentId !== null
      ? `dm_${Math.min(currentUser.id, activeDmAgentId)}_${Math.max(currentUser.id, activeDmAgentId)}`
      : activeChannelId;

  const activeChannel = INITIAL_CHANNELS.find((c) => c.id === activeChannelId);
  const activeDmAgent =
    activeDmAgentId !== null
      ? LOKATALENTA_AGENTS.find((a) => a.id === activeDmAgentId)
      : undefined;

  const displayedMessages = messages
    .filter((m) => {
      if (activeDmAgentId !== null) {
        return m.channelId === targetChannelId;
      }
      return m.channelId === activeChannelId;
    })
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        m.content.toLowerCase().includes(query) ||
        m.senderName.toLowerCase().includes(query) ||
        m.taskRef?.id.toLowerCase().includes(query)
      );
    });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F4F1] dark:bg-[#0D1117]">
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onToggleRoster={() => setRosterOpen(!rosterOpen)}
        rosterOpen={rosterOpen}
        onOpenAutoDiscussion={() => setAutoModalOpen(true)}
        onOpenOffice3D={() => {
          setOffice3dFloor(2);
          setOffice3dOpen(true);
        }}
        onOpenDocumentApproval={() => setApprovalModalOpen(true)}
        pendingProposalsCount={proposals.filter((p) => p.status === 'pending_approval').length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          channels={INITIAL_CHANNELS}
          agents={LOKATALENTA_AGENTS}
          activeChannelId={activeChannelId}
          onSelectChannel={handleSelectChannel}
          activeDmAgentId={activeDmAgentId}
          onSelectDm={handleSelectDm}
        />

        <ChatArea
          channel={activeChannel}
          dmAgent={activeDmAgent}
          messages={displayedMessages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onAddReaction={handleAddReaction}
        />

        <AgentRoster
          agents={LOKATALENTA_AGENTS}
          isOpen={rosterOpen}
          onClose={() => setRosterOpen(false)}
          onSelectDm={handleSelectDm}
          onOpenFloor={(fl) => {
            setOffice3dFloor(fl);
            setOffice3dOpen(true);
          }}
        />
      </div>

      <AutonomousDiscussionModal
        isOpen={autoModalOpen}
        onClose={() => setAutoModalOpen(false)}
        activeChannelName={activeChannel?.name ?? 'lms-full-revamp-anti-slop'}
        onInjectMessages={handleInjectSimulatedMessages}
      />

      <Office3DModal
        isOpen={office3dOpen}
        onClose={() => setOffice3dOpen(false)}
        initialFloor={office3dFloor}
      />

      <DocumentApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        proposals={proposals}
        onApprove={handleApproveProposal}
        onRequestRevision={handleRequestRevisionProposal}
        onReject={handleRejectProposal}
      />
    </div>
  );
}
