import LegalShell, { DS } from './LegalShell';

// Draft placeholder copy — structural only. Requires Founder/legal review.
const CARDS = [
  { icon: '✉️', title: 'General Contact', desc: 'Questions about Aladiah Academy, programs, or the platform.', placeholder: 'Email pending Founder confirmation' },
  { icon: '🎓', title: 'Admissions Inquiry', desc: 'Enrollment, eligibility, pricing, and how to get started.', placeholder: 'Admissions email pending Founder confirmation' },
  { icon: '🛟', title: 'Support Inquiry', desc: 'Account access, technical issues, billing, and learning help.', placeholder: 'Support email pending Founder confirmation' },
  { icon: '🤝', title: 'Business & Employer Partnerships', desc: 'Hiring from our talent network, employer programs, and institutional partnerships.', placeholder: 'Partnerships email pending Founder confirmation' },
];

export default function Contact() {
  return (
    <LegalShell
      title="Contact Us"
      lastUpdated="Pending review"
      intro="We’d love to hear from you. Choose the channel that best fits your inquiry. Contact details below are placeholders pending Founder/legal confirmation before public launch."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {CARDS.map((c, i) => (
          <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '0.7rem', padding: '1.25rem' }}>
            <div style={{ fontSize: 24, marginBottom: '0.5rem' }}>{c.icon}</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: DS.fg, margin: '0 0 0.35rem' }}>{c.title}</h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: DS.fm, margin: '0 0 0.75rem' }}>{c.desc}</p>
            <div style={{ fontSize: 12, color: DS.gold, background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem' }}>
              {c.placeholder}
            </div>
          </div>
        ))}
      </div>

      <section style={{ background: DS.card, border: `1px dashed ${DS.gb}`, borderRadius: '0.7rem', padding: '1.25rem' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: DS.gold, margin: '0 0 0.5rem' }}>⚠️ Founder / Legal Review Required</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: DS.fm, margin: 0 }}>
          Before public launch, confirm and publish: official contact email address(es), the registered business
          mailing address, support hours/SLA, and the legal entity name to display. Aladiah Management SRL details
          must be verified for accuracy. Until confirmed, no contact email or physical address is published here.
        </p>
      </section>
    </LegalShell>
  );
}
