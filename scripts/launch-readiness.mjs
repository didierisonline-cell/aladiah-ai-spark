#!/usr/bin/env node
// Launch-readiness reporter for the Scrum flagship. Run server-side:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/launch-readiness.mjs
// Produces per-language coverage % + missing assets + blocking issues for:
// course title/description, module titles, lesson titles, lesson content, transcript,
// quiz, capstone. NO assumptions — reads live rows.
const URL=process.env.SUPABASE_URL, KEY=process.env.SUPABASE_SERVICE_ROLE_KEY;
const LANGS=['es','fr','pt','de','ar','zh','hi'];
if(!URL||!KEY){console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');process.exit(1);}
const H={apikey:KEY,Authorization:`Bearer ${KEY}`};
const get=async p=>{const r=await fetch(`${URL}/rest/v1/${p}`,{headers:H});if(!r.ok)throw new Error(p+': '+r.status);return r.json();};
const nonEmpty=(o,l,f)=>!!(o?.translations?.[l]?.[f]?.toString().trim());

const course=(await get(`courses?select=id,title,translations&is_flagship=eq.true&limit=1`))[0];
if(!course){console.error('No flagship course found — apply migrations first.');process.exit(1);}
const chapters=await get(`chapters?select=id,order_index,translations&course_id=eq.${course.id}&order=order_index`);
const chIds=chapters.map(c=>c.id).join(',');
const videos=await get(`videos?select=id,chapter_id,translations&chapter_id=in.(${chIds})`);
const quizzes=await get(`quizzes?select=id,chapter_id,quiz_type&chapter_id=in.(${chIds})`);
const capChapter=chapters.find(c=>c.order_index===18);
console.log(`Flagship: "${course.title}" — ${chapters.length} modules, ${videos.length} lessons, ${quizzes.length} quizzes\n`);
console.log('LANG | course | modules | lessons | content | transcript | capstone | overall');
for(const l of LANGS){
  const courseOK = nonEmpty(course,l,'title') && nonEmpty(course,l,'description');
  const mod = chapters.filter(c=>nonEmpty(c,l,'title')).length, modT=chapters.length;
  const lesT=videos.filter(v=>nonEmpty(v,l,'title')).length;
  const lesC=videos.filter(v=>nonEmpty(v,l,'description')).length;
  const tr=videos.filter(v=>nonEmpty(v,l,'transcript')).length;
  const cap = capChapter ? (nonEmpty(capChapter,l,'title')?1:0) : 0;
  const pct=n=>modT?Math.round(100*n/modT):0;
  const overall=Math.round(((courseOK?1:0)*100 + pct(mod) + (videos.length?100*lesT/videos.length:0) + (videos.length?100*lesC/videos.length:0) + (videos.length?100*tr/videos.length:0))/5);
  console.log(`${l.toUpperCase()} | ${courseOK?'100%':'0%'} | ${pct(mod)}% (${mod}/${modT}) | ${videos.length?Math.round(100*lesT/videos.length):0}% | ${videos.length?Math.round(100*lesC/videos.length):0}% | ${videos.length?Math.round(100*tr/videos.length):0}% | ${cap?'Y':'N'} | ~${overall}%`);
}
console.log('\nBlocking issues:');
if(videos.length<72) console.log(`  • lessons ${videos.length}/72 — apply lessons migration`);
if(quizzes.length<18) console.log(`  • quizzes ${quizzes.length}/18 — apply quizzes migration`);
console.log('  • quiz_questions translations not covered by translate-content (extend before AR/ZH question localization)');
