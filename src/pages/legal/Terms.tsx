import LegalShell, { LegalSection } from './LegalShell';

// Interim MVP terms — deliberately simple, no invented legal doctrine.
// Marked as subject to final legal review; contains no broken placeholders.
const SECTIONS: LegalSection[] = [
  { h: 'Acceptance of Terms', body: [
    'By accessing or using Aladiah Academy (the “Platform”), you agree to be bound by these Terms. If you do not agree, do not use the Platform.',
  ]},
  { h: 'Educational Services', body: [
    'Aladiah provides online learning programs, assessments, simulations, and related career-development tools. Program structure, content, and availability may change as the Platform is developed. Programs marked “Preview” or “Coming Soon” are not yet available and their described features may change before release.',
  ]},
  { h: 'Subscriptions and Payments', body: [
    'Certain features require a paid subscription or one-time purchase. Prices, billing cycles, and payment terms are presented at the point of purchase. Payments are processed by our third-party provider (Stripe).',
  ]},
  { h: 'Refunds and Cancellations', body: [
    'You can cancel your subscription at any time; cancellation takes effect at the end of the current billing period and you keep access until then.',
    'If you believe you were charged in error, contact support@aladiahacademy.com within 14 days of the charge and we will review your request.',
  ]},
  { h: 'Account Access', body: [
    'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Accounts are personal and may not be shared.',
  ]},
  { h: 'Acceptable Use', body: [
    'You agree not to misuse the Platform, including unauthorized access, scraping, redistribution of content, harassment, or any unlawful activity. We may suspend or terminate accounts engaged in misuse.',
  ]},
  { h: 'Intellectual Property', body: [
    'All course materials, assessments, software, branding, and content are owned by Aladiah or its licensors and are protected by applicable intellectual-property laws. No rights are granted except as expressly stated.',
  ]},
  { h: 'AI Tutor and AI-Generated Content', body: [
    'The Platform includes AI-powered tutoring and AI-generated content. AI outputs may contain errors and are provided for educational support only — they are not professional, legal, financial, or career advice. Always verify important information independently.',
  ]},
  { h: 'No Guaranteed Employment', body: [
    'Aladiah supports career development but does not guarantee employment, job placement, salary outcomes, certification by third parties, or any specific result. Outcomes depend on individual effort and external factors outside our control.',
  ]},
  { h: 'Limitation of Liability', body: [
    'The Platform is provided “as is” and “as available”, without warranties of any kind, express or implied.',
    'To the maximum extent permitted by applicable law, Aladiah is not liable for indirect, incidental, special, or consequential damages arising from your use of the Platform, and our total aggregate liability is limited to the amounts you paid to Aladiah in the twelve months preceding the claim.',
  ]},
  { h: 'Governing Law', body: [
    'These Terms are governed by the laws of the jurisdiction in which Aladiah’s operating entity is registered. Detailed governing-law and dispute-resolution provisions will be published upon completion of legal review; until then, we will work with you in good faith to resolve any dispute informally first.',
  ]},
  { h: 'Contact Information', body: [
    'Questions about these Terms can be directed to support@aladiahacademy.com or via the Contact page.',
  ]},
];

export default function Terms() {
  return (
    <LegalShell
      title="Terms of Service"
      lastUpdated="July 2026 · Interim terms — subject to final legal review"
      intro="These Terms govern your use of the Aladiah Academy platform. They are interim terms published for our initial launch and remain subject to final legal review; material changes will be announced on this page."
      sections={SECTIONS}
    />
  );
}
