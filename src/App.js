import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AgentRoster } from './components/AgentRoster';
import { AutonomousDiscussionModal } from './components/AutonomousDiscussionModal';
import { ChatArea } from './components/ChatArea';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HUMAN_LEAD, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { INITIAL_MESSAGES } from './data/initialMessages';
export function App() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('lokatalenta-theme') === 'dark';
    });
    const [currentUser, setCurrentUser] = useState(HUMAN_LEAD);
    const [activeChannelId, setActiveChannelId] = useState('lms-full-revamp-anti-slop');
    const [activeDmAgentId, setActiveDmAgentId] = useState(null);
    const [rosterOpen, setRosterOpen] = useState(true);
    const [autoModalOpen, setAutoModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('lokatalenta-agent-messages');
        if (saved) {
            try {
                return JSON.parse(saved);
            }
            catch {
                return INITIAL_MESSAGES;
            }
        }
        return INITIAL_MESSAGES;
    });
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('lokatalenta-theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('lokatalenta-theme', 'light');
        }
    }, [isDark]);
    useEffect(() => {
        localStorage.setItem('lokatalenta-agent-messages', JSON.stringify(messages));
    }, [messages]);
    const handleSelectChannel = (id) => {
        setActiveChannelId(id);
        setActiveDmAgentId(null);
    };
    const handleSelectDm = (agentId) => {
        setActiveDmAgentId(agentId);
    };
    const handleSendMessage = (content, codeSnippet, taskRef) => {
        const targetChannelId = activeDmAgentId !== null
            ? `dm_${Math.min(currentUser.id, activeDmAgentId)}_${Math.max(currentUser.id, activeDmAgentId)}`
            : activeChannelId;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newMsg = {
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
    };
    const handleAddReaction = (messageId, emoji) => {
        setMessages((prev) => prev.map((m) => {
            if (m.id !== messageId)
                return m;
            const existing = m.reactions.find((r) => r.emoji === emoji);
            if (existing) {
                const hasVoted = existing.agentIds.includes(currentUser.id);
                const nextAgentIds = hasVoted
                    ? existing.agentIds.filter((id) => id !== currentUser.id)
                    : [...existing.agentIds, currentUser.id];
                const nextReactions = m.reactions
                    .map((r) => r.emoji === emoji
                    ? { ...r, count: nextAgentIds.length, agentIds: nextAgentIds }
                    : r)
                    .filter((r) => r.count > 0);
                return { ...m, reactions: nextReactions };
            }
            else {
                return {
                    ...m,
                    reactions: [
                        ...m.reactions,
                        { emoji, count: 1, agentIds: [currentUser.id] },
                    ],
                };
            }
        }));
    };
    const handleInjectSimulatedMessages = (newMessages) => {
        const now = new Date();
        const baseMinutes = now.getMinutes();
        const stamped = newMessages.map((m, idx) => {
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
    const targetChannelId = activeDmAgentId !== null
        ? `dm_${Math.min(currentUser.id, activeDmAgentId)}_${Math.max(currentUser.id, activeDmAgentId)}`
        : activeChannelId;
    const activeChannel = INITIAL_CHANNELS.find((c) => c.id === activeChannelId);
    const activeDmAgent = activeDmAgentId !== null
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
        if (!searchQuery.trim())
            return true;
        const query = searchQuery.toLowerCase();
        return (m.content.toLowerCase().includes(query) ||
            m.senderName.toLowerCase().includes(query) ||
            m.taskRef?.id.toLowerCase().includes(query));
    });
    return (_jsxs("div", { className: "flex flex-col h-screen w-screen overflow-hidden bg-[#F4F4F1] dark:bg-[#0D1117]", children: [_jsx(Header, { currentUser: currentUser, onSelectUser: setCurrentUser, isDark: isDark, onToggleTheme: () => setIsDark(!isDark), onToggleRoster: () => setRosterOpen(!rosterOpen), rosterOpen: rosterOpen, onOpenAutoDiscussion: () => setAutoModalOpen(true), searchQuery: searchQuery, onSearchChange: setSearchQuery }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsx(Sidebar, { channels: INITIAL_CHANNELS, agents: LOKATALENTA_AGENTS, activeChannelId: activeChannelId, onSelectChannel: handleSelectChannel, activeDmAgentId: activeDmAgentId, onSelectDm: handleSelectDm }), _jsx(ChatArea, { channel: activeChannel, dmAgent: activeDmAgent, messages: displayedMessages, currentUser: currentUser, onSendMessage: handleSendMessage, onAddReaction: handleAddReaction }), _jsx(AgentRoster, { agents: LOKATALENTA_AGENTS, isOpen: rosterOpen, onClose: () => setRosterOpen(false), onSelectDm: handleSelectDm })] }), _jsx(AutonomousDiscussionModal, { isOpen: autoModalOpen, onClose: () => setAutoModalOpen(false), activeChannelName: activeChannel?.name ?? 'lms-full-revamp-anti-slop', onInjectMessages: handleInjectSimulatedMessages })] }));
}
