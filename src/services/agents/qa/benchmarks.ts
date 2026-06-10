// =============================================================================
// QA Agent — benchmark authorities the QA Agent measures Aladiah against.
// The QA Agent is the Academic Quality & Employability Authority; it anchors
// every artifact to world-class external standards.
// =============================================================================
import { BenchmarkAuthority } from '@/types/qa';

export const BENCHMARK_AUTHORITIES: BenchmarkAuthority[] = [
  { id: 'scrum_org', name: 'Scrum.org', domains: ['scrum', 'assessment', 'certification'] },
  { id: 'pmi', name: 'PMI', domains: ['project', 'certification', 'curriculum'] },
  { id: 'safe', name: 'SAFe', domains: ['scrum', 'scaling', 'curriculum'] },
  { id: 'icagile', name: 'ICAgile', domains: ['scrum', 'agile-coaching', 'curriculum'] },
  { id: 'google', name: 'Google (Career Certificates)', domains: ['curriculum', 'employability', 'career'] },
  { id: 'microsoft', name: 'Microsoft Learn', domains: ['curriculum', 'ai', 'lab'] },
  { id: 'aws', name: 'AWS Skill Builder', domains: ['lab', 'certification', 'cloud'] },
  { id: 'meta', name: 'Meta (Professional Certificates)', domains: ['curriculum', 'employability'] },
  { id: 'coursera', name: 'Coursera', domains: ['curriculum', 'student-experience', 'website'] },
  { id: 'linkedin_learning', name: 'LinkedIn Learning', domains: ['curriculum', 'employability', 'market'] },
  { id: 'harvard_online', name: 'Harvard Online', domains: ['curriculum', 'pedagogy', 'student-experience'] },
  { id: 'mit_open', name: 'MIT Open Learning', domains: ['curriculum', 'pedagogy', 'project'] },
];

/** Which benchmark authorities are most relevant to an artifact area/type. */
export function relevantBenchmarks(domain: string): BenchmarkAuthority[] {
  const hits = BENCHMARK_AUTHORITIES.filter((b) => b.domains.includes(domain));
  // Always include the broad pedagogy/employability anchors.
  const broad = BENCHMARK_AUTHORITIES.filter((b) =>
    b.domains.some((d) => ['curriculum', 'employability', 'pedagogy'].includes(d)),
  );
  return Array.from(new Set([...hits, ...broad]));
}
