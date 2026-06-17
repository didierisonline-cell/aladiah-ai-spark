// =============================================================================
// Chief Growth Officer Agent — sub-agent engines (deterministic v1)
// Pure functions: (inputs) -> GrowthAsset(s). No I/O, no AOS.
// Phase 2 swaps these for Claude calls (server-side edge function) behind the
// same GrowthAsset contract.
// =============================================================================

export type GrowthAudience =
  | 'career_changers'
  | 'working_professionals'
  | 'africa_cameroon'
  | 'dominican_republic'
  | 'employers';

export type FlywheelStage =
  | 'attention'
  | 'trust'
  | 'community'
  | 'transformation'
  | 'employment'
  | 'success_stories'
  | 'authority';

export type RiskTier = 'low' | 'medium' | 'high';

export type GrowthChannel =
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'youtube_shorts'
  | 'youtube_longform'
  | 'email'
  | 'community'
  | 'lead_magnet'
  | 'webinar'
  | 'seo_blog';

export interface GrowthAsset {
  sub_agent: string;
  channel: GrowthChannel;
  content_type: string;
  audience: GrowthAudience;
  flywheel_stage: FlywheelStage;
  risk_tier: RiskTier;
  title: string;
  hook: string;
  body: string;
  cta: string;
  proof_source: string;
  kpi_target: string;
  score: number;
  excellence: ContentExcellenceScore;
  hashtags: string[];
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Content Excellence Framework — 5-gate scoring
// ---------------------------------------------------------------------------

export interface KaneScore {
  curiosity: number;       // 0-20: does it make you need to know more?
  contrarian: number;      // 0-20: does it challenge a belief?
  emotion: number;         // 0-20: fear, aspiration, identity, urgency, or relief?
  novelty: number;         // 0-20: is it unexpected or fresh?
  shareability: number;    // 0-20: would someone forward this?
  total: number;           // 0-100
}

export interface HormoziScore {
  dream_outcome: number;   // 0-25: how desirable is the promised result?
  likelihood: number;      // 0-25: does it make success feel achievable?
  speed: number;           // 0-25: does it reduce time to result?
  simplicity: number;      // 0-25: does it reduce perceived effort?
  total: number;           // 0-100 (Value Equation: DO×L / T×E)
}

export interface TrustScore {
  has_real_numbers: number;    // 0-20
  has_specific_example: number; // 0-20
  has_employer_signal: number;  // 0-20
  has_salary_signal: number;    // 0-20
  has_proof_artifact: number;   // 0-20
  total: number;               // 0-100
}

export interface TransformationScore {
  teaches_one_thing: number;   // 0-34: is there a clear learnable insight?
  creates_before_after: number; // 0-33: does the viewer understand differently after?
  drives_next_action: number;  // 0-33: does it make them want to do something now?
  total: number;               // 0-100
}

export interface EmploymentScore {
  job_relevance: number;       // 0-34: tied to a real job title or role?
  interview_relevance: number; // 0-33: would this come up in an interview?
  salary_relevance: number;    // 0-33: does it connect to compensation or career growth?
  total: number;               // 0-100
}

// V2 gates — Growth OS V2 (identity-first, relationship-first)

export interface GoldenRuleScore {
  standalone_value: number;  // 0-100: value without any brand mention?
  total: number;
}

export interface TannerScore {
  identity_language: number;   // 0-25: "become" / "transform into" / "who you are"
  aspiration_clarity: number;  // 0-25: does it paint a vivid identity destination?
  before_after: number;        // 0-25: old identity → new identity
  audience_sees_self: number;  // 0-25: will the reader see themselves in this?
  total: number;
}

export interface EmotionalTriggerScore {
  trigger: string;   // which primary trigger fires
  intensity: number; // 0-100 how strongly it fires
  total: number;
}

export interface RelationshipScore {
  relationship_first: boolean;  // gives before it asks?
  content_type_tag: 'relationship' | 'transformation' | 'promotion';
  penalty: number;              // 0 = fine | >0 = ratio imbalance detected
  total: number;                // 100 = pure relationship | 0 = pure promotion
}

// V3 gates — proof, employer demand, regional opportunity

export interface ProofScore {
  has_portfolio_example: number;  // 0-25: references a portfolio or showcase?
  has_simulation: number;         // 0-25: mentions practice/simulation/scenario?
  has_real_project: number;       // 0-25: tied to a real-world project or case?
  has_student_evidence: number;   // 0-25: student result, testimonial, or outcome?
  total: number;                  // 0-100
}

export interface EmployerDemandScore {
  maps_to_hiring_demand: number;  // 0-34: tied to a role employers are actively hiring?
  signals_ai_readiness: number;   // 0-33: shows AI capability an employer cares about?
  workforce_relevance: number;    // 0-33: relevant to current workforce needs (2025–2027)?
  total: number;                  // 0-100
}

export interface AfricaOpportunityScore {
  africa_relevance: number;       // 0-34: speaks to Africa / Cameroon context?
  dr_relevance: number;           // 0-33: speaks to Dominican Republic context?
  economic_transformation: number; // 0-33: frames career change as economic mobility?
  total: number;                  // 0-100
}

export interface ContentExcellenceScore {
  kane: KaneScore;
  hormozi: HormoziScore;
  trust: TrustScore;
  transformation: TransformationScore;
  employment: EmploymentScore;
  golden_rule: GoldenRuleScore;
  tanner: TannerScore;
  emotional_trigger: EmotionalTriggerScore;
  relationship: RelationshipScore;
  proof: ProofScore;
  employer_demand: EmployerDemandScore;
  africa_opportunity: AfricaOpportunityScore;
  final: number;   // weighted composite 0-100
  gate: 'publish' | 'revise' | 'reject';  // 90+ publish | <90 revise/reject
  mandatory_check: {  // all five must pass for publish
    attention: boolean;
    trust: boolean;
    transformation: boolean;
    proof: boolean;
    employment: boolean;
    all_pass: boolean;
  };
}

export interface ScoredHook {
  hook: string;
  bucket: string;
  kane_score: number;
  emotion_trigger: string;
  shareability: number;
  controversy: number;
  rank: number;
}

export interface HookBankEntry {
  hook: string;
  bucket: string;
  audience: GrowthAudience;
  channel: GrowthChannel;
  emotional_trigger: string;
  shareability: number;
  controversy: number;
  trust: number;
}

export interface LaunchDayAssets {
  date: string;
  relative_day: string;
  linkedin_post: GrowthAsset;
  instagram_caption: GrowthAsset;
  reel_script: GrowthAsset;
  tiktok_script: GrowthAsset;
  email: GrowthAsset;
  community_post: GrowthAsset;
  visual_direction: string;
  founder_talking_points: string[];
}

export interface DailyGrowthBrief {
  date: string;
  launch_day_relative: string;
  overall_status: 'green' | 'yellow' | 'red';
  created_count: number;
  flywheel_coverage: Record<FlywheelStage, number>;
  platform_coverage: Record<GrowthChannel, number>;
  top_priorities: string[];
  approval_queue: string[];
  risks: string[];
  recommendation: string;
}

const SITE = 'https://aladiah.academy';
const TAGLINE = 'The place where ordinary people become extraordinary professionals in the age of AI';
const LAUNCH_DATE = 'June 19, 2026';

// V2 content pillars (Growth OS V2)
const CONTENT_PILLARS = [
  'future_of_work',
  'personal_transformation',
  'professional_excellence',
  'human_stories',
  'opportunity_discovery',
] as const;
type ContentPillar = typeof CONTENT_PILLARS[number];

// V2 emotional triggers — every post must activate at least one
const EMOTIONAL_TRIGGERS = ['hope', 'ambition', 'pride', 'curiosity', 'belonging', 'possibility', 'security', 'purpose'] as const;
type EmotionalTrigger = typeof EMOTIONAL_TRIGGERS[number];

// ---------------------------------------------------------------------------
// Hook bucket generators
// ---------------------------------------------------------------------------

// V2 hook buckets — identity-transformation first, relationship-first
// Golden Rule test applied: every hook provides value without brand
const HOOK_BUCKETS: Record<string, string[]> = {
  contrarian_belief: [
    'Most people do not have a learning problem. They have a becoming problem.',
    'A certificate tells people what you studied. A proof artifact shows who you became.',
    'The future does not reward people who consumed content. It rewards people who became something.',
    'You do not need more courses. You need to become the person those courses promised.',
    'The career gap is not about what you know. It is about who you have not yet become.',
  ],
  costly_mistake: [
    'The most expensive career mistake is investing in knowledge without transforming your identity.',
    'Most people spend years learning the right things but never become the right person for the role.',
    'Studying Scrum is easy. Becoming someone who leads transformations with it — that takes a system.',
    'You can earn every certificate and still not become an AI-ready professional. Here is why.',
    'The gap is not talent. It is the absence of a system that transforms who you are, not just what you know.',
  ],
  surprising_proof: [
    'There is a measurable difference between someone who studies AI and someone who becomes AI-ready.',
    'Ordinary people become extraordinary professionals when they practice in real enterprise scenarios first.',
    'One score can show recruiters who you are becoming — before you have the title.',
    'Every module ends with a proof artifact: not proof you studied, but proof of who you became.',
    '"Work-ready" is not a feeling. It is a transformation you can measure.',
  ],
  identity_aspiration: [
    'You are not too late. You are becoming the AI-ready professional the economy is waiting for.',
    'The AI economy does not need more learners. It needs leaders who became ready.',
    'From ordinary background to extraordinary professional in the age of AI — this is the path.',
    'Your background is not a limitation. It is the origin story of who you are becoming.',
    "Africa's next generation of extraordinary professionals is training right now.",
  ],
  identity_threat: [
    'AI is not replacing workers. It is replacing the version of you that never became AI-ready.',
    'The professionals who thrive in 2026 became AI-ready before most people started thinking about it.',
    'There are two types of professionals in 2026: those who became the future of work, and those who watched it happen.',
    'The person you are today is not the person the AI economy is hiring. Become them first.',
    'Outdated skills are not who you are. They are who you have not yet decided to stop being.',
  ],
  speed_to_outcome: [
    'In one session, you move from confused professional to someone with a clear transformation path.',
    'Start today. Become measurably closer to the professional you want to be by this week.',
    'In under an hour, you will know exactly who you need to become — and how to get there.',
    'One assessment. One score. One transformation path. Start becoming.',
    'The fastest way to become AI-ready is to start being assessed like someone who already is.',
  ],
  myth_busting: [
    'Myth: you need a CS degree to become an AI-powered professional. Truth: you need to become one.',
    'Myth: certifications transform careers. Truth: only becoming the right person transforms a career.',
    'Myth: AI makes training irrelevant. Truth: AI makes the right transformation system possible.',
    'Myth: career transformation takes years. Truth: it takes the decision to become someone different.',
    'Myth: Africa is behind in the AI economy. Truth: African professionals who become AI-ready lead globally.',
  ],
  behind_the_build: [
    'Building a school that transforms ordinary people into extraordinary professionals — what I learned.',
    'We did not build another course platform. We built a system for becoming.',
    'Why we built identity transformation before we built more content.',
    'The real reason this school exists: becoming an AI-ready professional is not the same as taking AI courses.',
    'This is what a career transformation system looks like from the inside — not a course, a becoming.',
  ],
  transformation_story: [
    'From ordinary to extraordinary: what the transformation path actually looks like from inside.',
    'What changes is not just what you know — it is who you become capable of being.',
    'The moment someone stops being a learner and starts becoming a professional.',
    'A career transformation is not a single moment. It is a series of becoming something more.',
    'Become. Practice. Validate. Interview. Get hired. Lead. Build. Begin.',
  ],
};

export function buildHookBank(count = 100): HookBankEntry[] {
  const channels: GrowthChannel[] = ['linkedin', 'instagram', 'tiktok', 'youtube_shorts'];
  const audiences: GrowthAudience[] = [
    'career_changers',
    'working_professionals',
    'africa_cameroon',
    'dominican_republic',
    'employers',
  ];
  const out: HookBankEntry[] = [];
  const bucketKeys = Object.keys(HOOK_BUCKETS);

  let idx = 0;
  for (const [bucket, hooks] of Object.entries(HOOK_BUCKETS)) {
    for (const hook of hooks) {
      out.push({
        hook,
        bucket,
        audience: audiences[idx % audiences.length],
        channel: channels[idx % channels.length],
        emotional_trigger: bucketToTrigger(bucket),
        shareability: scoreShareability(bucket),
        controversy: scoreControversy(bucket),
        trust: scoreTrust(bucket),
      });
      idx++;
      if (out.length >= count) break;
    }
    if (out.length >= count) break;
  }

  // Fill remainder with permutations if still below count
  while (out.length < count) {
    const bKey = bucketKeys[out.length % bucketKeys.length];
    const hooks = HOOK_BUCKETS[bKey];
    const hook = hooks[out.length % hooks.length];
    out.push({
      hook: `${hook} [v${Math.floor(out.length / hooks.length) + 2}]`,
      bucket: bKey,
      audience: audiences[out.length % audiences.length],
      channel: channels[out.length % channels.length],
      emotional_trigger: bucketToTrigger(bKey),
      shareability: scoreShareability(bKey),
      controversy: scoreControversy(bKey),
      trust: scoreTrust(bKey),
    });
  }

  return out.slice(0, count);
}

function bucketToTrigger(bucket: string): string {
  const map: Record<string, string> = {
    contrarian_belief: 'curiosity',
    costly_mistake: 'security',
    surprising_proof: 'ambition',
    identity_aspiration: 'hope',
    identity_threat: 'purpose',
    speed_to_outcome: 'possibility',
    myth_busting: 'curiosity',
    behind_the_build: 'belonging',
    transformation_story: 'pride',
  };
  return map[bucket] ?? 'curiosity';
}

function scoreShareability(bucket: string): number {
  const scores: Record<string, number> = {
    contrarian_belief: 9,
    costly_mistake: 8,
    surprising_proof: 8,
    identity_aspiration: 7,
    identity_threat: 7,
    speed_to_outcome: 6,
    myth_busting: 9,
    behind_the_build: 7,
    transformation_story: 8,
  };
  return scores[bucket] ?? 7;
}

function scoreControversy(bucket: string): number {
  const scores: Record<string, number> = {
    contrarian_belief: 7,
    costly_mistake: 5,
    surprising_proof: 4,
    identity_aspiration: 3,
    identity_threat: 6,
    speed_to_outcome: 3,
    myth_busting: 8,
    behind_the_build: 4,
    transformation_story: 3,
  };
  return scores[bucket] ?? 4;
}

function scoreTrust(bucket: string): number {
  const scores: Record<string, number> = {
    contrarian_belief: 7,
    costly_mistake: 7,
    surprising_proof: 9,
    identity_aspiration: 6,
    identity_threat: 6,
    speed_to_outcome: 7,
    myth_busting: 8,
    behind_the_build: 9,
    transformation_story: 8,
  };
  return scores[bucket] ?? 7;
}

// ---------------------------------------------------------------------------
// Content Excellence Engine — 5-gate scoring system
// Gate 1: Kane (Attention)   — 90+ publish | 80-89 revise | <80 reject
// Gate 2: Hormozi (Value)
// Gate 3: Trust
// Gate 4: Transformation
// Gate 5: Employment
// ---------------------------------------------------------------------------

// Gate 1 — Brendan Kane: Will someone stop scrolling?
function scoreKane(hook: string, bucket: string, body: string): KaneScore {
  // Curiosity: open loops, incomplete information, pattern interrupts
  const curiositySignals = [
    /\?/.test(hook),
    /mistake|error|wrong|fail|never|always|nobody|everyone/.test(hook.toLowerCase()),
    /here.s why|here.s what|this is why/.test(hook.toLowerCase()),
    hook.length > 50 && hook.length < 120,
    /\.\.\./.test(hook),
  ];
  const curiosity = Math.round((curiositySignals.filter(Boolean).length / curiositySignals.length) * 20);

  // Contrarian: challenges conventional wisdom
  const contrarianSignals = [
    /myth:|wrong:|not|never|stop|quit|forget/.test(hook.toLowerCase()),
    /most people|everyone thinks|they told you/.test(hook.toLowerCase()),
    bucket === 'contrarian_belief' || bucket === 'myth_busting',
    /but actually|truth is|reality is/.test(hook.toLowerCase()),
    /obsolete|wrong|lie|mistake/.test(hook.toLowerCase()),
  ];
  const contrarian = Math.round((contrarianSignals.filter(Boolean).length / contrarianSignals.length) * 20);

  // Emotion: fear, aspiration, identity, urgency, or relief
  const emotionSignals = [
    /replace|obsolete|behind|miss|lose|fail|afraid/.test(hook.toLowerCase()),
    /transform|career|hired|ready|leader|global/.test(hook.toLowerCase()),
    /you|your|we|our/.test(hook.toLowerCase()),
    /now|today|this week|2026|2028/.test(hook.toLowerCase()),
    /don.t|can.t|won.t|shouldn.t/.test(hook.toLowerCase()),
  ];
  const emotion = Math.round((emotionSignals.filter(Boolean).length / emotionSignals.length) * 20);

  // Novelty: unexpected angle, specific data, fresh framing
  const noveltySignals = [
    /\d+%|\d+ hours|\d+ minutes|\$\d+/.test(hook),
    bucket === 'surprising_proof' || bucket === 'behind_the_build',
    /tested|discovered|found|learned|built/.test(hook.toLowerCase()),
    /ai scrum|talent score|aladiah/.test(hook.toLowerCase()),
    hook.split(' ').length <= 12,  // short punchy = novel
  ];
  const novelty = Math.round((noveltySignals.filter(Boolean).length / noveltySignals.length) * 20);

  // Shareability: would someone forward this to a colleague?
  const baseShareability = scoreShareability(bucket);
  const shareability = Math.round((baseShareability / 10) * 20);

  const total = Math.min(100, curiosity + contrarian + emotion + novelty + shareability);
  return { curiosity, contrarian, emotion, novelty, shareability, total };
}

// Gate 2 — Alex Hormozi: Value = (Dream Outcome × Likelihood) ÷ (Time × Effort)
function scoreHormozi(hook: string, body: string, cta: string): HormoziScore {
  // Dream Outcome: how desirable is the promised result?
  const dreamOutcomeSignals = [
    /hired|job|career|salary|interview|employed/.test(body.toLowerCase()),
    /transform|promotion|leadership|global/.test(body.toLowerCase()),
    /scrum master|project manager|business analyst|cybersecurity|cloud|ai/.test(body.toLowerCase()),
    /result|outcome|achieve|become/.test(body.toLowerCase()),
    body.length > 150,
  ];
  const dream_outcome = Math.round((dreamOutcomeSignals.filter(Boolean).length / dreamOutcomeSignals.length) * 25);

  // Likelihood of Success: proof, credentials, system
  const likelihoodSignals = [
    /proof|score|verified|certified|validated/.test(body.toLowerCase()),
    /talent score|simulation|artifact|portfolio/.test(body.toLowerCase()),
    /aladiah|system|path|framework|step/.test(body.toLowerCase()),
    /example|case|result|student|learner/.test(body.toLowerCase()),
    /free|start|begin|try/.test(cta.toLowerCase()),
  ];
  const likelihood = Math.round((likelihoodSignals.filter(Boolean).length / likelihoodSignals.length) * 25);

  // Speed to Result: fast, today, minutes, this week
  const speedSignals = [
    /minutes|hours|days|week|today|now|immediately/.test(body.toLowerCase()),
    /fast|quick|rapid|instant|start/.test(body.toLowerCase()),
    /first step|next step|one thing/.test(body.toLowerCase()),
    /clear|simple|direct|straight/.test(body.toLowerCase()),
    /in \d+|within \d+/.test(body.toLowerCase()),
  ];
  const speed = Math.round((speedSignals.filter(Boolean).length / speedSignals.length) * 25);

  // Simplicity / Effort Reduction: easy, manageable, one step
  const simplicitySignals = [
    /one|single|simple|clear|just/.test(body.toLowerCase()),
    /don.t need|no degree|no experience/.test(body.toLowerCase()),
    /step \d|step by step|three things|three steps/.test(body.toLowerCase()),
    /without|instead of|rather than/.test(body.toLowerCase()),
    cta.length < 60,
  ];
  const simplicity = Math.round((simplicitySignals.filter(Boolean).length / simplicitySignals.length) * 25);

  const total = Math.min(100, dream_outcome + likelihood + speed + simplicity);
  return { dream_outcome, likelihood, speed, simplicity, total };
}

// Gate 3 — Trust: Real numbers, real examples, employer demand, salary signal
function scoreTrustGate(hook: string, body: string, proof_source: string): TrustScore {
  // Real numbers
  const has_real_numbers = /\d+%|\d+ hours|\d+ minutes|\$\d+|\d+ months|\d+x|612|0/.test(body) ? 20 : 0;

  // Specific example or scenario
  const has_specific_example = (
    /example|scenario|case|specifically|such as|for instance/.test(body.toLowerCase()) ||
    /sprint|backlog|stakeholder|client|project/.test(body.toLowerCase())
  ) ? 20 : 0;

  // Employer signal: what employers see, want, or accept
  const has_employer_signal = /employer|recruit|interview|hire|company|job post|demand/.test(body.toLowerCase()) ? 20 : 0;

  // Salary signal: compensation, income, salary growth
  const has_salary_signal = /salary|\$|income|pay|compens|earn|raise|promotion/.test(body.toLowerCase()) ? 20 : 0;

  // Proof artifact: Talent Score, simulation, portfolio, certification
  const has_proof_artifact = (
    /talent score|simulation|portfolio|certification|artifact|proof/.test(body.toLowerCase()) ||
    proof_source.length > 15
  ) ? 20 : 0;

  const total = Math.min(100, has_real_numbers + has_specific_example + has_employer_signal + has_salary_signal + has_proof_artifact);
  return { has_real_numbers, has_specific_example, has_employer_signal, has_salary_signal, has_proof_artifact, total };
}

// Gate 4 — Transformation: Does the viewer understand differently after?
function scoreTransformation(hook: string, body: string, flywheel_stage: FlywheelStage): TransformationScore {
  // Teaches one clear thing
  const teaches_one_thing = (
    body.includes('1.') || body.includes('•') || body.includes(':') ||
    /difference between|instead of|the truth is|what it actually/.test(body.toLowerCase()) ||
    flywheel_stage === 'trust' || flywheel_stage === 'authority'
  ) ? 34 : 12;

  // Creates before/after contrast
  const creates_before_after = (
    /from .+ to|before .+ after|used to .+ now|instead of .+ you/.test(body.toLowerCase()) ||
    /confused|unclear|lost/.test(body.toLowerCase()) ||
    flywheel_stage === 'transformation'
  ) ? 33 : 10;

  // Drives next action
  const drives_next_action = (
    /follow|start|take|join|try|apply|learn|discover|see/.test(body.toLowerCase().slice(-200)) ||
    flywheel_stage === 'employment' || flywheel_stage === 'community'
  ) ? 33 : 10;

  const total = Math.min(100, teaches_one_thing + creates_before_after + drives_next_action);
  return { teaches_one_thing, creates_before_after, drives_next_action, total };
}

// Gate 5 — Employment: The Aladiah layer nobody else has
function scoreEmployment(hook: string, body: string, audience: GrowthAudience): EmploymentScore {
  // Job relevance: tied to a real role
  const jobTitles = /scrum master|project manager|business analyst|product owner|devops|cybersecurity|cloud|data analyst|agile coach/;
  const job_relevance = (
    jobTitles.test(body.toLowerCase()) ||
    /role|position|career|job title|professional/.test(body.toLowerCase()) ||
    audience === 'employers'
  ) ? 34 : 10;

  // Interview relevance: would this come up in a real interview?
  const interview_relevance = (
    /interview|question|answer|hiring|recruiter|resume|cv/.test(body.toLowerCase()) ||
    /demonstrate|show|prove|evidence|capability/.test(body.toLowerCase())
  ) ? 33 : 10;

  // Salary relevance: connects to compensation or career growth
  const salary_relevance = (
    /salary|earn|income|\$|compens|raise|level up|senior|lead/.test(body.toLowerCase()) ||
    audience === 'working_professionals' || audience === 'employers'
  ) ? 33 : 10;

  const total = Math.min(100, job_relevance + interview_relevance + salary_relevance);
  return { job_relevance, interview_relevance, salary_relevance, total };
}

// Gate 6 — Golden Rule: remove all brand mentions — still valuable?
function scoreGoldenRule(hook: string, body: string): GoldenRuleScore {
  // Strip brand words and test if the insight still stands alone
  const brandWords = /aladiah|talent score/gi;
  const strippedHook = hook.replace(brandWords, '').trim();
  const strippedBody = body.replace(brandWords, '').trim();

  // Insight signals that hold without brand
  const insightSignals = [
    strippedHook.length > 20,
    /\?|:/.test(strippedHook),
    strippedBody.length > 80,
    /because|therefore|that means|this means|here is why|the reason/.test(strippedBody.toLowerCase()),
    /you|your|people|professionals|workers/.test(strippedBody.toLowerCase()),
    /tip|how|why|what|when|discover|learn|know/.test(strippedBody.toLowerCase()),
  ];
  const standalone_value = Math.round((insightSignals.filter(Boolean).length / insightSignals.length) * 100);
  return { standalone_value, total: standalone_value };
}

// Gate 7 — Tanner Chidester: who does the audience BECOME?
function scoreTanner(hook: string, body: string): TannerScore {
  const text = (hook + ' ' + body).toLowerCase();

  // Identity language: "become", "transform into", "who you are", "the kind of person"
  const identityWords = /become|becoming|transform into|who you are|the person|your identity|type of person|kind of professional/;
  const identity_language = identityWords.test(text) ? 25 : 0;

  // Aspiration clarity: a vivid identity destination
  const aspirationPhrases = /ai-ready professional|extraordinary professional|the leader|certified|career-ready|the expert|the one who/;
  const aspiration_clarity = aspirationPhrases.test(text) ? 25 : (
    /professional|leader|expert|ready|capable/.test(text) ? 15 : 5
  );

  // Before/after identity contrast
  const beforeAfterPatterns = /from .+ to|used to .+ now|before .+ after|stop being .+ start being|ordinary .+ extraordinary/;
  const before_after = beforeAfterPatterns.test(text) ? 25 : 0;

  // Audience sees themselves in the narrative
  const selfPatterns = /you are|your path|your story|people like you|just like you|someone who|if you have/;
  const audience_sees_self = selfPatterns.test(text) ? 25 : (
    /you|your/.test(text) ? 15 : 0
  );

  const total = Math.min(100, identity_language + aspiration_clarity + before_after + audience_sees_self);
  return { identity_language, aspiration_clarity, before_after, audience_sees_self, total };
}

// Gate 8 — Emotional Trigger: must activate at least one of the 8 triggers
function scoreEmotionalTrigger(hook: string, body: string, bucket: string): EmotionalTriggerScore {
  const text = (hook + ' ' + body).toLowerCase();
  const triggerMap: Record<string, string[]> = {
    hope:        ['you can', 'possible', 'you are not too late', 'start', 'early', 'path', 'way forward'],
    ambition:    ['become', 'extraordinary', 'leader', 'global', 'top', 'achieve', 'level up'],
    pride:       ['proof', 'validated', 'certified', 'recognized', 'earned', 'built', 'accomplished'],
    curiosity:   ['why', 'how', 'what if', 'surprising', 'myth', 'truth is', 'here is what'],
    belonging:   ['we', 'community', 'together', 'you are not alone', 'join', 'our learners', 'people like you'],
    possibility: ['in weeks', 'this week', 'right now', 'faster', 'possible', 'start today', 'one session'],
    security:    ['job security', 'stable', 'future-proof', 'protected', 'ready', 'prepared', 'demand'],
    purpose:     ['mission', 'impact', 'why', 'matters', 'change', 'generation', 'legacy', 'build'],
  };

  const bucketTrigger = bucketToTrigger(bucket);
  let bestTrigger = bucketTrigger;
  let bestCount = 0;

  for (const [trigger, words] of Object.entries(triggerMap)) {
    const count = words.filter(w => text.includes(w)).length;
    if (count > bestCount) {
      bestCount = count;
      bestTrigger = trigger;
    }
  }

  const intensity = Math.min(100, bestCount * 20 + (bestTrigger === bucketTrigger ? 20 : 0));
  return { trigger: bestTrigger, intensity, total: intensity };
}

// Gate 9 — Relationship Score: 70% relationship / 20% transformation / 10% promotion
function scoreRelationship(hook: string, body: string, cta: string, flywheel_stage: FlywheelStage): RelationshipScore {
  const text = (hook + ' ' + body).toLowerCase();
  const ctaLower = cta.toLowerCase();

  // Promotion signals (deduct)
  const promotionSignals = [
    /sign up|buy now|enroll now|get started free|limited time|only \$|discount|offer/.test(ctaLower),
    /price|cost|sale|promotion|deal|offer/.test(text),
  ];
  const isPromotion = promotionSignals.filter(Boolean).length >= 2;

  // Transformation signals (middle tier)
  const transformationSignals = [
    /case study|result|outcome|transformation|before.+after/.test(text),
    flywheel_stage === 'transformation' || flywheel_stage === 'success_stories',
  ];
  const isTransformation = transformationSignals.filter(Boolean).length >= 1;

  // Relationship-first signals (give before ask)
  const relationshipSignals = [
    /here is why|here is how|the truth|the reason|insight|tip|lesson|you should know/.test(text),
    /you|your/.test(text),
    !isPromotion,
    body.length > 100,
    /\?/.test(hook),
  ];
  const relationshipCount = relationshipSignals.filter(Boolean).length;

  const content_type_tag: RelationshipScore['content_type_tag'] = isPromotion
    ? 'promotion'
    : isTransformation
    ? 'transformation'
    : 'relationship';

  const relationship_first = content_type_tag !== 'promotion';
  const penalty = isPromotion ? 30 : 0;
  const total = Math.max(0, Math.min(100,
    content_type_tag === 'relationship' ? 70 + (relationshipCount * 6) :
    content_type_tag === 'transformation' ? 50 :
    20
  ) - penalty);

  return { relationship_first, content_type_tag, penalty, total };
}

// Gate 10 — Proof: portfolio, simulation, real project, student evidence
function scoreProof(body: string, proof_source: string): ProofScore {
  const text = body.toLowerCase();
  const proof = proof_source.toLowerCase();

  const has_portfolio_example = /portfolio|showcase|gallery|artifacts|examples of my work|real work/.test(text) ? 25 : 0;
  const has_simulation = /simulat|scenario|practice|enterprise scenario|real-world exercise|hands-on/.test(text) ? 25 : 0;
  const has_real_project = /project|client|stakeholder|sprint|backlog|delivered|built|launched/.test(text) ? 25 :
    (proof.length > 10 ? 12 : 0);
  const has_student_evidence = /student|learner|participant|graduate|alumni|testimonial|result|hired after|placed/.test(text) ? 25 : 0;

  const total = Math.min(100, has_portfolio_example + has_simulation + has_real_project + has_student_evidence);
  return { has_portfolio_example, has_simulation, has_real_project, has_student_evidence, total };
}

// Gate 11 — Employer Demand: hiring signals, AI readiness, workforce relevance
function scoreEmployerDemand(body: string, audience: GrowthAudience): EmployerDemandScore {
  const text = body.toLowerCase();

  const hiringRoles = /scrum master|product owner|business analyst|devops|cloud engineer|data analyst|agile coach|project manager|cybersecurity|ai specialist/;
  const maps_to_hiring_demand = (
    hiringRoles.test(text) ||
    /hiring|job opening|in demand|talent shortage|recruiters want|employers need/.test(text) ||
    audience === 'employers'
  ) ? 34 : 10;

  const signals_ai_readiness = (
    /ai-ready|ai ready|ai-powered|machine learning|generative ai|chatgpt|llm|automation|ai tools|ai workflow/.test(text) ||
    /future-proof|future proof|next-generation workforce|workforce of the future/.test(text)
  ) ? 33 : 10;

  const workforce_relevance = (
    /2025|2026|2027|today's market|current demand|workforce gap|skills gap|labour market|job market/.test(text) ||
    /enterprise|organization|company needs|corporate|global workforce/.test(text)
  ) ? 33 : 10;

  const total = Math.min(100, maps_to_hiring_demand + signals_ai_readiness + workforce_relevance);
  return { maps_to_hiring_demand, signals_ai_readiness, workforce_relevance, total };
}

// Gate 12 — Africa & DR Opportunity: regional relevance and economic transformation framing
function scoreAfricaOpportunity(body: string, hook: string, audience: GrowthAudience): AfricaOpportunityScore {
  const text = (hook + ' ' + body).toLowerCase();

  const africa_relevance = (
    /africa|cameroon|nairobi|lagos|accra|abidjan|kigali|african professional|sub-saharan|francophone africa/.test(text) ||
    audience === 'africa_cameroon'
  ) ? 34 : (
    /global south|emerging market|developing econom/.test(text) ? 17 : 0
  );

  const dr_relevance = (
    /dominican republic|santo domingo|caribbean|latin america|latinx|hispanic professional/.test(text) ||
    audience === 'dominican_republic'
  ) ? 33 : (
    /spanish-speaking|bilingual|diaspora/.test(text) ? 16 : 0
  );

  const economic_transformation = (
    /economic mobility|economic transformation|break the cycle|generational change|first in family|social mobility/.test(text) ||
    /opportunity|access|bridge the gap|unlock|pathway out/.test(text)
  ) ? 33 : 10;

  const total = Math.min(100, africa_relevance + dr_relevance + economic_transformation);
  return { africa_relevance, dr_relevance, economic_transformation, total };
}

// ---------------------------------------------------------------------------
// Composite gate — V3: 12 gates, mandatory 5-pillar presence check
// Weights: Kane 15% | Hormozi 15% | Trust 12% | Transformation 12% | Employment 10%
//          Proof 10% | GoldenRule 8% | Tanner 5% | EmotionalTrigger 5%
//          EmployerDemand 5% | AfricaOpportunity 3%
// Threshold: 90+ publish | <90 revise/reject
// Hard gate: Attention + Trust + Transformation + Proof + Employment ALL must score ≥ 50
// ---------------------------------------------------------------------------
export function runExcellenceGates(asset: Omit<GrowthAsset, 'score' | 'excellence'>): ContentExcellenceScore {
  const bucket = asset.metadata?.bucket as string ?? '';
  const kane = scoreKane(asset.hook, bucket, asset.body);
  const hormozi = scoreHormozi(asset.hook, asset.body, asset.cta);
  const trust = scoreTrustGate(asset.hook, asset.body, asset.proof_source);
  const transformation = scoreTransformation(asset.hook, asset.body, asset.flywheel_stage);
  const employment = scoreEmployment(asset.hook, asset.body, asset.audience);
  const golden_rule = scoreGoldenRule(asset.hook, asset.body);
  const tanner = scoreTanner(asset.hook, asset.body);
  const emotional_trigger = scoreEmotionalTrigger(asset.hook, asset.body, bucket);
  const relationship = scoreRelationship(asset.hook, asset.body, asset.cta, asset.flywheel_stage);
  const proof = scoreProof(asset.body, asset.proof_source);
  const employer_demand = scoreEmployerDemand(asset.body, asset.audience);
  const africa_opportunity = scoreAfricaOpportunity(asset.body, asset.hook, asset.audience);

  // Mandatory 5-pillar presence check — all must score ≥ 50 for publish
  const mandatory_check = {
    attention:      kane.total >= 50,
    trust:          trust.total >= 50,
    transformation: transformation.total >= 50,
    proof:          proof.total >= 25,   // at least one proof signal present
    employment:     employment.total >= 50,
    get all_pass() { return this.attention && this.trust && this.transformation && this.proof && this.employment; },
  };

  // Hard reject if Golden Rule fails (brand-dependent, no standalone value)
  if (golden_rule.total < 30) {
    const final = 0;
    return { kane, hormozi, trust, transformation, employment, golden_rule, tanner, emotional_trigger, relationship, proof, employer_demand, africa_opportunity, final, gate: 'reject', mandatory_check: { ...mandatory_check, all_pass: false } };
  }

  const final = Math.round(
    kane.total * 0.15 +
    hormozi.total * 0.15 +
    trust.total * 0.12 +
    transformation.total * 0.12 +
    employment.total * 0.10 +
    proof.total * 0.10 +
    golden_rule.total * 0.08 +
    tanner.total * 0.05 +
    emotional_trigger.total * 0.05 +
    employer_demand.total * 0.05 +
    africa_opportunity.total * 0.03,
  );

  // 90+ AND all 5 mandatory pillars present = publish; otherwise revise
  const gate: ContentExcellenceScore['gate'] = (final >= 90 && mandatory_check.all_pass) ? 'publish' : 'revise';

  return { kane, hormozi, trust, transformation, employment, golden_rule, tanner, emotional_trigger, relationship, proof, employer_demand, africa_opportunity, final, gate, mandatory_check: { ...mandatory_check } };
}

// Convenience wrapper used by all generators
function scoreAsset(asset: Omit<GrowthAsset, 'score' | 'excellence'>): { score: number; excellence: ContentExcellenceScore } {
  const excellence = runExcellenceGates(asset);
  return { score: excellence.final, excellence };
}

// ---------------------------------------------------------------------------
// Hook Generation + Kane ranking (25 hooks → top 3)
// ---------------------------------------------------------------------------

export function generateHooks(topic: string, count = 25): ScoredHook[] {
  const bucketKeys = Object.keys(HOOK_BUCKETS);
  const raw: ScoredHook[] = [];

  // Base hooks from buckets + topic-aware variants
  for (const bKey of bucketKeys) {
    for (const baseHook of HOOK_BUCKETS[bKey]) {
      raw.push({
        hook: baseHook,
        bucket: bKey,
        kane_score: scoreKane(baseHook, bKey, '').total,
        emotion_trigger: bucketToTrigger(bKey),
        shareability: scoreShareability(bKey),
        controversy: scoreControversy(bKey),
        rank: 0,
      });
    }
    // Topic-specific variant
    const topicHooks = topicVariants(topic, bKey);
    for (const h of topicHooks) {
      raw.push({
        hook: h,
        bucket: bKey,
        kane_score: scoreKane(h, bKey, '').total,
        emotion_trigger: bucketToTrigger(bKey),
        shareability: scoreShareability(bKey),
        controversy: scoreControversy(bKey),
        rank: 0,
      });
    }
  }

  // Sort by Kane score descending, assign rank
  raw.sort((a, b) => b.kane_score - a.kane_score);
  raw.forEach((h, i) => { h.rank = i + 1; });
  return raw.slice(0, count);
}

export function selectTopHooks(hooks: ScoredHook[], n = 3): ScoredHook[] {
  return hooks.slice(0, n);
}

function topicVariants(topic: string, bucket: string): string[] {
  const t = topic.toLowerCase();
  const variants: Record<string, string[]> = {
    contrarian_belief: [
      `Most people think ${t} requires years. It requires the right system.`,
      `The problem with ${t} is not what you think.`,
    ],
    costly_mistake: [
      `The mistake most people make with ${t} costs them months.`,
      `Why ${t} fails for most learners — and what fixes it.`,
    ],
    surprising_proof: [
      `We measured ${t} across real enterprise scenarios. Here is what we found.`,
      `One ${t} proof artifact changes what employers see.`,
    ],
    identity_aspiration: [
      `You can master ${t} — faster than you think.`,
      `${t.charAt(0).toUpperCase() + t.slice(1)} is not gatekept. It is just undersystematized.`,
    ],
    identity_threat: [
      `If you have not updated your ${t} skills since 2022, you are already behind.`,
      `AI is changing ${t} faster than most training programs are admitting.`,
    ],
    speed_to_outcome: [
      `Start with ${t}. See measurable progress this week.`,
      `One ${t} session shows you more than six months of theory.`,
    ],
    myth_busting: [
      `Myth: ${t} is only for senior professionals. Truth: it is for anyone who can prove it.`,
      `Myth: ${t} takes a degree. Truth: it takes demonstrated capability.`,
    ],
    behind_the_build: [
      `We built ${t} into every Aladiah module. Here is why.`,
      `Why ${t} was the first thing we got right — and how we did it.`,
    ],
    transformation_story: [
      `From zero ${t} experience to interview-ready: what the path looks like.`,
      `${t.charAt(0).toUpperCase() + t.slice(1)} is not a topic. It is a transformation.`,
    ],
  };
  return variants[bucket] ?? [];
}

// ---------------------------------------------------------------------------
// LinkedIn Authority Agent
// ---------------------------------------------------------------------------

export function linkedinAuthorityPosts(count = 10): GrowthAsset[] {
  const topics = [
    { title: 'Why Aladiah exists', hook: HOOK_BUCKETS.behind_the_build[3], flywheel: 'attention' as FlywheelStage },
    { title: 'The proof problem in education', hook: HOOK_BUCKETS.contrarian_belief[0], flywheel: 'trust' as FlywheelStage },
    { title: 'What Talent Score means', hook: HOOK_BUCKETS.surprising_proof[0], flywheel: 'trust' as FlywheelStage },
    { title: 'Career changers and AI', hook: HOOK_BUCKETS.identity_aspiration[0], flywheel: 'attention' as FlywheelStage },
    { title: 'AI Scrum Master: the role the market needs', hook: HOOK_BUCKETS.surprising_proof[3], flywheel: 'authority' as FlywheelStage },
    { title: 'What employers actually want', hook: HOOK_BUCKETS.contrarian_belief[2], flywheel: 'employment' as FlywheelStage },
    { title: 'Africa and the AI workforce', hook: HOOK_BUCKETS.identity_aspiration[4], flywheel: 'authority' as FlywheelStage },
    { title: 'Simulations vs certificates', hook: HOOK_BUCKETS.myth_busting[1], flywheel: 'trust' as FlywheelStage },
    { title: 'June 19 launch: what we are building', hook: HOOK_BUCKETS.behind_the_build[0], flywheel: 'attention' as FlywheelStage },
    { title: 'The transformation path', hook: HOOK_BUCKETS.transformation_story[4], flywheel: 'transformation' as FlywheelStage },
  ];

  return topics.slice(0, count).map((t) => {
    const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
      sub_agent: 'linkedin-authority',
      channel: 'linkedin',
      content_type: 'thought_leadership',
      audience: 'working_professionals',
      flywheel_stage: t.flywheel,
      risk_tier: 'low',
      title: t.title,
      hook: t.hook,
      body:
        `${t.hook}\n\n` +
        `This is what becoming an extraordinary professional in the age of AI actually requires.\n\n` +
        `Not more content. A different identity:\n` +
        `• From learner → validated AI-ready professional\n` +
        `• From studying → performing in real enterprise scenarios\n` +
        `• From certificate → proof of who you became\n\n` +
        `That is what ${t.title.toLowerCase()} is really about.\n\n` +
        `Ordinary people become extraordinary professionals. That transformation is the whole point.`,
      cta: `Follow for daily insights on becoming an AI-ready professional → ${SITE}`,
      proof_source: 'Aladiah Talent Score and simulation system',
      kpi_target: 'saves + profile views + qualified comments',
      hashtags: ['CareerTransformation', 'AIWorkforce', 'FutureOfWork', 'Aladiah'],
      metadata: { pillar: 'ai_career_transformation' },
    };
    return { ...base, ...scoreAsset(base) };
  });
}

