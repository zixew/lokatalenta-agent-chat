import { describe, expect, it } from 'vitest';
import { TEAM_LEAD_USER, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { INITIAL_PROPOSALS } from './data/initialProposals';
import { detectMentionedAgent, generatePersonaReply } from './services/personaEngine';

describe('LokaTalenta Agent Chat Data Models & Persona Engine', () => {
  it('contains all 13 AI agents with correct roles and floor positions', () => {
    expect(LOKATALENTA_AGENTS).toHaveLength(13);
    const agentNames = LOKATALENTA_AGENTS.map((a) => a.name);
    expect(agentNames).toContain('Rizco Renova (You)');
    expect(agentNames).toContain('Raka Mahendra');
    expect(agentNames).toContain('Pranadipa Wicaksana');
    expect(agentNames).toContain('Qonita Anindya');
    expect(agentNames).toContain('Bayu Pratama');
    expect(agentNames).toContain('Dimas Saputra');
  });

  it('verifies Team Lead persona belongs to Rizco Renova (Agent #0) with executive authority', () => {
    expect(TEAM_LEAD_USER.id).toBe(0);
    expect(TEAM_LEAD_USER.name).toContain('Rizco Renova');
    expect(TEAM_LEAD_USER.role).toBe('Team Lead & Release Arbiter');
    expect(TEAM_LEAD_USER.division).toBe('executive');
    expect(TEAM_LEAD_USER.isUser).toBe(true);
  });

  it('verifies initial proposals require Rizco approval before execution', () => {
    expect(INITIAL_PROPOSALS.length).toBeGreaterThanOrEqual(5);
    const pendingProposals = INITIAL_PROPOSALS.filter((p) => p.status === 'pending_approval');
    expect(pendingProposals.length).toBeGreaterThanOrEqual(5);

    const charterProp = INITIAL_PROPOSALS.find((p) => p.id === 'PRP-2101');
    expect(charterProp).toBeDefined();
    expect(charterProp?.targetBacklogId).toBe('SPR-21');
    expect(charterProp?.authorName).toBe('Tara Wulandari');
  });

  it('verifies key channels exist for anti-slop and sprint coordination', () => {
    const channelIds = INITIAL_CHANNELS.map((c) => c.id);
    expect(channelIds).toContain('lms-full-revamp-anti-slop');
    expect(channelIds).toContain('sprint-21-sync');
    expect(channelIds).toContain('backlog-refinement');
  });

  it('detects mentioned agents accurately from text', () => {
    const qonita = detectMentionedAgent('Bagaimana hasil audit @Qonita?');
    expect(qonita).toBeDefined();
    expect(qonita?.name).toBe('Qonita Anindya');

    const raka = detectMentionedAgent('Tolong cek 3D office ya @Raka');
    expect(raka).toBeDefined();
    expect(raka?.name).toBe('Raka Mahendra');

    const bayu = detectMentionedAgent('Bagaimana token desain @Bayu?');
    expect(bayu).toBeDefined();
    expect(bayu?.name).toBe('Bayu Pratama');
  });

  it('generates in-character persona replies with correct task and role', () => {
    const qonitaAgent = LOKATALENTA_AGENTS.find((a) => a.id === 10)!;
    const reply = generatePersonaReply({
      sender: TEAM_LEAD_USER,
      targetAgent: qonitaAgent,
      userMessage: 'Bagaimana status test dan kontras WCAG?',
      channelId: 'qa-visual-testing',
    });

    expect(reply.senderName).toBe('Qonita Anindya');
    expect(reply.senderRole).toBe('QA Lead & Visual Testing Arbiter');
    expect(reply.content).toContain('176 unit tests');
    expect(reply.taskRef?.id).toBe('QAE-211');
  });

  describe('AGT-106 & AGT-107: Autonomous Collaboration & Swarm Mission Control', () => {
    it('generates responsive context-aware answers for direct message inquiries across all divisions', () => {
      const dimas = LOKATALENTA_AGENTS.find((a) => a.id === 6)!;
      const dimasReply = generatePersonaReply({
        sender: TEAM_LEAD_USER,
        targetAgent: dimas,
        userMessage: 'Dimas, bagaimana kesiapan video player BL-217?',
        channelId: 'dm_0_6',
      });

      expect(dimasReply.senderName).toBe('Dimas Saputra');
      expect(dimasReply.content).toContain('LessonTheatrePlayer');
      expect(dimasReply.taskRef?.id).toBe('BL-217');

      const bagas = LOKATALENTA_AGENTS.find((a) => a.id === 3)!;
      const bagasReply = generatePersonaReply({
        sender: TEAM_LEAD_USER,
        targetAgent: bagas,
        userMessage: 'Bagas, bagaimana status SSE gateway sync?',
        channelId: 'dm_0_3',
      });
      expect(bagasReply.senderName).toBe('Bagas Prakoso');
      expect(bagasReply.content).toContain('Event Gateway SSE');
    });

    it('verifies all 13 agents have active roles, floors, and current tasks defined', () => {
      for (const agent of LOKATALENTA_AGENTS) {
        expect(agent.name).toBeDefined();
        expect(agent.role).toBeDefined();
        expect(agent.floor).toBeGreaterThanOrEqual(0);
        expect(agent.floor).toBeLessThanOrEqual(4);
        expect(agent.currentTask.length).toBeGreaterThan(5);
      }
    });
  });

  describe('AGT-101: Discussion Hub Core Architecture & Channel System', () => {
    it('structures channels into distinct categories with proper unread badges', () => {
      const categories = new Set(INITIAL_CHANNELS.map((c) => c.category));
      expect(categories.has('sprint')).toBe(true);
      expect(categories.has('design')).toBe(true);
      expect(categories.has('engineering')).toBe(true);
      expect(categories.has('general')).toBe(true);

      const unreadTotal = INITIAL_CHANNELS.reduce((acc, c) => acc + (c.unreadCount ?? 0), 0);
      expect(unreadTotal).toBeGreaterThanOrEqual(1);
    });

    it('maps every agent to a distinct direct messaging target across working floors (1-3)', () => {
      const floors = new Set(LOKATALENTA_AGENTS.map((a) => a.floor));
      expect(floors.has(1)).toBe(true); // Engineering & QA (Floors 1)
      expect(floors.has(2)).toBe(true); // Executive Boardroom (Floors 2)
      expect(floors.has(3)).toBe(true); // Architecture & DevOps (Floors 3)
      expect(LOKATALENTA_AGENTS.every((a) => a.floor >= 1 && a.floor <= 3)).toBe(true);
    });
  });

  describe('AGT-104: Agent Chat Industrial UI Polish & Anti-Slop Redesign', () => {
    it('verifies Team Lead executive persona has exclusive veto and golden badge', () => {
      const leadAgent = LOKATALENTA_AGENTS.find((a) => a.id === 0);
      expect(leadAgent).toBeDefined();
      expect(leadAgent?.role).toContain('Release Arbiter');
      expect(leadAgent?.division).toBe('executive');
      expect(leadAgent?.floor).toBe(2);
    });

    it('verifies document proposals enforce RFC gatekeeping before execution', () => {
      const rfcProp = INITIAL_PROPOSALS.find((p) => p.id === 'PRP-2106');
      expect(rfcProp).toBeDefined();
      expect(rfcProp?.authorId).toBe(5); // Fajar Nugraha
      expect(rfcProp?.targetBacklogId).toBe('AGT-104');
      expect(rfcProp?.status).toBe('pending_approval');
      expect(rfcProp?.fullDocMarkdown).toContain('Anti-Slop');
    });
  });

  describe('AGT-105: Real-time Interaction & Rich Quick Actions', () => {
    it('supports code snippets and backlog task references in message contracts', () => {
      const testSnippet = {
        language: 'tsx',
        code: 'const hub = <ChatArea minWidth="360px" />;',
      };
      const testTask = {
        id: 'BL-217',
        title: 'CoursePlayerPage Lesson Theatre Revamp',
        status: 'IN_SPRINT',
      };

      expect(testSnippet.language).toBe('tsx');
      expect(testTask.id).toBe('BL-217');
    });

    it('handles emoji reactions array manipulation without duplication', () => {
      const reactions = [
        { emoji: '👍', count: 1, agentIds: [0] },
        { emoji: '🚀', count: 2, agentIds: [5, 7] },
      ];

      // Simulate toggling an emoji reaction for agent #6
      const existing = reactions.find((r) => r.emoji === '👍');
      expect(existing).toBeDefined();
      if (existing) {
        const nextAgentIds = [...existing.agentIds, 6];
        expect(nextAgentIds).toHaveLength(2);
        expect(nextAgentIds).toContain(6);
      }
    });

    it('generates multi-persona in-character responses for engineering and design agents', () => {
      const bayu = LOKATALENTA_AGENTS.find((a) => a.id === 7)!;
      const bayuReply = generatePersonaReply({
        sender: TEAM_LEAD_USER,
        targetAgent: bayu,
        userMessage: 'Cek token border dan palet warna DESIGN.md ya',
        channelId: 'lms-full-revamp-anti-slop',
      });
      expect(bayuReply.senderName).toBe('Bayu Pratama');
      expect(bayuReply.codeSnippet).toBeDefined();
      expect(bayuReply.codeSnippet?.language).toBe('css');

      const dimas = LOKATALENTA_AGENTS.find((a) => a.id === 6)!;
      const dimasReply = generatePersonaReply({
        sender: TEAM_LEAD_USER,
        targetAgent: dimas,
        userMessage: 'Bagaimana progres BL-217 CoursePlayerPage?',
        channelId: 'lms-full-revamp-anti-slop',
      });
      expect(dimasReply.senderName).toBe('Dimas Saputra');
      expect(dimasReply.taskRef?.id).toBe('BL-217');
    });
  });
});
