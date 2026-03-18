import { motion } from 'framer-motion';
import founderPhoto from '@/assets/founder-photo.png';
import bettynaPhoto from '@/assets/professors/bettyna.jpg';
import charlyPhoto from '@/assets/professors/charly.jpg';
import juanCarlosPhoto from '@/assets/professors/juan-carlos.jpg';
import mariaPhoto from '@/assets/professors/maria.webp';

const team = [
  {
    name: 'Prof. Didier',
    title: 'Founder & Lead Mentor',
    origin: 'Denver, CO',
    role: 'Agile · Scrum · PM Strategy',
    bio: 'Visionary behind Aladiah Academy. Project Manager with deep expertise in Agile transformation, global team leadership, and AI-powered education.',
    photo: founderPhoto,
    color: '#085041',
    bg: '#E1F5EE',
    border: '#1D9E75',
  },
  {
    name: 'Bettyna',
    title: 'Career Advisor',
    origin: 'Brazil',
    role: 'Career Strategy · Coaching · Growth',
    bio: 'Passionate career coach who helps students unlock their full potential, navigate career transitions, and land roles that align with their purpose.',
    photo: bettynaPhoto,
    color: '#3C3489',
    bg: '#EEEDFE',
    border: '#534AB7',
  },
  {
    name: 'Charly',
    title: 'Interview Coach',
    origin: 'Germany',
    role: 'Interview Prep · Behavioral · STAR',
    bio: 'A natural coach with a competitive spirit shaped by years of ping pong and mentoring youth. Charly turns nervous candidates into confident performers.',
    photo: charlyPhoto,
    color: '#712B13',
    bg: '#FAECE7',
    border: '#D85A30',
  },
  {
    name: 'Juan Carlos',
    title: 'Resume Builder',
    origin: 'Santo Domingo, DR',
    role: 'Resume · ATS · Employer Mindset',
    bio: 'Former recruiter who spent 6 years on the other side of the table. Juan Carlos knows exactly what employers want — and builds resumes that get noticed.',
    photo: juanCarlosPhoto,
    color: '#633806',
    bg: '#FAEEDA',
    border: '#BA7517',
  },
  {
    name: 'Maria',
    title: 'Scrum Expert',
    origin: 'Colombia',
    role: 'Scrum · SAFe · Agile Ceremonies',
    bio: 'Trained in France, shaped by Latin America\'s fast-moving tech scene. Maria brings structure, energy, and deep Agile knowledge to every session.',
    photo: mariaPhoto,
    color: '#0C447C',
    bg: '#E6F1FB',
    border: '#185FA5',
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.03),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
          >
            <span className="text-sm font-medium text-secondary">Meet Your AI Professors</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            The Team Behind Aladiah
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Five AI-powered mentors. Five unique backgrounds. One mission — to get you hired.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-border hover:shadow-large transition-all duration-500"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, transparent 50%, ${member.bg}ee 100%)`,
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: member.border, color: '#fff' }}
                >
                  {member.origin}
                </div>
              </div>

              {/* Content */}
              <div className="p-6" style={{ background: member.bg }}>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: member.color }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: member.border }}
                >
                  {member.title}
                </p>
                <p
                  className="text-xs font-medium mb-3 opacity-70"
                  style={{ color: member.color }}
                >
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: member.color, opacity: 0.85 }}>
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
