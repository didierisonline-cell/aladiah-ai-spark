// =============================================================================
// Marketing Content Agent — content generators (deterministic v1)
// Pure functions: (idea/theme/audience) -> DraftAsset(s). No I/O, no AOS.
// Phase 2 swaps these for Claude calls (server-side edge function) behind the
// same DraftAsset contract — see docs/agents/marketing-content/AGENT_SPEC.md.
// =============================================================================
import {
  CalendarScope,
  CalendarSlot,
  DraftAsset,
  GenerateCampaignInput,
  GenerateLeadMagnetInput,
  GenerateWebinarInput,
  Platform,
} from '@/types/marketing';

const BRAND =
  'Aladiah Academy — AI-powered career transformation (Scrum Master, Project Management, Cybersecurity, Data, Cloud, AI, DevOps, Business Analysis), Africa & Caribbean first.';
const SITE = 'https://aladiah.academy';
const tags = (...t: string[]) => t.map((x) => x.replace(/[^a-z0-9]/gi, ''));

/** The repurposing engine fan-out: one idea -> this asset set. */
export const REPURPOSE_PLAN: { platform: Platform; content_type: string }[] = [
  { platform: 'blog', content_type: 'seo_article' },
  { platform: 'linkedin', content_type: 'thought_leadership' },
  { platform: 'linkedin', content_type: 'career_transformation' },
  { platform: 'linkedin', content_type: 'ai_workforce' },
  { platform: 'facebook', content_type: 'community' },
  { platform: 'facebook', content_type: 'motivational' },
  { platform: 'email', content_type: 'newsletter' },
  { platform: 'instagram', content_type: 'caption' },
  { platform: 'instagram', content_type: 'caption' },
  { platform: 'youtube', content_type: 'long_form_script' },
  { platform: 'youtube', content_type: 'shorts_script' },
  { platform: 'youtube', content_type: 'shorts_script' },
  { platform: 'youtube', content_type: 'shorts_script' },
];

