import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hash } from 'lucide-react';
export function Sidebar({ channels, agents, activeChannelId, onSelectChannel, activeDmAgentId, onSelectDm, }) {
    const categories = [
        { id: 'design', label: 'LMS Revamp & UI' },
        { id: 'sprint', label: 'Sprint & Backlog' },
        { id: 'engineering', label: 'Teknikal & 3D' },
        { id: 'general', label: 'Umum' },
    ];
    return (_jsxs("aside", { className: "w-64 border-r border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex flex-col shrink-0 select-none overflow-y-auto", children: [_jsxs("div", { className: "p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] space-y-4", children: [_jsx("div", { className: "flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400", children: _jsx("span", { children: "Kanal Diskusi" }) }), categories.map((cat) => {
                        const groupChannels = channels.filter((c) => c.category === cat.id);
                        if (groupChannels.length === 0)
                            return null;
                        return (_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] dark:text-slate-500 px-2", children: cat.label }), _jsx("div", { className: "space-y-0.5", children: groupChannels.map((c) => {
                                        const isActive = activeChannelId === c.id && activeDmAgentId === null;
                                        return (_jsxs("button", { type: "button", onClick: () => onSelectChannel(c.id), className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${isActive
                                                ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 font-bold border border-[#0F766E]/40'
                                                : 'text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'}`, children: [_jsxs("span", { className: "flex items-center gap-2 truncate", children: [_jsx(Hash, { className: "w-3.5 h-3.5 shrink-0 opacity-70" }), _jsx("span", { className: "truncate", children: c.name })] }), c.unreadCount && c.unreadCount > 0 ? (_jsx("span", { className: "px-1.5 py-0.2 rounded-full bg-[#0F766E] text-white text-[10px] font-mono shrink-0", children: c.unreadCount })) : null] }, c.id));
                                    }) })] }, cat.id));
                    })] }), _jsxs("div", { className: "p-3 space-y-2 flex-1", children: [_jsx("div", { className: "flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400", children: _jsx("span", { children: "Pesan Langsung (13 Agen)" }) }), _jsx("div", { className: "space-y-0.5", children: agents.map((agent) => {
                            const isActive = activeDmAgentId === agent.id;
                            return (_jsx("button", { type: "button", onClick: () => onSelectDm(agent.id), className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${isActive
                                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-teal-300 font-bold border border-[#0F766E]/40'
                                    : 'text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'}`, children: _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("span", { className: "w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center font-mono", children: agent.avatar }), _jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-[#161B22] ${agent.status === 'online'
                                                        ? 'bg-emerald-500'
                                                        : agent.status === 'coding'
                                                            ? 'bg-blue-500'
                                                            : agent.status === 'reviewing'
                                                                ? 'bg-amber-500'
                                                                : 'bg-slate-400'}` })] }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "truncate text-xs", children: agent.name }), _jsxs("p", { className: "text-[10px] text-[#A1A1AA] dark:text-slate-500 truncate", children: ["Fl.", agent.floor, " \u2022 ", agent.role] })] })] }) }, agent.id));
                        }) })] })] }));
}
