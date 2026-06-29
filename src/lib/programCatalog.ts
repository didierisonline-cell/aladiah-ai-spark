// ============================================================================
// programCatalog — localized DISPLAY NAMES for the standard program/course catalog
// ============================================================================
// Why this exists: course/program titles were leaking English (and, for the
// flagship, a stale French DB title) into every other UI language because the
// only localized source was courses.translations — which is unpopulated in prod
// for most languages. The resolver then fell back to the English/base title.
//
// This catalog is a CODE-LEVEL fallback layer of human-authored display names in
// all 8 launch languages, keyed by the canonical English title AND by every
// localized value + known stale aliases (so a course whose DB base title is still
// French/Spanish is matched by that value and re-rendered in the SELECTED
// language). DB translations still win when present; this only fills the gap.
//
// Protected tokens kept verbatim inside titles: Scrum, DevOps, MLOps, UX, AI/IA/KI
// (AI is localized to the language's accepted form per the platform style guide:
//  es/fr "IA", de "KI", ar "الذكاء الاصطناعي", zh/hi keep "AI"/"एआई").
// ============================================================================

import type { LaunchLang } from './i18nData';

export interface ProgramNames {
  /** canonical English title (the catalog key) */
  en: string;
  es: string; fr: string; pt: string; de: string; ar: string; zh: string; hi: string;
  /** extra titles (e.g. stale DB names) that should map to this entry */
  aliases?: string[];
}

