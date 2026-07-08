import LegalShell, { LegalSection } from './LegalShell';

// Interim MVP privacy policy — deliberately simple, no invented legal doctrine.
// Marked as subject to final legal review; contains no broken placeholders.
const SECTIONS: LegalSection[] = [
  { h: 'Information We Collect', body: [
    'We collect information you provide directly (such as account details and content you submit), information generated as you use the Platform (such as learning progress), and limited technical information from your device (such as browser type and approximate region).',
  ]},
  { h: 'Account Data', body: [
    'When you create an account we collect identifiers such as your name, email address, and authentication details needed to provide and secure your account.',
  ]},
  { h: 'Payment Data (via Stripe)', body: [
    'Payments are processed by Stripe. We do not store full card numbers on our servers; Stripe handles card data under its own security and privacy practices. We retain limited records such as transaction status and plan information.',
  ]},
  { h: 'Learning Progress Data', body: [
    'We store your course enrollments, lesson progress, assessment attempts and scores, and related learning activity to deliver the educational service and track your progress.',
  ]},
  { h: 'AI Interaction Data', body: [
    'Conversations with the AI tutor and prompts you submit may be processed and stored to provide responses, improve quality, and ensure safety. AI features are powered in part by third-party AI providers acting as our service providers. Do not share sensitive personal information in AI interactions.',
  ]},
  { h: 'Cookies and Analytics', body: [
    'We use cookies and similar technologies for authentication, preferences, and basic analytics to understand and improve usage.',
  ]},
  { h: 'Data Sharing with Service Providers', body: [
    'We share data with service providers (for example, hosting, payment processing, AI model providers, and email delivery) only as needed to operate the Platform, under appropriate safeguards. We do not sell your personal data.',
  ]},
  { h: 'Data Security', body: [
    'We use technical and organizational measures designed to protect your information. No method of transmission or storage is fully secure, and we cannot guarantee absolute security.',
  ]},
  { h: 'Your Rights', body: [
    'Depending on your location, you may have rights to access, correct, export, or delete your personal data, and to object to or restrict certain processing.',
    'To exercise any of these rights, email support@aladiahacademy.com from the address associated with your account. We respond to verified requests within the timelines required by applicable law.',
  ]},
  { h: 'International Users', body: [
    'Aladiah serves a global audience and your information may be processed in countries other than your own. We take steps intended to protect data consistent with this policy wherever it is processed.',
  ]},
  { h: 'Children and Minors', body: [
    'The Platform is intended for adults pursuing professional development and is not directed at children under 16. If you believe a minor has created an account, contact support@aladiahacademy.com and we will remove the account and its data.',
  ]},
  { h: 'Contact Information', body: [
    'Privacy questions and data requests can be directed to support@aladiahacademy.com or via the Contact page.',
  ]},
];

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      lastUpdated="July 2026 · Interim policy — subject to final legal review"
      intro="This Privacy Policy explains what information Aladiah Academy collects, how it is used, and the choices available to you. It is an interim policy published for our initial launch and remains subject to final legal review; material changes will be announced on this page."
      sections={SECTIONS}
    />
  );
}
