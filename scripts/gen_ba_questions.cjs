// Generates the BA question-tagging migration from authored sources.
// Sources: the 200-question seed function (courseData) + 8 gap-question .md files.
// Output: idempotent SQL inserting into quiz_questions, competency at insert.
// Not committed; the emitted .sql (reviewable) is the deliverable.
const fs = require('fs');
const path = require('path');

const ROOT = '/home/user/aladiah-ai-spark';
const SEED = path.join(ROOT, 'supabase/functions/seed-business-analysis-course/index.ts');
const QDIR = path.join(ROOT, 'docs/curriculum/business-analyst-v1/questions');

// ---- 1. Extract courseData object literal from the seed function (string-aware brace scan)
function extractCourseData(src) {
  const start = src.indexOf('const courseData = {');
  const open = src.indexOf('{', start);
  let depth = 0, i = open, inStr = false, q = '';
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === q) inStr = false;
    } else {
      if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    }
  }
  const literal = src.slice(open, i);
  // eval as a JS expression (pure data: strings/numbers/arrays/objects)
  return eval('(' + literal + ')');
}

// ---- 2. Competency per OLD lesson (moduleIdx0..7, lessonIdx0..4) -> ba: slug (coverage doc §1)
const SLUG = [
  ['requirements','requirements','requirements','facilitation','ai-analysis'],         // M1
  ['elicitation','stakeholders','requirements','requirements','elicitation'],          // M2
  ['process-analysis','process-analysis','requirements','process-analysis','ai-analysis'], // M3
  ['product-thinking','product-discovery','product-thinking','requirements','product-thinking'], // M4
  ['process-analysis','solution-eval','product-thinking','solution-eval','solution-eval'], // M5
  ['data-analysis','data-analysis','data-analysis','data-analysis','ai-analysis'],     // M6
  ['stakeholders','business-architecture','product-thinking','facilitation','business-architecture'], // M7
  ['requirements','requirements','career','career','ai-analysis'],                     // M8 (8.3/8.4 career=drop)
];
// ---- Routing: OLD (moduleIdx, lessonIdx) -> NEW module number (1..15). 'career' => 0 (drop)
const ROUTE = [
  [1,2,2,5,1],   // M1 lessons
  [4,3,6,6,4],   // M2
  [7,7,6,7,13],  // M3
  [9,10,9,6,9],  // M4
  [7,12,9,12,12],// M5
  [11,11,11,11,13], // M6
  [3,8,9,5,8],   // M7
  [6,2,0,0,13],  // M8
];

// ---- 3. Gap files: slug + target NEW module
const GAP = {
  'ba-compliance.md':              { slug:'compliance',             mod:14 },
  'ba-ai-prompting.md':            { slug:'ai-prompting',           mod:13 },
  'ba-product-discovery.md':       { slug:'product-discovery',      mod:10 },
  'ba-business-architecture.md':   { slug:'business-architecture',  mod:8  },
  'ba-ai-analysis-deepening.md':   { slug:'ai-analysis',            mod:13 },
  'ba-elicitation-deepening.md':   { slug:'elicitation',            mod:4  },
  'ba-facilitation-deepening.md':  { slug:'facilitation',           mod:5  },
  'ba-stakeholders-deepening.md':  { slug:'stakeholders',           mod:3  },
};

// collected[newModuleNumber] = [ {q, opts[4], a, exp, slug} ]
const collected = {}; for (let m=1;m<=15;m++) collected[m]=[];

// ---- parse seed
const seed = extractCourseData(fs.readFileSync(SEED,'utf8'));
seed.modules.forEach((mod, mi) => {
  (mod.lessons||[]).forEach((les, li) => {
    const slug = SLUG[mi] && SLUG[mi][li];
    const target = ROUTE[mi] && ROUTE[mi][li];
    if (!slug || slug==='career' || !target) return;
    (les.questions||[]).forEach(qq => {
      collected[target].push({ q:qq.q, opts:qq.opts, a:qq.a, exp:qq.exp||'', slug });
    });
  });
});

// ---- parse gap md files
function parseGap(file, slug) {
  const txt = fs.readFileSync(path.join(QDIR,file),'utf8');
  const blocks = txt.split(/(?=^\*\*Q\d+\s)/m).filter(b=>/^\*\*Q\d+\s/.test(b));
  const out = [];
  for (const b of blocks) {
    const lines = b.split('\n');
    const aIdx = lines.findIndex(l=>/^\*\*a:\s*\d/.test(l));
    if (aIdx < 0) continue;
    const aLine = lines[aIdx];
    const a = parseInt(aLine.match(/^\*\*a:\s*(\d)/)[1],10);
    const exp = (aLine.match(/—\s*\*(.+?)\*\s*$/)||[,''])[1] || '';
    // the 4 real options are the contiguous numbered lines immediately above the a: line
    // (a question stem may itself contain a numbered list, so don't grab those).
    const optIdxs = [];
    for (let k=aIdx-1; k>=0 && optIdxs.length<4; k--){
      if (/^[1-4]\.\s/.test(lines[k])) optIdxs.unshift(k);
      else if (optIdxs.length>0) break; // stop once the contiguous option block ends
    }
    const opts = optIdxs.map(k=>lines[k].replace(/^[1-4]\.\s/,'').trim());
    // question text = non-blank lines between the header and the first option line
    const firstOpt = optIdxs.length ? optIdxs[0] : aIdx;
    const qtext = lines.slice(1, firstOpt).map(l=>l.trim()).filter(Boolean);
    if (opts.length===4 && qtext.length) out.push({ q:qtext.join(' '), opts, a, exp, slug });
  }
  return out;
}
for (const [file, info] of Object.entries(GAP)) {
  const qs = parseGap(file, info.slug);
  collected[info.mod].push(...qs);
}