/** Build a single asset for a platform/content_type from an idea. */
export function buildAsset(
  platform: Platform,
  contentType: string,
  idea: string,
  theme = 'career transformation',
  audience = 'career changers and early-career professionals',
): DraftAsset {
  const base = { platform, content_type: contentType, theme, audience };

  switch (platform) {
    case 'linkedin':
      return {
        ...base,
        title: `${idea}`,
        hook: `Most people think ${idea.toLowerCase()} is out of reach. Here's why it isn't.`,
        body:
          `${idea}.\n\n` +
          `In today's AI-driven economy, the gap between "qualified" and "employable" is real — and closing it is what we obsess over at Aladiah.\n\n` +
          `Three things that actually move the needle:\n` +
          `1. Build measurable competency, not just certificates.\n` +
          `2. Practice with real-world simulations before the interview.\n` +
          `3. Get coached on the story that gets you hired.\n\n` +
          `That's the difference between finishing a course and transforming a career.`,
        cta: `Follow for daily career-transformation insights. Ready to start? ${SITE}`,
        hashtags: tags('CareerTransformation', 'AgileCareers', 'AIWorkforce', 'Aladiah'),
      };
    case 'facebook':
      return {
        ...base,
        title: idea,
        hook: `👋 Quick one for our community:`,
        body:
          `${idea}.\n\n` +
          `Your background doesn't disqualify you — the right system gets you there. ` +
          `Thousands are reskilling into Scrum, PM, Cloud, Cyber, and AI roles right now.\n\n` +
          `Drop a 🔥 if you're working on your next move.`,
        cta: `Learn how Aladiah helps you get hired → ${SITE}`,
        hashtags: tags('CareerGrowth', 'Reskill', 'Aladiah'),
      };
    case 'instagram':
      if (contentType === 'carousel')
        return {
          ...base,
          title: `${idea} (carousel)`,
          hook: `Swipe → 5 steps to ${theme}`,
          body:
            `Slide 1: ${idea}\n` +
            `Slide 2: The skill that gets you hired in 2026\n` +
            `Slide 3: Build proof, not just a certificate\n` +
            `Slide 4: Practice in real simulations\n` +
            `Slide 5: Your Aladiah profile employers trust\n` +
            `Slide 6: Start today → link in bio`,
          cta: `Save this & follow @aladiah`,
          hashtags: tags('CareerGoals', 'TechCareers', 'Aladiah', 'AIWorkforce'),
        };
      if (contentType === 'reel')
        return {
          ...base,
          title: `${idea} (reel concept)`,
          hook: `POV: you finally landed the role you trained for 🎯`,
          body:
            `Hook (0-3s): "${idea}"\n` +
            `Beat 1: the struggle (generic courses, no callbacks)\n` +
            `Beat 2: the shift (competency + simulations + coaching)\n` +
            `Beat 3: the win (offer letter)\n` +
            `Text overlay: "Career transformation, not course completion"\n` +
            `Audio: upbeat trending track`,
          cta: `Full path in bio → ${SITE}`,
          hashtags: tags('Reels', 'CareerTransformation', 'Aladiah'),
        };
      return {
        ...base,
        title: `${idea} (caption)`,
        hook: `${idea} ✨`,
        body:
          `The goal was never the certificate. It was the career.\n\n` +
          `Competency you can measure. Simulations that build real capability. Coaching that gets you hired.`,
        cta: `Your transformation starts in bio → @aladiah`,
        hashtags: tags('CareerTransformation', 'TechCareers', 'Aladiah', 'AIWorkforce'),
      };
    case 'blog':
      return {
        ...base,
        title:
          contentType === 'pillar'
            ? `The Complete Guide to ${idea}`
            : contentType === 'career_guide'
            ? `${idea}: A Practical Career Guide for 2026`
            : contentType === 'industry_report'
            ? `${idea}: 2026 Industry Report`
            : `${idea}: What Actually Works`,
        hook: `If you're serious about ${theme}, this is the playbook.`,
        body:
          `## Introduction\n${idea}. In this guide we break down exactly how to go from where you are to employed and growing.\n\n` +
          `## Why most people stall\nCertificates signal completion, not capability. Employers buy capability.\n\n` +
          `## The Aladiah approach\n- Measure competency\n- Practice in simulations\n- Coach the hiring story\n- Build an employer-trusted profile\n\n` +
          `## Step-by-step\n1. Diagnose your target role\n2. Close the competency gaps\n3. Prove it with projects + simulations\n4. Interview with evidence\n\n` +
          `## Conclusion\n${idea} is achievable with the right system. ${BRAND}`,
        cta: `Start your path at ${SITE}`,
        hashtags: tags('SEO', 'CareerGuide', 'Aladiah'),
      };
    case 'email':
      return {
        ...base,
        title:
          contentType === 'webinar_invite'
            ? `You're invited: ${idea}`
            : contentType === 'lead_nurture'
            ? `One step closer to ${theme}`
            : `${idea} — your weekly edge`,
        hook: `Hi {{first_name}},`,
        body:
          `${idea}.\n\n` +
          `This week's focus: turning effort into outcomes. Here's one move you can make today — pick a target role and list the 5 competencies it requires. That clarity is where transformation begins.\n\n` +
          `Inside Aladiah you get the measurement, simulations, and coaching to close those gaps.`,
        cta:
          contentType === 'webinar_invite'
            ? `Save your seat → ${SITE}/webinar`
            : `Continue your path → ${SITE}`,
        hashtags: [],
      };
    case 'youtube':
      if (contentType === 'shorts_script')
        return {
          ...base,
          title: `${idea} (Short)`,
          hook: `Stop applying. Start proving. (0-2s)`,
          body:
            `[0-2s] Hook: "${idea}"\n` +
            `[2-15s] The problem: 200 applications, 0 callbacks\n` +
            `[15-40s] The fix: measurable competency + simulations + coaching\n` +
            `[40-55s] Proof: an Aladiah profile employers trust\n` +
            `[55-60s] CTA: "Link in description"`,
          cta: `Full path → ${SITE}`,
          hashtags: tags('Shorts', 'CareerTips', 'Aladiah'),
        };
      if (contentType === 'description')
        return {
          ...base,
          title: `${idea} (description)`,
          hook: idea,
          body:
            `${idea}. In this video we break down how to transform your career with AI-powered learning.\n\n` +
            `⏱ Chapters:\n00:00 Intro\n01:00 The real problem\n04:00 The Aladiah method\n10:00 Your next step\n\n` +
            `🔗 Start: ${SITE}`,
          cta: `Subscribe for weekly career-transformation videos.`,
          hashtags: tags('CareerTransformation', 'Aladiah'),
        };
      // long_form_script (also covers title/thumbnail via metadata)
      return {
        ...base,
        title: `${idea} — full script`,
        hook: `Cold open: "What if the reason you're not getting hired has nothing to do with effort?"`,
        body:
          `INTRO (0:00): Establish the promise — ${idea}.\n` +
          `SECTION 1: Why certificates aren't enough (story + data).\n` +
          `SECTION 2: The competency model — measure what you can do.\n` +
          `SECTION 3: Simulations — practice the real job.\n` +
          `SECTION 4: Coaching — the hiring story.\n` +
          `SECTION 5: The Aladiah profile employers trust.\n` +
          `OUTRO: CTA to start. ${BRAND}`,
        cta: `Begin your transformation → ${SITE}`,
        hashtags: tags('CareerTransformation', 'AIWorkforce', 'Aladiah'),
      };
    case 'webinar':
      if (contentType === 'landing_page')
        return {
          ...base,
          title: `Landing page: ${idea}`,
          hook: `Free Live Workshop: ${idea}`,
          body:
            `HEADLINE: ${idea}\n` +
            `SUBHEAD: A free live session on turning skills into a hired, growing career.\n\n` +
            `What you'll learn:\n- The competency gaps that actually block offers\n- How simulations build real capability fast\n- The profile employers in Africa & the Caribbean trust\n\n` +
            `Who it's for: career changers, early-career pros, and upskillers.\n\n` +
            `Register below — seats are limited.`,
          cta: `Reserve my seat`,
          hashtags: [],
        };
      if (contentType === 'follow_up')
        return {
          ...base,
          title: `Follow-up sequence: ${idea}`,
          hook: `Post-webinar nurture (3 emails)`,
          body:
            `Email 1 (Day 0): Thanks + replay link + the #1 takeaway.\n` +
            `Email 2 (Day 2): Case study — a transformation story + soft CTA.\n` +
            `Email 3 (Day 4): Enrollment invitation + deadline + FAQ.`,
          cta: `Enroll now → ${SITE}`,
          hashtags: [],
        };
      return {
        ...base,
        title: `Webinar topic: ${idea}`,
        hook: `A high-conversion webinar concept`,
        body:
          `Title: ${idea}\n` +
          `Promise: leave with a concrete plan to become employable in your target role.\n` +
          `Outline: 1) The employability gap 2) Competency + simulations 3) Live Q&A 4) Offer.`,
        cta: `Build the landing page next.`,
        hashtags: [],
      };
    case 'lead_magnet':
      return {
        ...base,
        title: idea,
        hook: `A free resource your audience will actually use`,
        body:
          `${idea}\n\n` +
          `Format: ${contentType}\n` +
          `- Section 1: Outcome you'll achieve\n` +
          `- Section 2: Step-by-step actions\n` +
          `- Section 3: Checklist / template\n` +
          `- Section 4: Next step with Aladiah`,
        cta: `Download free → ${SITE}`,
        hashtags: [],
      };
    default:
      return {
        ...base,
        title: idea,
        hook: idea,
        body: idea,
        cta: SITE,
        hashtags: [],
      };
  }
}

