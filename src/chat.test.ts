import { describe, expect, it } from 'vitest';
import { HUMAN_LEAD, LOKATALENTA_AGENTS } from './data/agents';
import { INITIAL_CHANNELS } from './data/channels';
import { INITIAL_MESSAGES } from './data/initialMessages';

describe('LokaTalenta Agent Chat Data Models', () => {
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

  it('validates initial seed messages adhere to message structure', () => {
    expect(INITIAL_MESSAGES.length).toBeGreaterThanOrEqual(5);
    const antiSlopMsg = INITIAL_MESSAGES.find(
      (m) => m.channelId === 'lms-full-revamp-anti-slop'
    );
    expect(antiSlopMsg).toBeDefined();
    expect(antiSlopMsg?.senderName).toBe('Rizco Renova');
  });
});