// One entry per program. en is canonical; the 7 translations follow the platform
// role-title style guide. Order is irrelevant — lookup is by normalized value.
export const PROGRAM_CATALOG: ProgramNames[] = [
  { en: 'AI Cloud Engineer', es: 'Ingeniero de Nube con IA', fr: 'Ingénieur Cloud IA', pt: 'Engenheiro de Nuvem com IA', de: 'KI-Cloud-Ingenieur', ar: 'مهندس السحابة بالذكاء الاصطناعي', zh: 'AI云工程师', hi: 'एआई क्लाउड इंजीनियर' },
  { en: 'AI Agent Engineer', es: 'Ingeniero de Agentes de IA', fr: 'Ingénieur d’Agents IA', pt: 'Engenheiro de Agentes de IA', de: 'KI-Agenten-Ingenieur', ar: 'مهندس وكلاء الذكاء الاصطناعي', zh: 'AI智能体工程师', hi: 'एआई एजेंट इंजीनियर' },
  { en: 'AI Data Engineer', es: 'Ingeniero de Datos con IA', fr: 'Ingénieur Data IA', pt: 'Engenheiro de Dados com IA', de: 'KI-Dateningenieur', ar: 'مهندس بيانات الذكاء الاصطناعي', zh: 'AI数据工程师', hi: 'एआई डेटा इंजीनियर' },
  { en: 'AI DevOps Engineer', es: 'Ingeniero DevOps con IA', fr: 'Ingénieur DevOps IA', pt: 'Engenheiro DevOps com IA', de: 'KI-DevOps-Ingenieur', ar: 'مهندس DevOps بالذكاء الاصطناعي', zh: 'AI DevOps工程师', hi: 'एआई DevOps इंजीनियर' },
  { en: 'AI Security Engineer', es: 'Ingeniero de Seguridad con IA', fr: 'Ingénieur Sécurité IA', pt: 'Engenheiro de Segurança com IA', de: 'KI-Sicherheitsingenieur', ar: 'مهندس أمن الذكاء الاصطناعي', zh: 'AI安全工程师', hi: 'एआई सुरक्षा इंजीनियर' },
  { en: 'AI MLOps Engineer', es: 'Ingeniero MLOps con IA', fr: 'Ingénieur MLOps IA', pt: 'Engenheiro MLOps com IA', de: 'KI-MLOps-Ingenieur', ar: 'مهندس MLOps بالذكاء الاصطناعي', zh: 'AI MLOps工程师', hi: 'एआई MLOps इंजीनियर' },
  { en: 'AI Platform Engineer', es: 'Ingeniero de Plataforma con IA', fr: 'Ingénieur Plateforme IA', pt: 'Engenheiro de Plataforma com IA', de: 'KI-Plattform-Ingenieur', ar: 'مهندس منصات الذكاء الاصطناعي', zh: 'AI平台工程师', hi: 'एआई प्लेटफ़ॉर्म इंजीनियर' },
  { en: 'AI Governance Professional', es: 'Profesional de Gobernanza de IA', fr: 'Professionnel de la Gouvernance IA', pt: 'Profissional de Governança de IA', de: 'KI-Governance-Fachkraft', ar: 'محترف حوكمة الذكاء الاصطناعي', zh: 'AI治理专业人员', hi: 'एआई गवर्नेंस पेशेवर' },
  { en: 'AI Product Manager', es: 'Gerente de Producto de IA', fr: 'Chef de Produit IA', pt: 'Gerente de Produto de IA', de: 'KI-Produktmanager', ar: 'مدير منتجات الذكاء الاصطناعي', zh: 'AI产品经理', hi: 'एआई प्रोडक्ट मैनेजर' },
  { en: 'AI Business Analyst', es: 'Analista de Negocios con IA', fr: 'Analyste Métier IA', pt: 'Analista de Negócios com IA', de: 'KI-Business-Analyst', ar: 'محلل أعمال الذكاء الاصطناعي', zh: 'AI业务分析师', hi: 'एआई बिज़नेस विश्लेषक', aliases: ['AI Business Analyst & Product Discovery Specialist'] },
  { en: 'AI Solutions Consultant', es: 'Consultor de Soluciones de IA', fr: 'Consultant en Solutions IA', pt: 'Consultor de Soluções de IA', de: 'KI-Lösungsberater', ar: 'استشاري حلول الذكاء الاصطناعي', zh: 'AI解决方案顾问', hi: 'एआई समाधान सलाहकार' },
  { en: 'AI Sales Engineer', es: 'Ingeniero de Ventas con IA', fr: 'Ingénieur Commercial IA', pt: 'Engenheiro de Vendas com IA', de: 'KI-Vertriebsingenieur', ar: 'مهندس مبيعات الذكاء الاصطناعي', zh: 'AI销售工程师', hi: 'एआई सेल्स इंजीनियर' },
  { en: 'AI Transformation Manager', es: 'Gerente de Transformación con IA', fr: 'Responsable de Transformation IA', pt: 'Gerente de Transformação com IA', de: 'KI-Transformationsmanager', ar: 'مدير التحول بالذكاء الاصطناعي', zh: 'AI转型经理', hi: 'एआई ट्रांसफ़ॉर्मेशन मैनेजर' },
  { en: 'AI Enterprise Architect', es: 'Arquitecto Empresarial de IA', fr: 'Architecte d’Entreprise IA', pt: 'Arquiteto Empresarial de IA', de: 'KI-Unternehmensarchitekt', ar: 'مهندس معماري مؤسسي للذكاء الاصطناعي', zh: 'AI企业架构师', hi: 'एआई एंटरप्राइज आर्किटेक्ट' },
  { en: 'AI Program Manager', es: 'Gerente de Programas de IA', fr: 'Responsable de Programme IA', pt: 'Gerente de Programas de IA', de: 'KI-Programm-Manager', ar: 'مدير برامج الذكاء الاصطناعي', zh: 'AI项目集经理', hi: 'एआई प्रोग्राम मैनेजर' },
  { en: 'AI Business Operations', es: 'Operaciones de Negocio con IA', fr: 'Opérations Métier IA', pt: 'Operações de Negócio com IA', de: 'KI-Geschäftsbetrieb', ar: 'عمليات الأعمال بالذكاء الاصطناعي', zh: 'AI业务运营', hi: 'एआई बिज़नेस ऑपरेशंस' },
  { en: 'Responsible AI Specialist', es: 'Especialista en IA Responsable', fr: 'Spécialiste en IA Responsable', pt: 'Especialista em IA Responsável', de: 'Spezialist für Verantwortungsvolle KI', ar: 'أخصائي الذكاء الاصطناعي المسؤول', zh: '负责任AI专家', hi: 'ज़िम्मेदार एआई विशेषज्ञ' },
  { en: 'AI Compliance Officer', es: 'Responsable de Cumplimiento de IA', fr: 'Responsable Conformité IA', pt: 'Responsável de Conformidade de IA', de: 'KI-Compliance-Beauftragter', ar: 'مسؤول امتثال الذكاء الاصطناعي', zh: 'AI合规官', hi: 'एआई अनुपालन अधिकारी' },
  { en: 'AI Risk Manager', es: 'Gerente de Riesgos de IA', fr: 'Responsable des Risques IA', pt: 'Gerente de Riscos de IA', de: 'KI-Risikomanager', ar: 'مدير مخاطر الذكاء الاصطناعي', zh: 'AI风险经理', hi: 'एआई जोखिम मैनेजर' },
  { en: 'AI Auditor', es: 'Auditor de IA', fr: 'Auditeur IA', pt: 'Auditor de IA', de: 'KI-Auditor', ar: 'مدقق الذكاء الاصطناعي', zh: 'AI审计师', hi: 'एआई ऑडिटर' },
  { en: 'AI Policy Designer', es: 'Diseñador de Políticas de IA', fr: 'Concepteur de Politiques IA', pt: 'Designer de Políticas de IA', de: 'KI-Richtliniengestalter', ar: 'مصمم سياسات الذكاء الاصطناعي', zh: 'AI政策设计师', hi: 'एआई नीति डिज़ाइनर' },
  { en: 'AI Ethics Specialist', es: 'Especialista en Ética de IA', fr: 'Spécialiste en Éthique IA', pt: 'Especialista em Ética de IA', de: 'KI-Ethik-Spezialist', ar: 'أخصائي أخلاقيات الذكاء الاصطناعي', zh: 'AI伦理专家', hi: 'एआई नैतिकता विशेषज्ञ' },
  { en: 'AI UX Designer', es: 'Diseñador UX con IA', fr: 'Concepteur UX IA', pt: 'Designer UX com IA', de: 'KI-UX-Designer', ar: 'مصمم تجربة المستخدم بالذكاء الاصطناعي', zh: 'AI用户体验设计师', hi: 'एआई UX डिज़ाइनर' },
  { en: 'Conversation Designer', es: 'Diseñador de Conversaciones', fr: 'Concepteur Conversationnel', pt: 'Designer de Conversação', de: 'Konversationsdesigner', ar: 'مصمم المحادثات', zh: '对话设计师', hi: 'संवाद डिज़ाइनर' },
  { en: 'Human-AI Interaction Specialist', es: 'Especialista en Interacción Humano-IA', fr: 'Spécialiste en Interaction Humain-IA', pt: 'Especialista em Interação Humano-IA', de: 'Spezialist für Mensch-KI-Interaktion', ar: 'أخصائي التفاعل بين الإنسان والذكاء الاصطناعي', zh: '人机交互专家', hi: 'मानव-एआई इंटरैक्शन विशेषज्ञ' },
  { en: 'AI Workflow Designer', es: 'Diseñador de Flujos de Trabajo con IA', fr: 'Concepteur de Flux de Travail IA', pt: 'Designer de Fluxos de Trabalho com IA', de: 'KI-Workflow-Designer', ar: 'مصمم سير العمل بالذكاء الاصطناعي', zh: 'AI工作流设计师', hi: 'एआई वर्कफ़्लो डिज़ाइनर' },
  { en: 'AI Experience Architect', es: 'Arquitecto de Experiencia con IA', fr: 'Architecte d’Expérience IA', pt: 'Arquiteto de Experiência com IA', de: 'KI-Experience-Architekt', ar: 'مهندس تجربة الذكاء الاصطناعي', zh: 'AI体验架构师', hi: 'एआई एक्सपीरियंस आर्किटेक्ट' },
  // ── Flagship: keyed by the new canonical EN title; aliases catch the stale
  //    DB titles (French certification name, older English names) so any of them
  //    re-render in the selected language. ──
  {
    en: 'AI Enterprise Scrum Master & Agile Transformation Leader',
    es: 'Scrum Master Empresarial con IA y Líder de Transformación Ágil',
    fr: 'Scrum Master d’Entreprise avec IA et Leader de Transformation Agile',
    pt: 'Scrum Master Empresarial com IA e Líder de Transformação Ágil',
    de: 'KI Enterprise Scrum Master & Agile Transformation Leader',
    ar: 'قائد التحول الرشيق وسكرم ماستر مؤسسي بالذكاء الاصطناعي',
    zh: 'AI企业级Scrum Master与敏捷转型领导者',
    hi: 'एआई एंटरप्राइज स्क्रम मास्टर और एजाइल ट्रांसफॉर्मेशन लीडर',
    aliases: [
      'Certification Professionnelle Scrum Master avec IA',
      'AI Scrum Master Professional Certification',
      'AI Scrum Master Professional Certification v1.0',
      'AI Scrum Master & Agile Transformation Leader',
      'AI Scrum Master',
      'Scrum Master',
    ],
  },
];