/** One idea -> the full repurposing fan-out (13 assets). */
export function repurpose(idea: string, theme?: string, audience?: string): DraftAsset[] {
  return REPURPOSE_PLAN.map((p) => buildAsset(p.platform, p.content_type, idea, theme, audience));
}

/** A multi-channel campaign's starter assets. */
export function campaignAssets(input: GenerateCampaignInput): DraftAsset[] {
  const channels = input.channels?.length ? input.channels : (['linkedin', 'facebook', 'email', 'blog'] as Platform[]);
  const defaultType: Record<Platform, string> = {
    linkedin: 'thought_leadership',
    facebook: 'community',
    instagram: 'caption',
    blog: 'seo_article',
    email: 'newsletter',
    youtube: 'long_form_script',
    webinar: 'topic',
    lead_magnet: 'checklist',
  };
  return channels.map((ch) =>
    buildAsset(ch, defaultType[ch], `${input.name}: ${input.objective}`, input.theme, input.audience),
  );
}

/** Webinar set: topic + landing page + follow-up sequence. */
export function webinarAssets(input: GenerateWebinarInput): DraftAsset[] {
  return [
    buildAsset('webinar', 'topic', input.topic, 'webinar', input.audience),
    buildAsset('webinar', 'landing_page', input.topic, 'webinar', input.audience),
    buildAsset('webinar', 'follow_up', input.topic, 'webinar', input.audience),
    buildAsset('email', 'webinar_invite', input.topic, 'webinar', input.audience),
  ];
}

/** Lead magnet asset. */
export function leadMagnetAsset(input: GenerateLeadMagnetInput): DraftAsset {
  const ct = `lead_magnet_${input.kind}`;
  return buildAsset('lead_magnet', ct, input.topic, input.kind.replace('_', ' '), input.audience);
}

/** Build a daily/weekly/monthly content plan (slots only — assets on demand). */
export function buildCalendarPlan(
  scope: CalendarScope,
  theme = 'career transformation',
  startDate = new Date().toISOString().slice(0, 10),
): { slots: CalendarSlot[]; periodEnd: string } {
  const days = scope === 'daily' ? 1 : scope === 'weekly' ? 7 : 30;
  const rotation: { platform: Platform; content_type: string }[] = [
    { platform: 'linkedin', content_type: 'thought_leadership' },
    { platform: 'instagram', content_type: 'caption' },
    { platform: 'facebook', content_type: 'motivational' },
    { platform: 'youtube', content_type: 'shorts_script' },
    { platform: 'blog', content_type: 'seo_article' },
    { platform: 'email', content_type: 'newsletter' },
    { platform: 'linkedin', content_type: 'success_story' },
  ];
  const start = new Date(startDate);
  const slots: CalendarSlot[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const slot = rotation[i % rotation.length];
    slots.push({
      date: d.toISOString().slice(0, 10),
      platform: slot.platform,
      content_type: slot.content_type,
      title: `${theme} — ${slot.platform} ${slot.content_type.replace(/_/g, ' ')}`,
      theme,
      status: 'planned',
    });
  }
  const end = new Date(start);
  end.setDate(start.getDate() + days - 1);
  return { slots, periodEnd: end.toISOString().slice(0, 10) };
}