// ---------------------------------------------------------------------------
// Short-Form Video Agent (Reels / TikTok / Shorts)
// ---------------------------------------------------------------------------

export function shortVideoScripts(count = 10): GrowthAsset[] {
  const scripts = [
    {
      title: 'What job-ready should actually look like',
      hook: HOOK_BUCKETS.surprising_proof[2],
      body: `[HOOK] ${HOOK_BUCKETS.surprising_proof[2]}\n\n[VISUAL: Talent Score screen]\nMost platforms give you a certificate. We give you a score.\nA score that shows employers where you actually stand.\n\n[DEMO: simulation walkthrough 10s]\nEvery Aladiah module ends with a proof artifact — not just a quiz.\n\n[CTA] Take the free assessment. One score. One path. Link in bio.`,
    },
    {
      title: 'Your CV is not your proof',
      hook: HOOK_BUCKETS.contrarian_belief[1],
      body: `[HOOK] ${HOOK_BUCKETS.contrarian_belief[1]}\n\n[VISUAL: resume vs Talent Score comparison]\nA CV tells a story. A Talent Score shows capability.\nEmployers are starting to care about the difference.\n\n[DEMO: profile artifact screen 8s]\nAladiah gives you proof they can verify.\n\n[CTA] Start free at aladiah.academy`,
    },
    {
      title: 'From confusion to AI-ready in 90 days',
      hook: HOOK_BUCKETS.transformation_story[0],
      body: `[HOOK] ${HOOK_BUCKETS.transformation_story[0]}\n\n[VISUAL: learning path animation]\nStep 1: know where you stand (Talent Score)\nStep 2: practice with real enterprise simulations\nStep 3: build a verified portfolio\nStep 4: interview with proof\n\n[CTA] See your path at aladiah.academy`,
    },
    {
      title: 'Myth: you need a CS degree',
      hook: HOOK_BUCKETS.myth_busting[0],
      body: `[HOOK] ${HOOK_BUCKETS.myth_busting[0]}\n\n[VISUAL: career paths screen]\nProject Managers, Business Analysts, Scrum Masters, Cybersecurity leads — none of these require a CS degree.\nThey require demonstrated capability and the right signal.\n\n[DEMO: course path 8s]\nAladiah trains the capability and builds the signal.\n\n[CTA] Start free → aladiah.academy`,
    },
    {
      title: 'Africa is not behind — it is early',
      hook: HOOK_BUCKETS.identity_aspiration[4],
      body: `[HOOK] ${HOOK_BUCKETS.identity_aspiration[4]}\n\n[VISUAL: map animation Africa/Cameroon]\nThe AI economy does not care where you started.\nIt cares what you can do.\n\nAladiah was built for this — career transformation from anywhere.\n\n[CTA] Join the AI workforce. Start free → aladiah.academy`,
    },
    {
      title: 'What happens inside an Aladiah simulation',
      hook: 'What if your training looked more like your actual job?',
      body: `[HOOK] What if your training looked more like your actual job?\n\n[SCREEN RECORDING: simulation walkthrough 15s]\nEvery enterprise scenario is real.\nEvery decision has consequences.\nEvery outcome becomes a portfolio artifact.\n\nThis is how Aladiah prepares you — not for the test, for the job.\n\n[CTA] Try it free → aladiah.academy`,
    },
    {
      title: 'Three things employers want that courses do not give you',
      hook: HOOK_BUCKETS.costly_mistake[0],
      body: `[HOOK] ${HOOK_BUCKETS.costly_mistake[0]}\n\n1. Demonstrated capability (not just certificates)\n2. A verified Talent Score they can check\n3. Proof artifacts from real scenarios\n\n[DEMO: employer profile view 10s]\nAladiah builds all three.\n\n[CTA] Start building yours free → aladiah.academy`,
    },
    {
      title: 'Launching June 19 — what is different',
      hook: 'We are not launching another course platform.',
      body: `[HOOK] We are not launching another course platform.\n\n[FOUNDER: talking head 10s]\nWe are launching an AI-powered career transformation ecosystem.\nLearn. Practice. Simulate. Validate. Interview. Get hired.\n\n[SCREEN: portal overview 8s]\nJune 19 — Aladiah launches.\n\n[CTA] Join the waitlist → aladiah.academy`,
    },
    {
      title: 'AI Scrum Master: what the market needs',
      hook: HOOK_BUCKETS.surprising_proof[3],
      body: `[HOOK] ${HOOK_BUCKETS.surprising_proof[3]}\n\n[SCREEN: AI Scrum Master path]\nTraditional Scrum training does not cover AI-augmented delivery.\nAladiah built the program the market was missing.\n\nAI sprint planning. AI retrospectives. AI stakeholder management.\n\n[CTA] Explore the program → aladiah.academy`,
    },
    {
      title: 'One score. One path. Start free.',
      hook: HOOK_BUCKETS.speed_to_outcome[0],
      body: `[HOOK] ${HOOK_BUCKETS.speed_to_outcome[0]}\n\n[SCREEN: Talent Score in 60s]\nNo lengthy signup. No commitment required.\nSee where you actually stand — then see your path forward.\n\n[CTA] Take the free assessment → aladiah.academy`,
    },
  ];

  return scripts.slice(0, count).map((s, i) => {
    const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
      sub_agent: 'short-form-video',
      channel: i % 2 === 0 ? 'instagram' : 'tiktok',
      content_type: 'reel_script',
      audience: i % 3 === 2 ? 'africa_cameroon' : 'career_changers',
      flywheel_stage: i < 4 ? 'attention' : i < 7 ? 'trust' : 'transformation',
      risk_tier: 'low',
      title: s.title,
      hook: s.hook,
      body: s.body,
      cta: `Start free → ${SITE}`,
      proof_source: 'Aladiah Talent Score and simulation platform',
      kpi_target: '3s hold rate + average watch % + saves',
      hashtags: ['AladiaAcademy', 'AICareer', 'CareerTransformation', 'FutureOfWork'],
      metadata: { format: 'vertical_9x16', target_length_sec: 30 },
    };
    return { ...base, ...scoreAsset(base) };
  });
}

