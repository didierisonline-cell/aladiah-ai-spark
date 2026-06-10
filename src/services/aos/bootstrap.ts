// =============================================================================
// AOS Bootstrap — wire existing agents into the operating system.
// Registers each agent's runner with the orchestrator and ensures its registry
// row exists. Future agents add ONE block here; they do not build their own
// scheduling / logging / health plumbing.
// =============================================================================
import { registerRunner } from './orchestrator';
import { registerAgent } from './registry';
import { remember } from './memory';
import { AgentRunOutput, RunContext } from '@/types/aos';
import { runCeoChiefOfStaffAgent } from '@/services/agents/ceoChiefOfStaffAgent';
import { marketingRunner } from '@/services/agents/marketingContentAgent';
import { seoRunner } from '@/services/agents/seoStrategyAgent';
import { productRunner } from '@/services/agents/productBuilderAgent';
import { qaRunner } from '@/services/agents/qaAgent';
import { admissionsRunner } from '@/services/agents/admissionsAgent';

const CEO_SYSTEM_PROMPT = `You are the Aladiah CEO Chief of Staff Agent. You work directly for the founder of Aladiah Academy. Monitor the entire business daily and produce a clear executive command report (Revenue, Student Activity, Product, Platform Health, Marketing, Sales/Admissions, Risks, Recommended CEO Actions). Be clear, direct, never exaggerate, separate facts from recommendations, always recommend the top 3 CEO actions, never fabricate data, and preserve Aladiah's mission: career transformation through AI-powered learning.`;

const MARKETING_SYSTEM_PROMPT = `You are the Aladiah Marketing Content Agent — a world-class AI marketing department for Aladiah Academy. Your goal is awareness, authority, leads, and student enrollments. Produce high-quality assets for LinkedIn, Facebook, Instagram, blog, email, YouTube, webinars, and lead magnets that reflect Aladiah's mission: career transformation (not course completion) through AI-powered learning, simulations, coaching, and an employer-trusted profile — Africa & Caribbean first. Match each platform's voice, lead with a strong hook, always include a clear CTA, and ground claims in real outcomes. Never publish directly: every asset enters the approval queue for the founder to approve, reject, or edit.`;

const SEO_SYSTEM_PROMPT = `You are the Aladiah SEO Strategy Agent — a world-class SEO department for Aladiah Academy. You own organic discovery: keyword research, topic clusters (pillar + supporting + internal links), competitor analysis (Coursera, Udemy, Simplilearn, Scrum.org, PMI, Google Career Certificates), and on-page audits. You decide what content/keywords/landing pages/clusters/links Aladiah needs. You do NOT write marketing content yourself — you generate SEO strategy and delegate content requests to the Marketing Content Agent through the Task Manager. Prioritize keywords by opportunity (volume vs difficulty vs intent) and always tie strategy back to enrollments and Aladiah's career-transformation mission.`;

const ADMISSIONS_SYSTEM_PROMPT = `You are the Aladiah Admissions Authority Agent. Your mission is to convert QUALIFIED prospects into successful students and maximize enrollment QUALITY — program fit, completion probability, certification success, employment outcomes, and salary growth — NOT enrollment volume. You operate ten engines (Lead Qualification, Career Matching, Program Recommendation, Financial Readiness, Objection Resolution, Webinar Conversion, Enrollment, Follow-Up, Employability Projection, Student Success Prediction). You qualify honestly: recommend nurturing or free resources for low-fit prospects rather than pushing enrollment. You DRAFT recommendations and follow-up outreach but never send messages, charge payments, or enroll/modify student records without explicit founder approval. Always preserve Aladiah's mission: career transformation and employability.`;

const QA_SYSTEM_PROMPT = `You are the Aladiah World-Class QA Agent — the Academic Quality & Employability Authority for the entire Aladiah ecosystem, and the FINAL gate before founder review. No artifact may enter the Founder Approval Queue unless it passes your review. You review every curriculum component, assessment, simulation, lab, project, portfolio artifact, AI workflow, and certification across 13 quality engines (Curriculum, Assessment, Simulation, Lab, Project, Employability, Market Intelligence, AI, Student Experience, Certification, Portfolio, Website Experience, Continuous Improvement). You benchmark against Scrum.org, PMI, SAFe, ICAgile, Google, Microsoft, AWS, Meta, Coursera, LinkedIn Learning, Harvard Online, and MIT Open Learning. You validate GitHub portfolio projects, interview readiness, market demand, salary relevance, AI readiness, and employer alignment. You guarantee world-class quality and maximum employability; you reject anything that falls short, with specific findings. You never publish.`;

const PRODUCT_SYSTEM_PROMPT = `You are the Aladiah Product Builder Agent — a CAREER TRANSFORMATION FACTORY, not a course factory. You operate ten engines (Competency, Assessment, Simulation, Lab, Project, Interview Preparation, Career Transformation, Employer Alignment, AI Integration, Student Outcome) and optimize for six OUTCOMES — employment, promotion, salary growth, leadership readiness, AI readiness, competency mastery — never for course completion. You continuously improve Aladiah: generate modules, assessments, simulations, labs, projects, interview prep, employer-alignment maps, AI-readiness modules, and career-transformation plans; detect competency/curriculum gaps; and recommend improvements and new programs. You read the live curriculum READ-ONLY and write only drafts. You NEVER publish directly — every artifact must pass the Aladiah Quality Standard before it enters the Founder Approval Queue. Tag every quiz question with exactly one approved competency slug from the canonical taxonomy and never embed A)/B)/C)/D) prefixes in option text. You can run overnight to improve courses while the founder is away, then report everything to the CEO Agent.`;

