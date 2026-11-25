import { useEffect, useState } from 'react';
import { AgentRoster } from './components/AgentRoster';
import { AutonomousDiscussionModal } from './components/AutonomousDiscussionModal';
import { ChatArea } from './components/ChatArea';
import { Header } from './components/Header';
import { Office3DModal } from './components/Office3DModal';
import { Sidebar } from './components/Sidebar';
import { SwarmMissionControlModal } from './components/SwarmMissionControlModal';
import { TEAM_LEAD_USER, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { INITIAL_MESSAGES } from './data/initialMessages';
import { detectMentionedAgent, generatePersonaReply } from './services/personaEngine';
import { setupSDLCEventListener, formatEventToChatMessage } from './services/eventBusListener';
import type { Agent, Message } from './types/chat';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('lokatalenta-theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState<Agent>(TEAM_LEAD_USER);
  const [activeChannelId, setActiveChannelId] = useState<string>('lms-full-revamp-anti-slop');
  const [activeDmAgentId, setActiveDmAgentId] = useState<number | null>(null);
  const [rosterOpen, setRosterOpen] = useState(true);
  const [autoModalOpen, setAutoModalOpen] = useState(false);
  const [swarmControlOpen, setSwarmControlOpen] = useState(false);
  const [office3dOpen, setOffice3dOpen] = useState(false);
  const [office3dFloor, setOffice3dFloor] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');

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
    const cleanup = setupSDLCEventListener((event) => {
      const msg = formatEventToChatMessage(event);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return cleanup;
  }, []);

  const handleBroadcastToSwarm = (content: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const broadcastMsg: Message = {
      id: `msg-swarm-${Date.now()}`,
      channelId: 'sprint-21-sync',
      senderId: 0,
      senderName: 'Rizco Renova (You)',
      senderRole: 'Team Lead & Release Arbiter',
      senderDivision: 'executive',
      content: `⚡ **[SWARM MISSION BROADCAST]** ${content}`,
      timestamp: timeStr,
      reactions: [{ emoji: '⚡', count: 4, agentIds: [1, 5, 7, 10] }],
    };

    setMessages((prev) => [...prev, broadcastMsg]);

    // Multiple agents respond in turn to the broadcast
    setTimeout(() => {
      const respTime1 = new Date();
      const t1 = `${String(respTime1.getHours()).padStart(2, '0')}:${String(respTime1.getMinutes()).padStart(2, '0')}`;
      const fajar = LOKATALENTA_AGENTS.find((a) => a.id === 5)!;
      const fajarMsg: Message = {
        id: `msg-reply-fajar-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: fajar.id,
        senderName: fajar.name,
        senderRole: fajar.role,
        senderDivision: fajar.division,
        content: `Instruksi swarm diterima Mas Lead @Rizco Renova! Tim Web Engineering langsung menyelaraskan task komponen.`,
        timestamp: t1,
        reactions: [{ emoji: '🚀', count: 2, agentIds: [0, 5] }],
      };
      setMessages((prev) => [...prev, fajarMsg]);
    }, 500);

    setTimeout(() => {
      const respTime2 = new Date();
      const t2 = `${String(respTime2.getHours()).padStart(2, '0')}:${String(respTime2.getMinutes()).padStart(2, '0')}`;
      const qonita = LOKATALENTA_AGENTS.find((a) => a.id === 10)!;
      const qonitaMsg: Message = {
        id: `msg-reply-qonita-${Date.now()}`,
        channelId: 'sprint-21-sync',
        senderId: qonita.id,
        senderName: qonita.name,
        senderRole: qonita.role,
        senderDivision: qonita.division,
        content: `QA Test Suite siaga penuh. Seluruh test cases komprehensif kami eksekusi otomatis untuk setiap perubahan!`,
        timestamp: t2,
        reactions: [{ emoji: '✅', count: 3, agentIds: [0, 5, 10] }],
      };
      setMessages((prev) => [...prev, qonitaMsg]);
    }, 1100);
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
      // In channel mode, if no specific agent was mentioned, have a relevant lead reply!
      if (!respondingAgent) {
        if (activeChannelId === 'qa-visual-testing') {
          respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === 10) ?? null; // Qonita
        } else if (activeChannelId === 'office-3d-telemetry') {
          respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === 1) ?? null; // Raka
        } else if (activeChannelId === 'backlog-refinement') {
          respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === 2) ?? null; // Pranadipa
        } else if (activeChannelId === 'sprint-21-sync') {
          respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === 5) ?? null; // Fajar
        } else {
          respondingAgent = LOKATALENTA_AGENTS.find((a) => a.id === 7) ?? null; // Bayu (Design)
        }
      }
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
      }, 400);
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
        onOpenSwarmControl={() => setSwarmControlOpen(true)}
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

      <SwarmMissionControlModal
        isOpen={swarmControlOpen}
        onClose={() => setSwarmControlOpen(false)}
        agents={LOKATALENTA_AGENTS}
        onBroadcastToSwarm={handleBroadcastToSwarm}
        onOpenOffice3D={(floor) => {
          setOffice3dFloor(floor);
          setSwarmControlOpen(false);
          setOffice3dOpen(true);
        }}
      />
    </div>
  );
}