// ---------------------------------------------------------------------------
// Email Revenue Agent
// ---------------------------------------------------------------------------

export interface EmailAsset {
  sequence: string;
  position: number;
  subject: string;
  preview_text: string;
  body: string;
  cta_text: string;
  cta_url: string;
  trigger: string;
  flywheel_stage: FlywheelStage;
}

export function launchEmailSequence(): EmailAsset[] {
  const base_url = SITE;
  return [
    {
      sequence: 'launch_waitlist',
      position: 1,
      subject: 'You are early. Here is what is coming.',
      preview_text: 'Aladiah launches June 19 — here is why it matters.',
      body: `You just joined the Aladiah launch list.\n\nHere is what that means.\n\nOn June 19, Aladiah opens as a fully operational AI-powered career transformation ecosystem — not a course platform, not a bootcamp, not a content library.\n\nA system designed to take you from where you are now to where the AI economy is going.\n\nLearn. Practice. Simulate. Validate. Interview. Get hired.\n\nIn the next few days, we will show you exactly what that means in practice.\n\nWatch for our next email: What is the Talent Score and why does it matter?\n\n— The Aladiah Team`,
      cta_text: 'Explore Aladiah',
      cta_url: base_url,
      trigger: 'launch_waitlist_signup',
      flywheel_stage: 'attention',
    },
    {
      sequence: 'launch_waitlist',
      position: 2,
      subject: 'What employers actually want (and why most platforms miss it)',
      preview_text: 'A certificate is not proof if nobody can see what you can do.',
      body: `Here is the real problem with online education.\n\nMost platforms give you content. Some give you certificates. Very few give you proof.\n\nEmployers do not just want to see what courses you completed. They want to see what you can do.\n\nThat is the gap Aladiah was built to close.\n\nEvery Aladiah module ends with a proof artifact — a verifiable demonstration of capability that goes into your profile.\n\nAdd your Talent Score. Add your simulation results. Add your project portfolio.\n\nNow your profile says something real.\n\nLaunch is June 19. We will show you how it works.\n\n— The Aladiah Team`,
      cta_text: 'Learn how it works',
      cta_url: `${base_url}/talent-score`,
      trigger: 'launch_waitlist_signup',
      flywheel_stage: 'trust',
    },
    {
      sequence: 'launch_waitlist',
      position: 3,
      subject: 'Three days until launch — here is what to do first',
      preview_text: 'One score. One clear next step. Start here.',
      body: `We launch in three days.\n\nWhen you arrive on June 19, here is the first thing we recommend.\n\nTake the Talent Score assessment.\n\nIt takes minutes. It gives you one score and one clear path. No sales pitch. No pressure.\n\nJust clarity.\n\nFrom there, you will see which program fits your goals, what your next milestone is, and how long your transformation path takes.\n\nThis is what the Aladiah difference feels like.\n\nSee you on June 19.\n\n— The Aladiah Team`,
      cta_text: 'Prepare your profile',
      cta_url: base_url,
      trigger: 'launch_waitlist_signup',
      flywheel_stage: 'transformation',
    },
    {
      sequence: 'launch_day',
      position: 1,
      subject: `We are live. Start your ${TAGLINE} today.`,
      preview_text: 'Aladiah is open. Here is where to start.',
      body: `Today is the day.\n\nAladiah is now open.\n\nThe AI-powered career transformation ecosystem is live — and your first step is free.\n\nTake the Talent Score. See your path. Start your transformation.\n\nThis is not a course catalog. It is a system built to move you from learner to employed professional.\n\nLearn. Practice. Simulate. Validate. Interview. Get hired. Lead. Build.\n\nStart today.\n\n— The Aladiah Team`,
      cta_text: `Start free today`,
      cta_url: base_url,
      trigger: 'launch_day',
      flywheel_stage: 'employment',
    },
    {
      sequence: 'talent_score_nurture',
      position: 1,
      subject: 'Your Talent Score is waiting — here is what it tells you',
      preview_text: 'One score. One path. No guessing.',
      body: `You started your Aladiah journey — and the next step is your Talent Score.\n\nYour Talent Score is not a grade. It is a starting point.\n\nIt tells you exactly where you stand today and what path moves you to where you want to be.\n\nIt takes minutes. It gives you clarity most learners spend years searching for.\n\nReady?\n\n— The Aladiah Team`,
      cta_text: 'Complete your Talent Score',
      cta_url: `${base_url}/talent-score`,
      trigger: 'talent_score_started_not_completed',
      flywheel_stage: 'trust',
    },
    {
      sequence: 'talent_score_nurture',
      position: 2,
      subject: 'What your score means — and what to do next',
      preview_text: 'Your path is clearer than you think.',
      body: `You have your Talent Score.\n\nHere is what it means.\n\nYour score is a starting point, not a verdict. It shows you where you are strong, where you need to grow, and which Aladiah program fits your goals.\n\nNext step: review your recommended path and start your first module.\n\nEvery module includes:\n• AI Mentor support\n• Real enterprise simulations\n• A verifiable proof artifact\n• Competency assessment\n\nThis is career transformation — not course completion.\n\n— The Aladiah Team`,
      cta_text: 'Start your first module',
      cta_url: base_url,
      trigger: 'talent_score_completed',
      flywheel_stage: 'transformation',
    },
    {
      sequence: 'webinar',
      position: 1,
      subject: 'Join us live: How Aladiah transforms careers',
      preview_text: 'See the platform, ask questions, understand the path.',
      body: `We are hosting a live session to show you exactly how Aladiah works.\n\nYou will see:\n• The Talent Score in action\n• A live simulation walkthrough\n• The proof artifact system\n• Real career transformation paths for Scrum Master, PM, BA, Cybersecurity, Cloud, and AI roles\n\nPlus a live Q&A with the Aladiah team.\n\nRegister now — seats are limited.\n\n— The Aladiah Team`,
      cta_text: 'Reserve your seat',
      cta_url: `${base_url}/webinar`,
      trigger: 'webinar_created',
      flywheel_stage: 'community',
    },
  ];
}

