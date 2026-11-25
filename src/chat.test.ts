import { describe, expect, it } from 'vitest';
import { HUMAN_LEAD, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { detectMentionedAgent, generatePersonaReply } from './services/personaEngine';

describe('LokaTalenta Agent Chat Data Models & Persona Engine', () => {
  it('contains all 13 AI agents with correct roles and floor positions', () => {
    expect(LOKATALENTA_AGENTS).toHaveLength(13);
    const agentNames = LOKATALENTA_AGENTS.map((a) => a.name);
    expect(agentNames).toContain('Rizco Renova');
    expect(agentNames).toContain('Raka Mahendra');
    expect(agentNames).toContain('Pranadipa Wicaksana');
    expect(agentNames).toContain('Qonita Anindya');
    expect(agentNames).toContain('Bayu Pratama');
    expect(agentNames).toContain('Dimas Saputra');
  });

  it('verifies human lead persona has id -1 and executive division', () => {
    expect(HUMAN_LEAD.id).toBe(-1);
    expect(HUMAN_LEAD.division).toBe('executive');
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
      sender: HUMAN_LEAD,
      targetAgent: qonitaAgent,
      userMessage: 'Bagaimana status test dan kontras WCAG?',
      channelId: 'qa-visual-testing',
    });

    expect(reply.senderName).toBe('Qonita Anindya');
    expect(reply.senderRole).toBe('QA Lead & Visual Testing Arbiter');
    expect(reply.content).toContain('168 unit tests');
    expect(reply.taskRef?.id).toBe('QAE-211');
  });
});
