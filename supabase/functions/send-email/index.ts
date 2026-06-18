import { requireAdminOrServiceRole } from "../_shared/adminGuard.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'noreply@aladiahacademy.com';
const ADMIN_EMAIL = 'info@aladiahacademy.com';
const FROM_NAME = 'Aladiah Academy';

const translations: Record<string, any> = {
  en: {
    welcome_subject: '🎓 Welcome to Aladiah Academy — Solo Excelencia',
    welcome_body: (name: string) => `<h2>Welcome, ${name}.</h2><p>You just made one of the best decisions of your career.</p><p>At Aladiah Academy, we don't just teach certifications — we build professionals who lead, deliver, and dominate in the AI era.</p><p><strong>Your next step:</strong> Confirm your email and choose your first free course. Prof. Didier will be waiting.</p><p>Solo Excelencia — only excellence.</p><p>— Prof. Didier & The Aladiah Academy Team</p>`,
    confirmed_subject: '✅ Your Aladiah Academy account is active',
    confirmed_body: (name: string) => `<h2>${name}, you are confirmed.</h2><p>Your account is now active. Head to the portal, pick your course, and start your first lesson with Prof. Didier today.</p><p>Remember: consistency beats intensity. Show up every day.</p><p>Solo Excelencia.</p><p>— Prof. Didier</p>`,
    day1_subject: '📚 Day 1: Your AI-powered learning journey starts now',
    day1_body: (name: string) => `<h2>${name}, today is Day 1.</h2><p><strong>Today's AI insight for the DR & Africa:</strong></p><p>The Dominican Republic's digital transformation plan is accelerating. Companies across Santo Domingo are scrambling to find professionals who understand AI, data, and agile delivery. The same wave is hitting Abidjan, Dakar, and Nairobi.</p><p>You are positioning yourself ahead of that wave.</p><p><strong>Your action today:</strong> Complete your first lesson with Prof. Didier. 20 minutes. One changed trajectory.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Enter the Portal →</a><p>Solo Excelencia.</p>`,
    day3_subject: '🔥 Day 3 check-in: Are you still in the game?',
    day3_body: (name: string) => `<h2>${name}.</h2><p>3 days in. Most people quit by now. You have not.</p><p><strong>AI in Africa this week:</strong> Rwanda just announced a national AI strategy. Ghana is investing $50M in tech education. The continent is moving — and it needs professionals like you.</p><p>Every lesson you complete puts you ahead of 90% of the market.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Continue Learning →</a>`,
    day7_subject: '⚡ 1 week in — here is what separates winners',
    day7_body: (name: string) => `<h2>One week, ${name}.</h2><p>Winners show up on day 7. They show up on day 30. They show up when it is hard.</p><p><strong>This week in tech (DR & Africa):</strong> AI-powered fintech is exploding across West Africa. The DR is seeing its fastest digital banking growth in history. Every single one of these companies needs certified Scrum Masters, PMs, and AI-literate professionals.</p><p>That is you. Almost.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Unlock Full Access — $99.99/mo →</a>`,
    day14_subject: '🎯 2 weeks: This is your last free nudge',
    day14_body: (name: string) => `<h2>${name}, 2 weeks have passed.</h2><p>You started. You showed up. Prof. Didier is proud of that.</p><p>But your free access ends here. The full platform — 8 courses, AI tools, career coaching, certifications — is one step away.</p><p>Professionals with Scrum Master and PMP certifications earn $80K-$150K globally. Your ROI on $99.99/month is measured in years of career acceleration.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Join Now — $99.99/month →</a><p>Solo Excelencia. Always.</p><p>— Prof. Didier</p>`,
  },
  fr: {
    welcome_subject: '🎓 Bienvenue à Aladiah Academy — Solo Excelencia',
    welcome_body: (name: string) => `<h2>Bienvenue, ${name}.</h2><p>Vous venez de prendre l'une des meilleures décisions de votre carrière.</p><p>À Aladiah Academy, nous ne formons pas seulement aux certifications — nous construisons des professionnels qui dirigent, livrent et dominent dans l'ère de l'IA.</p><p><strong>Votre prochaine étape :</strong> Confirmez votre email et choisissez votre premier cours gratuit. Prof. Didier vous attend.</p><p>Solo Excelencia — seulement l'excellence.</p><p>— Prof. Didier & L'équipe Aladiah Academy</p>`,
    confirmed_subject: '✅ Votre compte Aladiah Academy est actif',
    confirmed_body: (name: string) => `<h2>${name}, vous êtes confirmé.</h2><p>Votre compte est maintenant actif. Rendez-vous sur le portail, choisissez votre cours et commencez votre première leçon avec Prof. Didier aujourd'hui.</p><p>Solo Excelencia.</p><p>— Prof. Didier</p>`,
    day1_subject: "📚 Jour 1 : Votre parcours d'apprentissage IA commence maintenant",
    day1_body: (name: string) => `<h2>${name}, aujourd'hui c'est le Jour 1.</h2><p><strong>Insight IA du jour pour l'Afrique :</strong></p><p>La transformation numérique s'accélère à travers l'Afrique francophone. Les entreprises à Abidjan, Dakar, Douala et Kinshasa cherchent des professionnels qui maîtrisent l'IA, les données et la livraison agile.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Accéder au Portail →</a>`,
    day3_subject: '🔥 Jour 3 : Êtes-vous toujours dans la course ?',
    day3_body: (name: string) => `<h2>${name}.</h2><p>3 jours. La plupart abandonnent maintenant. Pas vous.</p><p><strong>L'IA en Afrique cette semaine :</strong> Le Rwanda vient d'annoncer une stratégie nationale IA. Le Ghana investit 50M$ dans l'éducation technologique.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Continuer à Apprendre →</a>`,
    day7_subject: '⚡ 1 semaine — voici ce qui sépare les gagnants',
    day7_body: (name: string) => `<h2>Une semaine, ${name}.</h2><p>Les gagnants se présentent au jour 7. La fintech alimentée par l'IA explose en Afrique de l'Ouest. Chaque entreprise cherche des Scrum Masters et PMs certifiés.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Débloquer l'Accès Complet →</a>`,
    day14_subject: "🎯 2 semaines : C'est votre dernière relance gratuite",
    day14_body: (name: string) => `<h2>${name}, 2 semaines se sont écoulées.</h2><p>Votre accès gratuit s'arrête ici. La plateforme complète — 8 cours, outils IA, coaching carrière, certifications — est à un pas.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Rejoindre Maintenant — 99,99$/mois →</a><p>Solo Excelencia. Toujours. — Prof. Didier</p>`,
  },
  es: {
    welcome_subject: '🎓 Bienvenido a Aladiah Academy — Solo Excelencia',
    welcome_body: (name: string) => `<h2>Bienvenido, ${name}.</h2><p>Acabas de tomar una de las mejores decisiones de tu carrera.</p><p>En Aladiah Academy, no solo enseñamos certificaciones — construimos profesionales que lideran, entregan y dominan en la era de la IA.</p><p><strong>Tu próximo paso:</strong> Confirma tu email y elige tu primer curso gratuito. El Prof. Didier te está esperando.</p><p>Solo Excelencia.</p><p>— Prof. Didier & El equipo de Aladiah Academy</p>`,
    confirmed_subject: '✅ Tu cuenta de Aladiah Academy está activa',
    confirmed_body: (name: string) => `<h2>${name}, estás confirmado.</h2><p>Tu cuenta ya está activa. Ve al portal, elige tu curso y comienza tu primera lección con el Prof. Didier hoy.</p><p>Solo Excelencia.</p><p>— Prof. Didier</p>`,
    day1_subject: '📚 Día 1: Tu viaje de aprendizaje con IA comienza ahora',
    day1_body: (name: string) => `<h2>${name}, hoy es el Día 1.</h2><p><strong>Insight de IA del día para RD & África:</strong></p><p>La transformación digital de la República Dominicana se está acelerando. Las empresas en Santo Domingo buscan profesionales que entiendan IA, datos y entrega ágil.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Entrar al Portal →</a>`,
    day3_subject: '🔥 Día 3: ¿Sigues en el juego?',
    day3_body: (name: string) => `<h2>${name}.</h2><p>3 días. La mayoría se rinde ahora. Tú no.</p><p><strong>IA en África esta semana:</strong> Ruanda acaba de anunciar una estrategia nacional de IA. Ghana invierte $50M en educación tecnológica.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Continuar Aprendiendo →</a>`,
    day7_subject: '⚡ 1 semana — esto es lo que separa a los ganadores',
    day7_body: (name: string) => `<h2>Una semana, ${name}.</h2><p>Los ganadores se presentan el día 7. La fintech con IA explota en África Occidental. Cada empresa necesita Scrum Masters y PMs certificados.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Desbloquear Acceso Completo →</a>`,
    day14_subject: '🎯 2 semanas: Este es tu último recordatorio gratuito',
    day14_body: (name: string) => `<h2>${name}, han pasado 2 semanas.</h2><p>Tu acceso gratuito termina aquí. La plataforma completa — 8 cursos, herramientas IA, coaching de carrera, certificaciones — está a un paso.</p><a href="https://aladiahacademy.com/portal" style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:800;display:inline-block;margin-top:16px;">Unirse Ahora — $99.99/mes →</a><p>Solo Excelencia. Siempre. — Prof. Didier</p>`,
  },
};