// ---------------------------------------------------------------------------
// Launch Campaign Engine
// ---------------------------------------------------------------------------

export function buildLaunchCampaign(): LaunchDayAssets[] {
  const days = [
    { relative: 'T-4', date: '2026-06-15', theme: 'launch countdown', audience: 'career_changers' as GrowthAudience },
    { relative: 'T-3', date: '2026-06-16', theme: 'product demo', audience: 'working_professionals' as GrowthAudience },
    { relative: 'T-2', date: '2026-06-17', theme: 'simulation walkthrough', audience: 'employers' as GrowthAudience },
    { relative: 'T-1', date: '2026-06-18', theme: 'final countdown', audience: 'career_changers' as GrowthAudience },
    { relative: 'Launch', date: '2026-06-19', theme: 'official launch', audience: 'career_changers' as GrowthAudience },
    { relative: 'T+1', date: '2026-06-20', theme: '24h learnings', audience: 'working_professionals' as GrowthAudience },
    { relative: 'T+2', date: '2026-06-21', theme: 'FAQ carousel', audience: 'career_changers' as GrowthAudience },
    { relative: 'T+3', date: '2026-06-22', theme: 'early response', audience: 'employers' as GrowthAudience },
    { relative: 'T+4', date: '2026-06-23', theme: 'webinar invite', audience: 'working_professionals' as GrowthAudience },
    { relative: 'T+5', date: '2026-06-24', theme: 'employer value', audience: 'employers' as GrowthAudience },
    { relative: 'T+6', date: '2026-06-25', theme: 'myth busting', audience: 'africa_cameroon' as GrowthAudience },
    { relative: 'T+7', date: '2026-06-26', theme: 'week one report', audience: 'career_changers' as GrowthAudience },
  ];

  return days.map((d) => {
    const isLaunch = d.relative === 'Launch';
    const hook = isLaunch
      ? 'Aladiah is live. The AI-powered career transformation ecosystem is open.'
      : d.relative.startsWith('T-')
        ? `${d.relative} to launch: ${d.theme}`
        : `${d.relative}: ${d.theme}`;

    const li = buildChannelAsset('linkedin', d.audience, hook, d.theme, isLaunch ? 'employment' : 'attention', d.relative);
    const ig = buildChannelAsset('instagram', d.audience, hook, d.theme, 'attention', d.relative);
    const reel = buildChannelAsset('instagram', d.audience, hook, d.theme, 'attention', d.relative, 'reel_script');
    const tt = buildChannelAsset('tiktok', d.audience, hook, d.theme, 'attention', d.relative, 'tiktok_script');
    const em = buildChannelAsset('email', d.audience, hook, d.theme, isLaunch ? 'employment' : 'trust', d.relative, 'email');
    const comm = buildChannelAsset('community', d.audience, hook, d.theme, 'community', d.relative, 'community_post');

    return {
      date: d.date,
      relative_day: d.relative,
      linkedin_post: li,
      instagram_caption: ig,
      reel_script: reel,
      tiktok_script: tt,
      email: em,
      community_post: comm,
      visual_direction: `${d.theme} — clean brand colors, no stock images, product screenshots or founder face preferred`,
      founder_talking_points: [
        `What ${d.theme} means for our mission`,
        `Why this matters on ${d.relative} specifically`,
        `What action viewers should take right now`,
      ],
    };
  });
}

