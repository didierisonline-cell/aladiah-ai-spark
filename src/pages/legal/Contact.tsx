import LegalShell, { DS } from './LegalShell';

const SUPPORT_EMAIL = 'support@aladiahacademy.com';

const CARDS = [
  { icon: '✉️', title: 'General Contact', desc: 'Questions about Aladiah Academy, programs, or the platform.', subject: 'General Inquiry' },
  { icon: '🎓', title: 'Admissions Inquiry', desc: 'Enrollment, eligibility, pricing, and how to get started.', subject: 'Admissions Inquiry' },
  { icon: '🛟', title: 'Support Inquiry', desc: 'Account access, technical issues, billing, and learning help.', subject: 'Support Request' },
  { icon: '🤝', title: 'Business & Employer Partnerships', desc: 'Employer programs and institutional partnerships.', subject: 'Partnership Inquiry' },
];

export default function Contact() {
  return (
    <LegalShell
      title="Contact Us"
      lastUpdated="July 2026"
      intro="We'd love to hear from you. All inquiries are answered from a single support inbox — choose the subject that best fits yours."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {CARDS.map((c, i) => (
          <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '0.7rem', padding: '1.25rem' }}>
            <div style={{ fontSize: 24, marginBottom: '0.5rem' }}>{c.icon}</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DS.fg, margin: '0 0 0.35rem' }}>{c.title}</h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: DS.fm, margin: '0 0 0.75rem' }}>{c.desc}</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(c.subject)}`}
              style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: DS.gold, background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem', textDecoration: 'none' }}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        ))}
      </div>

      <section style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '0.7rem', padding: '1.25rem' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: DS.fg, margin: '0 0 0.5rem' }}>Response Times</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: DS.fm, margin: 0 }}>
          We aim to respond to all inquiries within 2 business days. For account or billing issues, include the
          email address associated with your Aladiah account so we can help you faster.
        </p>
      </section>
    </LegalShell>
  );
}