const adminTemplates: Record<string, (d: any) => { subject: string; body: string }> = {
  new_registration: (d) => ({
    subject: `🆕 New Student Registration — ${d.name}`,
    body: `<h2>New Student Registered</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${d.name}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${d.email}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Tier</strong></td><td style="padding:8px;border:1px solid #ddd">${d.tier}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Language</strong></td><td style="padding:8px;border:1px solid #ddd">${d.language || 'en'}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Time</strong></td><td style="padding:8px;border:1px solid #ddd">${new Date().toISOString()}</td></tr></table>`,
  }),
  email_confirmed: (d) => ({
    subject: `✅ Student Email Confirmed — ${d.name}`,
    body: `<h2>Student Email Confirmed</h2><p><strong>${d.name}</strong> (${d.email}) has confirmed their email and is now active.</p><p>Tier: ${d.tier} | Language: ${d.language || 'en'}</p><p>Time: ${new Date().toISOString()}</p>`,
  }),
  free_course_completed: (d) => ({
    subject: `🔥 HOT LEAD — Free Course Completed: ${d.name}`,
    body: `<h2>🔥 Free Course Completed — Upgrade Opportunity</h2><p><strong>${d.name}</strong> (${d.email}) just completed their free Module 1 with Prof. Didier.</p><p>They have been shown the paywall. This is a HOT lead.</p><p>Course: ${d.course || 'Unknown'} | Language: ${d.language || 'en'}</p><p>Time: ${new Date().toISOString()}</p><p style="color:#f59e0b;font-weight:bold">Consider a personal follow-up email within 24 hours.</p>`,
  }),
  new_subscription: (d) => ({
    subject: `💰 New Subscription — ${d.name} — $99.99/month`,
    body: `<h2>New Paid Subscription</h2><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${d.name}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${d.email}</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Plan</strong></td><td style="padding:8px;border:1px solid #ddd">All-Access Pass — $99.99/month</td></tr><tr><td style="padding:8px;border:1px solid #ddd"><strong>Time</strong></td><td style="padding:8px;border:1px solid #ddd">${new Date().toISOString()}</td></tr></table><p style="color:green;font-weight:bold">Monthly recurring revenue increased by $99.99!</p>`,
  }),
};