function buildChannelAsset(
  channel: GrowthChannel,
  audience: GrowthAudience,
  hook: string,
  theme: string,
  flywheel: FlywheelStage,
  day: string,
  contentType?: string,
): GrowthAsset {
  const ct = contentType ?? (channel === 'linkedin' ? 'thought_leadership' : channel === 'email' ? 'launch_email' : 'caption');
  const body = buildBody(channel, hook, theme, day);
  const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
    sub_agent: channelToAgent(channel),
    channel,
    content_type: ct,
    audience,
    flywheel_stage: flywheel,
    risk_tier: 'low',
    title: `${day} — ${theme}`,
    hook,
    body,
    cta: `Start free → ${SITE}`,
    proof_source: 'Aladiah Talent Score and AI career ecosystem',
    kpi_target: kpiFor(channel),
    hashtags: ['Aladiah', 'AICareer', 'CareerTransformation', 'FutureOfWork'],
    metadata: { day, theme, channel },
  };
  return { ...base, ...scoreAsset(base) };
}

function buildBody(channel: GrowthChannel, hook: string, theme: string, day: string): string {
  const common =
    `\n\nAladiah is the AI-powered career transformation ecosystem — not a course platform.\n\n` +
    `Learn. Practice. Simulate. Validate. Interview. Get hired.\n\n` +
    `${day} — ${theme}. Follow for daily updates.\n\n` +
    `Start free → ${SITE}`;

  if (channel === 'linkedin') {
    return (
      `${hook}\n\n` +
      `Career transformation is not the same as course completion.\n\n` +
      `At Aladiah we measure both — and we optimize for the one that matters: employment.\n` +
      common
    );
  }
  if (channel === 'email') {
    return (
      `${hook}\n\n` +
      `We are building something different. Not another course platform.\n` +
      `An AI-powered system that takes you from learner to employed professional.\n` +
      common
    );
  }
  if (channel === 'community') {
    return (
      `${hook}\n\n` +
      `What is one thing you want to achieve in your career in the next 90 days?\n` +
      `Reply below — we will share how Aladiah helps you get there.\n\n` +
      `Join the movement → ${SITE}`
    );
  }
  return `${hook}${common}`;
}