const norm = (s: string): string =>
  (s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[™®]/g, '');

// normalized value → entry. Built from en + 7 translations + aliases so a course
// row in ANY language resolves to the same entry.
const INDEX = new Map<string, ProgramNames>();
for (const e of PROGRAM_CATALOG) {
  for (const v of [e.en, e.es, e.fr, e.pt, e.de, e.ar, e.zh, e.hi, ...(e.aliases ?? [])]) {
    if (v) INDEX.set(norm(v), e);
  }
}

/**
 * Localize a program/course title to `language` using the static catalog.
 * Returns null when the title isn't a known catalog program (caller then keeps
 * its own DB/English fallback). Matches by canonical English, any localized
 * value, or a known stale alias.
 */
export function localizeProgramTitle(rawTitle: string | null | undefined, language: string): string | null {
  if (!rawTitle) return null;
  const entry = INDEX.get(norm(rawTitle));
  if (!entry) return null;
  return (entry as Record<string, string>)[language] || entry.en;
}

/** True when the title belongs to a known catalog program. */
export function isCatalogProgram(rawTitle: string | null | undefined): boolean {
  return !!rawTitle && INDEX.has(norm(rawTitle));
}

export const PROGRAM_CATALOG_LANGS: LaunchLang[] = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'zh', 'hi'];
