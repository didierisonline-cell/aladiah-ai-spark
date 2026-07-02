// =============================================================================
// Professor Didier™ v1 — the tutor core under test (WO-0015).
// The guardrails are the product: grounding, quiz integrity, the AVIS-safe
// word-picture fallback, honest encouragement — each is asserted here so a
// prompt regression fails CI, not a student.
// =============================================================================
import { describe, expect, it } from 'vitest';
import {
  MAX_TUTOR_TURNS, TUTOR_MODEL, TutorLessonContext,
  buildQuizCoachPrompt, buildTutorSystemPrompt, clampConversation,
  languageName, starterSuggestions,
} from './professorDidier';
import { validateGenome } from '../aos/genome';
import { genomeExists, getGenome } from '../aos/institutionalRegistry';

const ctx = (over: Partial<TutorLessonContext> = {}): TutorLessonContext => ({
  courseTitle: 'AI-Powered Scrum Master Professional Certification',
  moduleTitle: 'Module 1: Agile & Scrum Foundations (AI-Augmented)',
  lessonTitle: 'What Scrum is (and is not)',
  lessonTranscript: 'WHAT SCRUM IS\nScrum is a lightweight framework for adaptive solutions to complex problems.\nWHAT SCRUM IS NOT\nScrum is not a full project-management methodology.',
  lessonNumber: 1,
  lessonCount: 9,
  nextStep: 'lesson',
  language: 'en',
  ...over,
});

describe('Professor Didier™ — the lesson-aware tutor core (Phase IV step 4)', () => {
  it('is grounded in the CURRENT lesson: full transcript, titles, and module position travel in the system prompt', () => {
    const p = buildTutorSystemPrompt(ctx());
    expect(p).toContain('What Scrum is (and is not)');
    expect(p).toContain('Lesson 1 of 9');
    expect(p).toContain('Scrum is a lightweight framework'); // FULL transcript, not a clipped snippet
    expect(p).toContain('Module 1: Agile & Scrum Foundations');
  });

  it('speaks the student’s language and keeps the protected label in Latin script', () => {
    expect(buildTutorSystemPrompt(ctx({ language: 'fr' }))).toContain('RESPOND IN FRENCH');
    expect(buildTutorSystemPrompt(ctx({ language: 'ig' }))).toContain('RESPOND IN IGBO');
    expect(languageName('nope')).toBe('English'); // unknown code falls back honestly
    expect(buildTutorSystemPrompt(ctx({ language: 'ar' }))).toContain('"Prof. Didier" always stays in Latin script');
  });

  it('quiz integrity is a hard guardrail: never reveal upcoming answers', () => {
    const p = buildTutorSystemPrompt(ctx());
    expect(p).toContain('Never reveal which option is correct');
    expect(p).toMatch(/refuse warmly/);
  });

  it('the AVIS-safe fallback: word-pictures, never a claim to generate images (students never invoke the renderer)', () => {
    const p = buildTutorSystemPrompt(ctx());
    expect(p).toContain('You cannot generate or display images');
    expect(p).toContain('WORD-PICTURE');
    expect(p).toContain('textual twin');
    expect(p).toMatch(/never promise new ones/);
  });

  it('honesty and grounding rules are present; guidance follows the module step list', () => {
    expect(buildTutorSystemPrompt(ctx())).toContain('Never invent facts');
    expect(buildTutorSystemPrompt(ctx({ nextStep: 'quiz' }))).toContain('quiz comes right after this lesson');
    expect(buildTutorSystemPrompt(ctx({ nextStep: 'none' }))).toContain('final step of the module');
    expect(buildTutorSystemPrompt(ctx({ lessonTranscript: '' }))).toContain('No transcript available');
  });

  it('quiz coaching addresses the student’s actual mistake with the quiz UI’s own letter scheme', () => {
    const { system, userMessage } = buildQuizCoachPrompt(ctx(), {
      questionText: 'What is the Scrum Master’s primary value?',
      scenarioContext: 'An executive asks you to justify the role.',
      options: ['Writing code faster', 'Managing budgets', 'Enabling continuous value delivery', 'Detailed project plans'],
      studentAnswerIndex: 1,
      correctAnswerIndex: 2,
      baseExplanation: 'A Scrum Master enables continuous value delivery.',
    });
    expect(userMessage).toContain('B) "Managing budgets"');       // their choice, quiz-letter format
    expect(userMessage).toContain('C) "Enabling continuous value delivery"');
    expect(userMessage).toContain('Canonical explanation: A Scrum Master enables');
    expect(system).toContain('never contradict');                  // curriculum explanation is authoritative
    expect(system).toContain('misconception');
    expect(system).toContain('No scolding');
  });

  it('conversation discipline: clamped to recent turns, always user-first (API contract)', () => {
    const long = Array.from({ length: 30 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `m${i}`,
    }));
    const clamped = clampConversation(long);
    expect(clamped.length).toBeLessThanOrEqual(MAX_TUTOR_TURNS);
    expect(clamped[0].role).toBe('user');
    const assistantFirst = clampConversation([{ role: 'assistant', content: 'orphan' }, { role: 'user', content: 'q' }], 2);
    expect(assistantFirst[0].role).toBe('user');
  });

  it('starter suggestions localize with an honest English fallback', () => {
    expect(starterSuggestions(ctx({ language: 'es' }))[0]).toContain('Explícame');
    expect(starterSuggestions(ctx({ language: 'sw' }))[0]).toContain('Explain'); // fallback until localized
    expect(starterSuggestions(ctx()).length).toBeGreaterThanOrEqual(3);
  });

  it('the model is the ai-proxy allowlisted default — a drift here silently kills the tutor', () => {
    expect(TUTOR_MODEL).toBe('claude-sonnet-4-6');
  });

  it('Professor Didier is a governed capability: genome accessioned and V1–V12-valid', () => {
    const g = getGenome('service:professor-didier');
    expect(g).toBeTruthy();
    expect(validateGenome(g!, genomeExists), g!.id).toEqual([]);
    expect(g!.founderDirectives.join(' ')).toContain('FEO-2026-001');
    expect(g!.purpose).toContain('word-picture');
  });
});