function channelToAgent(channel: GrowthChannel): string {
  const map: Record<GrowthChannel, string> = {
    linkedin: 'linkedin-authority',
    instagram: 'short-form-video',
    tiktok: 'short-form-video',
    youtube_shorts: 'short-form-video',
    youtube_longform: 'seo-content',
    email: 'email-revenue',
    community: 'community-growth',
    lead_magnet: 'email-revenue',
    webinar: 'webinar',
    seo_blog: 'seo-content',
  };
  return map[channel] ?? 'cgo';
}

function kpiFor(channel: GrowthChannel): string {
  const map: Record<GrowthChannel, string> = {
    linkedin: 'saves + profile views + qualified comments',
    instagram: 'saves + shares',
    tiktok: '3s hold + completion % + saves',
    youtube_shorts: 'completion % + click to related',
    youtube_longform: 'average view duration + CTA CTR',
    email: 'open rate + CTOR + conversion',
    community: 'participation rate',
    lead_magnet: 'lead capture rate',
    webinar: 'registration + attendance + CTA conversion',
    seo_blog: 'qualified organic traffic',
  };
  return map[channel] ?? 'CTR';
}

// ---------------------------------------------------------------------------
// Cameroon / Africa Growth Agent
// ---------------------------------------------------------------------------

export function cameroonGrowthAssets(): GrowthAsset[] {
  const posts = [
    {
      title: 'CAMTEL and the AI workforce transformation opportunity',
      hook: 'Africa\'s telecoms workforce is at an inflection point.',
      body: `Africa's telecoms workforce is at an inflection point.\n\nAI is changing the skills required to run, manage, and grow a modern telecom operation.\n\nProject management, business analysis, agile delivery, cybersecurity, cloud — these are no longer optional skills. They are operational requirements.\n\nAladiah was built to help organizations like CAMTEL prepare their people before the gap becomes a crisis.\n\nWe train. We simulate. We certify. We validate readiness.\n\nThis is how Africa leads the AI economy rather than catches up to it.\n\nLearn more → ${SITE}`,
      audience: 'africa_cameroon' as GrowthAudience,
      flywheel: 'authority' as FlywheelStage,
    },
    {
      title: 'From Cameroon to global AI workforce',
      hook: 'The AI economy does not care where you started.',
      body: `The AI economy does not care where you started.\n\nIt cares what you can do and whether you can prove it.\n\nAladiah gives you the system to build that proof — from anywhere, in any language the platform supports.\n\nA Talent Score that travels. A portfolio that speaks. A certification that means something.\n\nAfrica's next workforce leaders are training now.\n\nJoin them → ${SITE}`,
      audience: 'africa_cameroon' as GrowthAudience,
      flywheel: 'attention' as FlywheelStage,
    },
    {
      title: 'Universities and the AI skills gap in Cameroon',
      hook: 'The curriculum gap between what universities teach and what employers need has never been larger.',
      body: `The curriculum gap between what universities teach and what employers need has never been larger.\n\nAI-powered project management. Agile delivery. Cybersecurity. Cloud operations. Business analysis.\n\nThese are the skills the workforce needs now.\n\nAladiah partners with universities and enterprises to close the gap — with structured programs, simulation-based learning, and validated proof artifacts.\n\nContact us to discuss a workforce transformation partnership → ${SITE}`,
      audience: 'africa_cameroon' as GrowthAudience,
      flywheel: 'employment' as FlywheelStage,
    },
  ];

  return posts.map((p) => {
    const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
      sub_agent: 'cameroon-growth',
      channel: 'linkedin',
      content_type: 'regional_authority',
      audience: p.audience,
      flywheel_stage: p.flywheel,
      risk_tier: 'low',
      title: p.title,
      hook: p.hook,
      body: p.body,
      cta: `Learn more → ${SITE}`,
      proof_source: 'Aladiah AI career ecosystem and regional workforce strategy',
      kpi_target: 'institutional inquiries + qualified engagements',
      hashtags: ['Cameroon', 'AfricaAI', 'WorkforceTransformation', 'Aladiah', 'CAMTEL'],
      metadata: { region: 'cameroon', pillar: 'africa_workforce' },
    };
    return { ...base, ...scoreAsset(base) };
  });
}