const wrapEmail = (body: string) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px"><tr><td><table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><tr><td style="background:linear-gradient(135deg,#0a0f1e,#0d1b3e);padding:32px;text-align:center"><h1 style="color:#f59e0b;margin:0;font-size:24px;letter-spacing:0.05em">ALADIAH ACADEMY</h1><p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:11px;letter-spacing:0.2em">SOLO EXCELENCIA</p></td></tr><tr><td style="padding:32px;color:#333;font-size:15px;line-height:1.6">${body}</td></tr><tr><td style="background:#f9f9f9;padding:20px;text-align:center;color:#999;font-size:12px"><p style="margin:0">© 2026 Aladiah Academy · Santo Domingo, Dominican Republic</p><p style="margin:4px 0 0"><a href="https://aladiahacademy.com" style="color:#f59e0b">aladiahacademy.com</a></p></td></tr></table></td></tr></table></body></html>`;

async function sendEmail(to: string, subject: string, body: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: [to], subject, html: wrapEmail(body) }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }
  const authError = await requireAdminOrServiceRole(req);
  if (authError) return authError;
  try {
    const { type, student, lang = 'en' } = await req.json();
    const t = translations[lang] || translations.en;
    const name = student?.name || 'Student';
    const email = student?.email;

    switch (type) {
      case 'welcome':
        await sendEmail(email, t.welcome_subject, t.welcome_body(name));
        await sendEmail(ADMIN_EMAIL, adminTemplates.new_registration(student).subject, adminTemplates.new_registration(student).body);
        break;
      case 'confirmed':
        await sendEmail(email, t.confirmed_subject, t.confirmed_body(name));
        await sendEmail(ADMIN_EMAIL, adminTemplates.email_confirmed(student).subject, adminTemplates.email_confirmed(student).body);
        break;
      case 'day1':
        await sendEmail(email, t.day1_subject, t.day1_body(name));
        break;
      case 'day3':
        await sendEmail(email, t.day3_subject, t.day3_body(name));
        break;
      case 'day7':
        await sendEmail(email, t.day7_subject, t.day7_body(name));
        break;
      case 'day14':
        await sendEmail(email, t.day14_subject, t.day14_body(name));
        break;
      case 'free_course_completed':
        await sendEmail(ADMIN_EMAIL, adminTemplates.free_course_completed(student).subject, adminTemplates.free_course_completed(student).body);
        break;
      case 'new_subscription':
        await sendEmail(ADMIN_EMAIL, adminTemplates.new_subscription(student).subject, adminTemplates.new_subscription(student).body);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400 });
    }
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
});
