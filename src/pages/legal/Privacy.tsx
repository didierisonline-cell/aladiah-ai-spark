import LegalShell, { LegalSection } from './LegalShell';

// Draft placeholder copy — structural only. Requires Founder/legal review.
const SECTIONS: LegalSection[] = [
  { h: 'Information We Collect', body: [
    'We collect information you provide directly, information generated as you use the Platform, and limited technical information from your device.',
    '[Placeholder — full categories of collected data pending review.]',
  ]},
  { h: 'Account Data', body: [
    'When you create an account we collect identifiers such as your name, email address, and authentication details needed to provide and secure your account.',
  ]},
  { h: 'Payment Data (via Stripe)', body: [
    'Payments are processed by Stripe. We do not store full card numbers on our servers; Stripe handles card data under its own security and privacy practices. We retain limited records such as transaction status and plan information.',
    '[Placeholder — payment data retention specifics pending review.]',
  ]},
  { h: 'Learning Progress Data', body: [
    'We store your course enrollments, lesson progress, assessment attempts and scores, and related learning activity to deliver the educational service and track your progress.',
  ]},
  { h: 'AI Interaction Data', body: [
    'Conversations with the AI tutor and prompts you submit may be processed and stored to provide responses, improve quality, and ensure safety. Do not share sensitive personal information in AI interactions.',
    '[Placeholder — AI data processing, retention, and any third-party model providers pending review.]',
  ]},
  { h: 'Cookies and Analytics', body: [
    'We use cookies and similar technologies for authentication, preferences, and basic analytics to understand and improve usage.',
    '[Placeholder — cookie categories and analytics providers pending review.]',
  ]},
  { h: 'Data Sharing with Service Providers', body: [
    'We share data with service providers (for example, hosting, payment processing, and email delivery) only as needed to operate the Platform, under appropriate safeguards. We do not sell your personal data.',
    '[Placeholder — list of processors and safeguards pending review.]',
  ]},
  { h: 'Data Security', body: [
    'We use technical and organizational measures designed to protect your information. No method of transmission or storage is fully secure, and we cannot guarantee absolute security.',
  ]},
  { h: 'Your Rights', body: [
    'Depending on your location, you may have rights to access, correct, export, or delete your personal data, and to object to or restrict certain processing.',
    '[Placeholder — how to exercise rights and response timelines pending review.]',
  ]},
  { h: 'International Users', body: [
    'Aladiah serves a global audience and your information may be processed in countries other than your own. We take steps intended to protect data consistent with this policy wherever it is processed.',
    '[Placeholder — cross-border transfer mechanisms pending review.]',
  ]},
  { h: 'Children and Minors', body: [
    '[Placeholder — minimum age, parental consent, and handling of minors’ data to be confirmed by Founder/legal before launch.]',
  ]},
  { h: 'Contact Information', body: [
    'Privacy questions can be directed to us via the Contact page.',
    '[Placeholder — official privacy contact email, data-protection contact, and registered address pending Founder/legal confirmation before launch.]',
  ]},
];

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      lastUpdated="Pending review"
      intro="This Privacy Policy explains what information Aladiah Academy collects, how it is used, and the choices available to you. This is a working draft published for structural review and is not yet the final, binding policy."
      sections={SECTIONS}
    />
  );
}