// ---------------------------------------------------------------------------
// Dominican Republic Growth Agent
// ---------------------------------------------------------------------------

export function dominicanRepublicGrowthAssets(): GrowthAsset[] {
  const posts = [
    {
      title: 'De talento local a oportunidad global — República Dominicana',
      hook: 'El mercado laboral ya no tiene fronteras para quienes tienen las habilidades correctas.',
      body: `El mercado laboral ya no tiene fronteras para quienes tienen las habilidades correctas.\n\nScrum Master. Project Manager. Business Analyst. Cybersecurity. Cloud. AI.\n\nEstas son las carreras que abren puertas a nivel global — y puedes construir el camino desde República Dominicana.\n\nAladiah Academy es un ecosistema de transformación profesional impulsado por IA: aprendes, practicas con simulaciones reales, obtienes un Talent Score verificable y te preparas para entrevistas internacionales.\n\nEmpieza gratis → ${SITE}`,
      audience: 'dominican_republic' as GrowthAudience,
      flywheel: 'attention' as FlywheelStage,
    },
    {
      title: 'Aladiah DR: el camino desde estudiante hasta profesional empleado',
      hook: 'No necesitas un título de CS para entrar a la economía de IA.',
      body: `No necesitas un título de CS para entrar a la economía de IA.\n\nNecesitas las competencias correctas — demostradas, verificadas, y presentadas con claridad.\n\nAladiah construye esa demostración contigo:\n• Talent Score → sabes dónde estás\n• Simulaciones → practicas antes de la entrevista\n• Artefactos de portafolio → tienes prueba real\n• Preparación de entrevistas → entras confiado\n\nEmpieza gratis → ${SITE}`,
      audience: 'dominican_republic' as GrowthAudience,
      flywheel: 'transformation' as FlywheelStage,
    },
  ];

  return posts.map((p) => {
    const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
      sub_agent: 'dr-growth',
      channel: 'instagram',
      content_type: 'regional_caption',
      audience: p.audience,
      flywheel_stage: p.flywheel,
      risk_tier: 'low',
      title: p.title,
      hook: p.hook,
      body: p.body,
      cta: `Empieza gratis → ${SITE}`,
      proof_source: 'Aladiah AI career ecosystem',
      kpi_target: 'saves + link clicks + qualified DMs',
      hashtags: ['RepublicaDominicana', 'CarreraEnTech', 'AICareer', 'Aladiah'],
      metadata: { region: 'dominican_republic', language: 'es', pillar: 'dr_workforce' },
    };
    return { ...base, ...scoreAsset(base) };
  });
}