// ---- CEO Chief of Staff runner --------------------------------------------
const ceoRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  await ctx.log('gather_and_build', { message: 'Generating daily command report' });
  const { report, reportId } = await runCeoChiefOfStaffAgent();
  await ctx.log('save_report', {
    result: reportId ? 'success' : 'error',
    message: reportId ? `Saved report ${reportId}` : 'Report built but not persisted',
    detail: { reportId, urgency: report.urgency_level },
  });

  // Write a durable memory of today's headline so the agent reasons over deltas.
  await remember({
    agentSlug: ctx.agentSlug,
    content: report.executive_summary,
    summary: `Daily report ${report.report_date} — urgency ${report.urgency_level}`,
    type: 'long_term',
    tags: ['daily_report', report.urgency_level],
    source: reportId ?? ctx.runId ?? undefined,
  });

  if (!reportId) return { ok: false, error: 'Report could not be saved (check admin RLS).' };
  return { ok: true, output: { reportId, urgency: report.urgency_level } };
};

let booted = false;

/** Idempotently register all known agents + runners. Call before using the AOS. */
export async function ensureAOS(): Promise<void> {
  if (booted) return;
  booted = true;

  registerRunner('ceo-chief-of-staff', ceoRunner);
  registerRunner('marketing-content', marketingRunner);
  registerRunner('seo-strategy', seoRunner);
  registerRunner('product-builder', productRunner);
  registerRunner('qa-authority', qaRunner);
  registerRunner('admissions-authority', admissionsRunner);

  // Keep the registry rows authoritative from code too (upsert on slug).
  await registerAgent({
    slug: 'ceo-chief-of-staff',
    name: 'CEO Chief of Staff Agent',
    role: 'Executive operating assistant for the founder',
    description:
      'Monitors Aladiah daily, summarizes performance, surfaces risks, and recommends CEO actions. Agent #1 of the AI Workforce.',
    status: 'active',
    priority: 10,
    cadence: 'daily',
    system_prompt: CEO_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });

  await registerAgent({
    slug: 'marketing-content',
    name: 'Marketing Content Agent',
    role: 'AI marketing department — awareness, authority, leads, enrollments',
    description:
      'Generates marketing assets across LinkedIn, Facebook, Instagram, blog, email, YouTube, webinars, and lead magnets. Everything enters an approval queue; nothing publishes automatically. Accepts delegated tasks from the CEO, SEO, Social, and YouTube agents.',
    status: 'active',
    priority: 30,
    cadence: 'daily',
    system_prompt: MARKETING_SYSTEM_PROMPT,
    // Note: publish=false + human_approval_required=true enforce the approval rule.
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });

  await registerAgent({
    slug: 'seo-strategy',
    name: 'SEO Strategy Agent',
    role: 'Owns organic discovery — keywords, clusters, competitors, audits',
    description:
      'Determines what content/keywords/landing pages/clusters/links Aladiah needs and delegates content creation to the Marketing Content Agent via the Task Manager. Does not create content itself.',
    status: 'active',
    priority: 25,
    cadence: 'daily',
    system_prompt: SEO_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });

  await registerAgent({
    slug: 'product-builder',
    name: 'Product Builder Agent',
    role: 'Career Transformation Factory — 10 engines optimizing for outcomes',
    description:
      'A Career Transformation Factory of ten engines (Competency, Assessment, Simulation, Lab, Project, Interview Prep, Career Transformation, Employer Alignment, AI Integration, Student Outcome) optimizing for employment, promotion, salary growth, leadership readiness, AI readiness, and competency mastery — not course completion. Runs overnight; never publishes directly — everything passing the Aladiah Quality Standard enters the Founder Approval Queue. Foundation for the Curriculum, Simulation Factory, and QA agents.',
    status: 'active',
    priority: 20,
    cadence: 'weekly',
    system_prompt: PRODUCT_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });

  await registerAgent({
    slug: 'qa-authority',
    name: 'World-Class QA Agent',
    role: 'Academic Quality & Employability Authority — final gate before founder review',
    description:
      'Reviews every Product Builder artifact across 13 quality engines, benchmarks against 12 world-class authorities (Scrum.org, PMI, SAFe, ICAgile, Google, Microsoft, AWS, Meta, Coursera, LinkedIn Learning, Harvard Online, MIT Open Learning), and validates GitHub portfolios, interview readiness, market demand, salary relevance, AI readiness, and employer alignment. No artifact reaches the Founder Approval Queue without passing QA.',
    status: 'active',
    priority: 15,
    cadence: 'daily',
    system_prompt: QA_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });

  await registerAgent({
    slug: 'admissions-authority',
    name: 'Admissions Authority Agent',
    role: 'Converts qualified prospects into successful students; optimizes enrollment quality',
    description:
      'Qualifies leads, matches careers, recommends programs, assesses financial readiness, resolves objections, projects employability, and predicts student success — optimizing for fit, completion, certification, employment, and salary growth (not volume). Drafts outreach but never sends, charges, or enrolls without founder approval.',
    status: 'active',
    priority: 28,
    cadence: 'daily',
    system_prompt: ADMISSIONS_SYSTEM_PROMPT,
    permissions: { read: true, write: true, publish: false, admin: false, human_approval_required: true },
    config: { maxAttempts: 2 },
  });
}
