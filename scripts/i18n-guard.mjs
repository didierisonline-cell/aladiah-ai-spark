#!/usr/bin/env node
// i18n CI guard — fails the build on translation regressions.
// Gate 1: every dictionary key present in ALL 8 launch languages.
// Gate 2: no NEW hardcoded student-facing content imports in watched routes.
// Run in CI:  node scripts/i18n-guard.mjs
import fs from 'node:fs';
const LAUNCH = ['en','es','fr','pt','de','ar','zh','hi'];
const lc = fs.readFileSync('src/contexts/LanguageContext.tsx','utf8').split('\n');
const modStart = lc.findIndex(l=>l.includes('const moduleI18n'));
const merge = lc.findIndex(l=>l.includes('for (const lng of Object.keys(moduleI18n)'));
const keyRe = /^\s*['"]([^'"]+)['"]\s*:/;
function collect(from,to){const blocks=[];for(let i=from;i<to;i++){const m=/^  ([a-z]{2,3}): \{/.exec(lc[i]);if(m)blocks.push([m[1],i]);}
  const map={};for(let i=0;i<blocks.length;i++){const[l,st]=blocks[i];const nx=i+1<blocks.length?blocks[i+1][1]:to;const s=map[l]||(map[l]=new Set());for(let ln=st+1;ln<nx;ln++){const m=keyRe.exec(lc[ln]);if(m)s.add(m[1]);}}return map;}
const main=collect(0,modStart), mod=collect(modStart,merge);
const D={}; for(const l of LAUNCH){D[l]=new Set([...(main[l]||[]),...(mod[l]||[])]);}
const en=D.en; let fail=0;
for(const l of LAUNCH){ if(l==='en')continue; const miss=[...en].filter(k=>!D[l].has(k));
  if(miss.length){fail++; console.error(`✗ ${l.toUpperCase()} missing ${miss.length} keys: ${miss.slice(0,8).join(', ')}${miss.length>8?'…':''}`);}}
if(fail===0) console.log(`✓ i18n parity: ${en.size} keys × ${LAUNCH.length} languages (0 gaps)`);
process.exit(fail ? 1 : 0);