// ---------------------------------------------------------------------------
// Employer Trust Agent
// ---------------------------------------------------------------------------

export function employerTrustAssets(): GrowthAsset[] {
  const posts = [
    {
      title: 'Why employer-facing proof matters in 2026',
      hook: 'The hiring problem is not talent shortage. It is proof shortage.',
      body: `The hiring problem is not talent shortage. It is proof shortage.\n\nMost candidates cannot demonstrate capability clearly. Most platforms do not give them the tools to do so.\n\nAladiah changes that.\n\nEvery Aladiah graduate has:\n• A verified Talent Score\n• Simulation artifacts from real enterprise scenarios\n• A structured portfolio reviewed by the platform\n• Interview readiness signals\n\nThis is what "job-ready" should look like — observable, verifiable, and specific.\n\nInterested in accessing Aladiah-validated talent? Let's talk → ${SITE}/employers`,
    },
    {
      title: 'The Aladiah employer value proposition',
      hook: 'Stop hiring based on self-reported credentials.',
      body: `Stop hiring based on self-reported credentials.\n\nAladiah gives employers a better signal.\n\nTalent Score — a structured readiness score across the competencies you care about.\nSimulation results — proof that the candidate can handle real-world scenarios.\nPortfolio artifacts — deliverables from enterprise-grade projects.\n\nLess time screening. More signal per candidate.\n\nBuild your Aladiah talent pipeline → ${SITE}/employers`,
    },
  ];

  return posts.map((p) => {
    const base: Omit<GrowthAsset, 'score' | 'excellence'> = {
      sub_agent: 'employer-trust',
      channel: 'linkedin',
      content_type: 'b2b_authority',
      audience: 'employers',
      flywheel_stage: 'employment',
      risk_tier: 'medium',
      title: p.title,
      hook: p.hook,
      body: p.body,
      cta: `Talk to us → ${SITE}/employers`,
      proof_source: 'Aladiah Talent Score and employer proof system',
      kpi_target: 'qualified employer inquiries',
      hashtags: ['TalentAcquisition', 'FutureOfWork', 'AIWorkforce', 'Aladiah'],
      metadata: { pillar: 'employer_trust', b2b: true },
    };
    return { ...base, ...scoreAsset(base) };
  });
}

// ---------------------------------------------------------------------------
// Lead Magnet Engine
// ---------------------------------------------------------------------------

export interface LeadMagnetSpec {
  title: string;
  audience: GrowthAudience;
  problem: string;
  quick_win: string;
  format: string;
  cta: string;
  flywheel_stage: FlywheelStage;
}

export function leadMagnetSpecs(): LeadMagnetSpec[] {
  return [
    {
      title: 'AI Career Blueprint 2026',
      audience: 'career_changers',
      problem: 'You want to enter AI-powered tech roles but do not know where to start.',
      quick_win: 'A clear 90-day path from your current background to your first AI-ready role.',
      format: 'PDF checklist + career path map',
      cta: `Download free → ${SITE}/lead-magnets/ai-career-blueprint`,
      flywheel_stage: 'attention',
    },
    {
      title: 'AI Scrum Master Roadmap',
      audience: 'working_professionals',
      problem: 'Your Scrum skills were built before AI changed delivery. You need to catch up fast.',
      quick_win: 'The 8 AI capabilities every Scrum Master needs and how to build each one.',
      format: 'PDF roadmap + self-assessment',
      cta: `Download free → ${SITE}/lead-magnets/ai-scrum-master-roadmap`,
      flywheel_stage: 'trust',
    },
    {
      title: 'AI Job Readiness Checklist',
      audience: 'career_changers',
      problem: 'You have studied but you do not know if you are actually ready to interview.',
      quick_win: 'A 25-point checklist that tells you exactly where you stand before your first interview.',
      format: 'PDF checklist',
      cta: `Download free → ${SITE}/lead-magnets/job-readiness-checklist`,
      flywheel_stage: 'employment',
    },
    {
      title: 'Africa Digital Workforce Report 2026',
      audience: 'africa_cameroon',
      problem: 'Africa\'s enterprises need a credible view of workforce readiness in the AI economy.',
      quick_win: 'An actionable overview of the key skill gaps and the most effective transformation pathways.',
      format: 'PDF report',
      cta: `Download free → ${SITE}/lead-magnets/africa-workforce-report`,
      flywheel_stage: 'authority',
    },
    {
      title: 'DR AI Career Guide',
      audience: 'dominican_republic',
      problem: 'You want to access global tech opportunities but do not know where your skills fit.',
      quick_win: 'The top 5 AI-powered roles with the highest international demand that match DR talent.',
      format: 'PDF guide (Spanish)',
      cta: `Descarga gratis → ${SITE}/lead-magnets/guia-carrera-ai-rd`,
      flywheel_stage: 'attention',
    },
  ];
}

// ---------------------------------------------------------------------------
// Founder Personal Brand Plan
// ---------------------------------------------------------------------------

export interface FounderBrandPlan {
  series: { name: string; angle: string; frequency: string }[];
  episode_template: string[];
  repurposing_matrix: { source: string; outputs: string[] }[];
  weekly_topics: string[];
}

export function founderBrandPlan(): FounderBrandPlan {
  return {
    series: [
      { name: 'Building Aladiah in public', angle: 'founder narrative + lessons', frequency: '2x weekly' },
      { name: 'What most education gets wrong', angle: 'contrarian authority', frequency: '1x weekly' },
      { name: 'Proof over promises', angle: 'Talent Score, simulations, outcomes', frequency: '2x weekly' },
      { name: 'From learner to signal', angle: 'case/pathway explainers', frequency: '1x weekly' },
      { name: 'Schools and employers need better evidence', angle: 'B2B credibility', frequency: '1x weekly' },
    ],
    episode_template: [
      '1. Hook — one line that stops the scroll',
      '2. One false belief the audience holds',
      '3. One true idea Aladiah is built on',
      '4. One example from the Aladiah system',
      '5. One proof artifact or product screenshot',
      '6. One CTA — start free / join the community / book a conversation',
    ],
    repurposing_matrix: [
      {
        source: '5-minute founder recording',
        outputs: ['1 LinkedIn post', '3 short clips', '1 carousel', '1 email section', '3 quotes'],
      },
      {
        source: 'Webinar',
        outputs: ['landing page FAQ', '5 shorts', '2 emails', '1 blog post'],
      },
      {
        source: 'Product demo',
        outputs: ['Reel', 'YouTube Short', 'GIF snippets', 'CTA section', 'proof post'],
      },
    ],
    weekly_topics: [
      'Why career transformation and course completion are not the same thing',
      'What Aladiah Talent Score shows that a resume cannot',
      'Building the AI Scrum Master program — what the market was missing',
      'Africa and the AI workforce opportunity',
      'What employers actually look for in 2026',
      'How simulation-based learning changes interview readiness',
      'The Aladiah flywheel explained',
    ],
  };
}

// ---------------------------------------------------------------------------
// Daily Growth Brief builder
// ---------------------------------------------------------------------------

export function buildDailyBrief(
  date: string,
  launchDayRelative: string,
  assetsCreated: number,
  approvalsPending: string[],
  risks: string[],
): DailyGrowthBrief {
  return {
    date,
    launch_day_relative: launchDayRelative,
    overall_status: risks.length > 2 ? 'yellow' : 'green',
    created_count: assetsCreated,
    flywheel_coverage: {
      attention: Math.ceil(assetsCreated * 0.3),
      trust: Math.ceil(assetsCreated * 0.25),
      community: Math.ceil(assetsCreated * 0.1),
      transformation: Math.ceil(assetsCreated * 0.15),
      employment: Math.ceil(assetsCreated * 0.1),
      success_stories: Math.ceil(assetsCreated * 0.05),
      authority: Math.ceil(assetsCreated * 0.05),
    },
    platform_coverage: {
      linkedin: Math.ceil(assetsCreated * 0.3),
      instagram: Math.ceil(assetsCreated * 0.2),
      tiktok: Math.ceil(assetsCreated * 0.15),
      youtube_shorts: Math.ceil(assetsCreated * 0.1),
      youtube_longform: Math.ceil(assetsCreated * 0.05),
      email: Math.ceil(assetsCreated * 0.1),
      community: Math.ceil(assetsCreated * 0.05),
      lead_magnet: 0,
      webinar: 0,
      seo_blog: Math.ceil(assetsCreated * 0.05),
    },
    top_priorities: [
      'Launch all staged assets for today\'s calendar slot',
      'Ensure all launch-day CTAs are live and routing correctly',
      'Queue founder review packet for any high-risk assets',
    ],
    approval_queue: approvalsPending,
    risks,
    recommendation:
      'Prioritize proof-heavy LinkedIn posts and short-form video to drive Talent Score activations. All assets are low-risk and auto-approved for staging; founder review required before publish.',
  };
}