// ---- 3b. Deterministic option shuffle (legacy bank is ~100% index-1 → trivially
//      gameable; UI does NOT shuffle at render). Seeded so the migration is reproducible.
function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
let _seed = 0;
function shuffleQ(q){
  const rnd = mulberry32(0x9E3779B9 ^ (_seed++ * 2654435761));
  const pairs = q.opts.map((o,i)=>({o, correct:i===q.a}));
  for (let i=pairs.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [pairs[i],pairs[j]]=[pairs[j],pairs[i]]; }
  q.opts = pairs.map(p=>p.o);
  q.a = pairs.findIndex(p=>p.correct);
  return q;
}
for (let m=1;m<=15;m++) collected[m] = collected[m].map(shuffleQ);

// ---- 4. emit SQL
const esc = s => String(s).replace(/'/g, "''");
const COURSE = 'AI Business Analyst & Product Discovery Specialist';
let sql = `-- =============================================================================
-- Publish BA flagship QUESTIONS into chapter_end exams. Competency at insert.
-- Governed by docs/standards/PUBLISH_LAYER.md ; contract: PUBLISH_MANIFEST.md.
-- Sources: seed-business-analysis-course (200 Qs, re-tagged to ba: §7 slugs) +
--   docs/curriculum/business-analyst-v1/questions/*.md (authored gap questions).
-- GENERATED FILE — do not hand-edit; regenerate from the authored sources.
-- Idempotent: only inserts a module's questions when its chapter_end quiz is empty.
-- REVIEWABLE SQL — apply by hand after the structure migration.
-- =============================================================================

CREATE OR REPLACE FUNCTION pg_temp.fill_ba_exam(p_mod int, p_payload jsonb)
RETURNS void LANGUAGE plpgsql AS $fn$
DECLARE cid uuid; ch uuid; qz uuid; rec jsonb; i int := 0;
BEGIN
  SELECT id INTO cid FROM public.courses
    WHERE title = '${esc(COURSE)}' AND curriculum_version = 'ba-v1';
  SELECT id INTO ch FROM public.chapters WHERE course_id = cid AND order_index = p_mod;
  SELECT id INTO qz FROM public.quizzes WHERE chapter_id = ch AND quiz_type = 'chapter_end';
  IF qz IS NULL THEN RAISE NOTICE 'no exam for module %', p_mod; RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.quiz_questions WHERE quiz_id = qz) THEN RETURN; END IF;
  FOR rec IN SELECT * FROM jsonb_array_elements(p_payload) LOOP
    i := i + 1;
    INSERT INTO public.quiz_questions
      (quiz_id, question_text, options, correct_answer_index, explanation,
       order_index, competency, translations)
    VALUES (qz, rec->>'q', rec->'opts', (rec->>'a')::int, rec->>'exp',
       i, rec->>'competency', '{}'::jsonb);
  END LOOP;
END;
$fn$;

`;

let totalQ = 0;
const counts = {};
for (let m=1;m<=15;m++){
  const arr = collected[m];
  counts[m] = arr.length;
  totalQ += arr.length;
  if (!arr.length) continue;
  const payload = arr.map(x => ({
    q: x.q, opts: x.opts, a: x.a, exp: x.exp, competency: 'ba:'+x.slug
  }));
  // build jsonb literal safely via escaped JSON string
  const json = JSON.stringify(payload);
  sql += `-- Module ${m}: ${arr.length} questions\n`;
  sql += `SELECT pg_temp.fill_ba_exam(${m}, '${esc(json)}'::jsonb);\n\n`;
}

sql += `DROP FUNCTION pg_temp.fill_ba_exam(int, jsonb);\n\n`;
sql += `-- VERIFICATION (expect 0 untagged; per-module counts below):\n`;
sql += `-- SELECT ch.order_index, count(qq.*) AS questions,\n`;
sql += `--   count(*) FILTER (WHERE qq.competency IS NULL OR qq.competency='') AS untagged\n`;
sql += `-- FROM public.chapters ch JOIN public.courses c ON c.id=ch.course_id\n`;
sql += `--   JOIN public.quizzes q ON q.chapter_id=ch.id AND q.quiz_type='chapter_end'\n`;
sql += `--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id=q.id\n`;
sql += `-- WHERE c.title='${esc(COURSE)}' AND c.curriculum_version='ba-v1'\n`;
sql += `-- GROUP BY ch.order_index ORDER BY ch.order_index;\n`;

fs.writeFileSync(path.join(ROOT,'supabase/migrations/20260621010000_publish_ba_questions.sql'), sql);

// report
console.log('Per-module question counts:');
for (let m=1;m<=15;m++) console.log(`  M${m}: ${counts[m]}`);
console.log('TOTAL questions:', totalQ);
const modulesWithQs = Object.values(counts).filter(c=>c>0).length;
console.log('Modules with >=1 question:', modulesWithQs, '/ 15');
console.log('Modules with >=10 questions:', Object.values(counts).filter(c=>c>=10).length, '/ 15');
