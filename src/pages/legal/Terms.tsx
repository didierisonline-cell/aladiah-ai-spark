import LegalShell, { LegalSection } from './LegalShell';

// Draft placeholder copy — structural only. Requires Founder/legal review.
const SECTIONS: LegalSection[] = [
  { h: 'Acceptance of Terms', body: [
    'By accessing or using Aladiah Academy (the “Platform”), you agree to be bound by these Terms. If you do not agree, do not use the Platform.',
    '[Placeholder — final acceptance language and effective-date mechanics pending legal review.]',
  ]},
  { h: 'Educational Services', body: [
    'Aladiah provides online learning programs, assessments, simulations, and related career-development tools. Program structure, content, and availability may change as the Platform is developed.',
    '[Placeholder — scope of services and any program-specific terms pending review.]',
  ]},
  { h: 'Subscriptions and Payments', body: [
    'Certain features require a paid subscription or one-time purchase. Prices, billing cycles, and payment terms are presented at the point of purchase. Payments are processed by our third-party provider (Stripe).',
    '[Placeholder — billing terms, renewals, and tax handling pending review.]',
  ]},
  { h: 'Refunds and Cancellations', body: [
    '[Placeholder — refund eligibility, cancellation windows, and process to be defined and confirmed by Founder/legal before launch.]',
  ]},
  { h: 'Account Access', body: [
    'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Accounts are personal and may not be shared.',
    '[Placeholder — eligibility, account suspension/termination terms pending review.]',
  ]},
  { h: 'Acceptable Use', body: [
    'You agree not to misuse the Platform, including unauthorized access, scraping, redistribution of content, harassment, or any unlawful activity.',
    '[Placeholder — full acceptable-use policy pending review.]',
  ]},
  { h: 'Intellectual Property', body: [
    'All course materials, assessments, software, branding, and content are owned by Aladiah or its licensors and are protected by applicable intellectual-property laws. No rights are granted except as expressly stated.',
    '[Placeholder — license grant and user-content terms pending review.]',
  ]},
  { h: 'AI Tutor and AI-Generated Content', body: [
    'The Platform includes AI-powered tutoring and AI-generated content. AI outputs may contain errors and are provided for educational support only — they are not professional, legal, financial, or career advice. Always verify important information independently.',
    '[Placeholder — AI usage, data handling, and limitations disclaimer pending review.]',
  ]},
  { h: 'No Guaranteed Employment', body: [
    'Aladiah supports career development but does not guarantee employment, job placement, salary outcomes, certification by third parties, or any specific result. Outcomes depend on individual effort and external factors outside our control.',
  ]},
  { h: 'Limitation of Liability', body: [
    '[Placeholder — limitation of liability and disclaimer of warranties to be drafted and confirmed by legal counsel before launch.]',
  ]},
  { h: 'Governing Law', body: [
    '[Placeholder — governing law and dispute-resolution jurisdiction to be confirmed by Founder/legal before launch.]',
  ]},
  { h: 'Contact Information', body: [
    'Questions about these Terms can be directed to us via the Contact page.',
    '[Placeholder — official legal contact email and registered address pending Founder/legal confirmation before launch.]',
  ]},
];

export default function Terms() {
  return (
    <LegalShell
      title="Terms of Service"
      lastUpdated="Pending review"
      intro="These Terms govern your use of the Aladiah Academy platform. This is a working draft published for structural review and does not yet constitute the final, binding terms."
      sections={SECTIONS}
    />
  );
}
