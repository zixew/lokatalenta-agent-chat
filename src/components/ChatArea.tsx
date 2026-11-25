import {
  Code,
  Copy,
  Check,
  Hash,
  Send,
  Smile,
  Tag,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Agent, Channel, Message } from '../types/chat';

interface ChatAreaProps {
  channel?: Channel;
  dmAgent?: Agent;
  messages: Message[];
  currentUser: Agent;
  onSendMessage: (
    content: string,
    codeSnippet?: { language: string; code: string },
    taskRef?: { id: string; title: string; status: string }
  ) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const COMMON_REACTIONS = ['👍', '🚀', '🎯', '🔥', '⚡', '👏', '✅'];

export function ChatArea({
  channel,
  dmAgent,
  messages,
  currentUser,
  onSendMessage,
  onAddReaction,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('tsx');
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [taskIdInput, setTaskIdInput] = useState('BL-217');
  const [taskTitleInput, setTaskTitleInput] = useState('CoursePlayerPage Lesson Theatre Revamp');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && !codeContent.trim()) return;

    const snippet =
      showCodeInput && codeContent.trim()
        ? { language: codeLanguage, code: codeContent }
        : undefined;

    const task = showTaskPicker
      ? { id: taskIdInput, title: taskTitleInput, status: 'IN_SPRINT' }
      : undefined;

    onSendMessage(inputText.trim(), snippet, task);
    setInputText('');
    setCodeContent('');
    setShowCodeInput(false);
    setShowTaskPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleInsertMention = (agentName: string) => {
    setInputText((prev) => `${prev}@${agentName} `);
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#F4F4F1] dark:bg-[#0D1117] min-w-[360px] overflow-hidden">
      {/* Top Channel / DM Header */}
      <div className="h-14 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {dmAgent ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <h1 className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-white truncate">
                  {dmAgent.id === 0 ? '👑 Rizco Renova' : dmAgent.name}
                </h1>
                <span className="text-[10px] sm:text-xs text-[#71717A] dark:text-slate-400 font-mono truncate">
                  ({dmAgent.role})
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[#D4D4CE] dark:border-[#282E3D]">
                  Lantai {dmAgent.floor}
                </span>
              </>
            ) : (
              <>
                <Hash className="w-4 h-4 text-[#0F766E] shrink-0" />
                <h1 className="font-bold text-xs sm:text-sm text-[#18181B] dark:text-white truncate">
                  {channel?.name ?? 'diskusi'}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30">
                  {channel?.category.toUpperCase()}
                </span>
              </>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#71717A] dark:text-slate-400 truncate mt-0.5">
            {dmAgent ? dmAgent.bio : channel?.topic}
          </p>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
        {messages.map((msg) => {
          const isLead = msg.senderId === 0;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-lg border shadow-2xs transition-colors ${
                isLead
                  ? 'bg-amber-50/30 dark:bg-[#161B22] border-amber-300/80 dark:border-amber-800/50'
                  : 'bg-white dark:bg-[#161B22] border-[#D4D4CE] dark:border-[#282E3D] hover:border-[#0F766E]/50'
              }`}
            >
              {/* Avatar Initial */}
              <div
                className={`w-8 h-8 rounded-md font-bold font-mono text-xs flex items-center justify-center shrink-0 border ${
                  isLead
                    ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-[#0F766E]/15 text-[#0F766E] dark:text-teal-300 border-[#0F766E]/30'
                }`}
              >
                {isLead ? '👑' : msg.senderName.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-xs text-[#18181B] dark:text-white truncate">
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[#52525B] dark:text-slate-300 border border-[#D4D4CE] dark:border-[#282E3D]">
                      {msg.senderRole}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-[#A1A1AA] dark:text-slate-500">
                      [{msg.senderDivision}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] dark:text-slate-400 shrink-0">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#18181B] dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {msg.codeSnippet && (
                  <div className="rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#1E232B] text-slate-100 p-2.5 space-y-1.5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                        {msg.codeSnippet.language}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(msg.id, msg.codeSnippet!.code)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedCodeId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="font-mono text-xs overflow-x-auto text-emerald-300/90 leading-relaxed max-h-56 p-1">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {msg.taskRef && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/40 border border-[#0F766E]/40 text-xs">
                    <Tag className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400 shrink-0" />
                    <span className="font-mono font-bold text-[#0F766E] dark:text-teal-300">
                      {msg.taskRef.id}
                    </span>
                    <span className="text-[#18181B] dark:text-slate-200 truncate">
                      {msg.taskRef.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1 rounded bg-[#0F766E] text-white">
                      {msg.taskRef.status}
                    </span>
                  </div>
                )}

                {/* Reactions & Actions Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {msg.reactions.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onAddReaction(msg.id, r.emoji)}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-slate-800 text-xs cursor-pointer hover:border-[#0F766E] transition-colors"
                    >
                      <span>{r.emoji}</span>
                      <span className="font-mono text-[10px] font-semibold">{r.count}</span>
                    </button>
                  ))}

                  <div className="relative group inline-block">
                    <button
                      type="button"
                      aria-label="Tambah reaksi"
                      className="p-1 rounded text-[#71717A] dark:text-slate-400 hover:text-[#18181B] dark:hover:text-white cursor-pointer"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                    <div className="hidden group-hover:flex items-center gap-1 absolute bottom-full left-0 mb-1 p-1 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] shadow-md z-10">
                      {COMMON_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => onAddReaction(msg.id, emoji)}
                          className="px-1.5 py-0.5 hover:scale-125 transition-transform text-xs cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Area */}
      <div className="border-t border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] p-3 sm:p-4 space-y-2 shrink-0 z-10">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer transition-colors ${
                showCodeInput
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
              }`}
            >
              <Code className="w-3 h-3" />
              Snippet Kode
            </button>

            <button
              type="button"
              onClick={() => setShowTaskPicker(!showTaskPicker)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border cursor-pointer transition-colors ${
                showTaskPicker
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800'
              }`}
            >
              <Tag className="w-3 h-3" />
              Tautkan Backlog
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#71717A] dark:text-slate-400 font-mono">
            <span>Quick Mention:</span>
            <button
              type="button"
              onClick={() => handleInsertMention('Tara')}
              className="hover:text-[#0F766E] underline cursor-pointer"
            >
              @Tara
            </button>
            <button
              type="button"
              onClick={() => handleInsertMention('Dimas')}
              className="hover:text-[#0F766E] underline cursor-pointer"
            >
              @Dimas
            </button>
            <button
              type="button"
              onClick={() => handleInsertMention('Bayu')}
              className="hover:text-[#0F766E] underline cursor-pointer"
            >
              @Bayu
            </button>
            <button
              type="button"
              onClick={() => handleInsertMention('Qonita')}
              className="hover:text-[#0F766E] underline cursor-pointer"
            >
              @Qonita
            </button>
          </div>
        </div>

        {showCodeInput && (
          <div className="p-2 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#71717A]">
                Format Kode / Diffs
              </span>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="text-[11px] font-mono bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded px-1.5 py-0.5"
              >
                <option value="tsx">TypeScript React (TSX)</option>
                <option value="css">CSS / Tailwind</option>
                <option value="json">JSON</option>
                <option value="sql">SQL / SQLite</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="Tempelkan kode atau diff snippet di sini..."
              className="w-full font-mono text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded p-2 focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        )}

        {showTaskPicker && (
          <div className="p-2 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-teal-50/50 dark:bg-teal-950/20 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
            <span className="text-[11px] font-mono font-bold text-[#0F766E]">Backlog Item:</span>
            <input
              type="text"
              value={taskIdInput}
              onChange={(e) => setTaskIdInput(e.target.value)}
              placeholder="Contoh: BL-217"
              className="w-24 text-xs font-mono font-bold bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded px-2 py-1"
            />
            <input
              type="text"
              value={taskTitleInput}
              onChange={(e) => setTaskTitleInput(e.target.value)}
              placeholder="Deskripsi Singkat Task"
              className="flex-1 text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded px-2 py-1 min-w-[150px]"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ketik pesan sebagai ${currentUser.name} (Enter kirim, Shift+Enter baris baru)...`}
            className="flex-1 resize-none bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded p-2.5 text-xs sm:text-sm text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() && !codeContent.trim()}
            className="px-4 py-2.5 rounded bg-[#0F766E] text-white hover:bg-[#115E59] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>
      </div>
    </main>
  );
}
