/**
 * Hardcoded-English heuristic scanner.
 *
 * Walks the given roots (src/pages, src/components by default) and flags strings
 * that look like user-facing English but are NOT routed through the `t()` i18n
 * helper. This is deliberately a *heuristic* triage tool, not a compiler — it
 * over-reports rather than miss real gaps, and its output is a worklist for the
 * Global Language Adaptation Agent, not a hard build gate.
 *
 * Two signals:
 *   1. JSX text nodes:        `>Some English words<`
 *   2. User-facing props:     title="..."  label="..."  placeholder="..."
 *                             alt="..."     aria-label="..."
 *
 * A line is skipped when it already calls `t(` (already internationalized).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { HardcodedFinding, HardcodedReport } from './types';

const PROP_RE = /\b(title|label|placeholder|alt|aria-label)\s*=\s*"([^"]{3,})"/g;
const JSX_TEXT_RE = />\s*([A-Z][A-Za-z][^<>{}]{2,})</g;
// Looks like real prose: has a letter, a space or multiple words, not code-ish.
const LOOKS_ENGLISH = /[A-Za-z].*[A-Za-z]/;
const SKIP_VALUE = /^(https?:|#|\/|\{|\$|[A-Z_]+$|[a-z]+\.[a-z.]+$)/;

function listFiles(root: string, exts: string[]): string[] {
  const out: string[] = [];
  let entries: string[] = [];
  try {
    entries = readdirSync(root);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(root, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      out.push(...listFiles(full, exts));
    } else if (exts.some((e) => name.endsWith(e)) && !name.includes('.bak')) {
      out.push(full);
    }
  }
  return out;
}

function flag(value: string): boolean {
  const v = value.trim();
  if (v.length < 3) return false;
  if (SKIP_VALUE.test(v)) return false;
  if (!LOOKS_ENGLISH.test(v)) return false;
  return true;
}

export function scanHardcoded(
  roots: string[],
  exts: string[] = ['.tsx', '.jsx'],
): HardcodedReport {
  const findings: HardcodedFinding[] = [];
  const files = roots.flatMap((r) => listFiles(r, exts));

  for (const file of files) {
    let text: string;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('t(')) return; // already internationalized on this line
      for (const m of line.matchAll(PROP_RE)) {
        if (flag(m[2])) {
          findings.push({ file, line: i + 1, sample: m[2].slice(0, 80), reason: 'string_prop' });
        }
      }
      for (const m of line.matchAll(JSX_TEXT_RE)) {
        if (flag(m[1])) {
          findings.push({ file, line: i + 1, sample: m[1].trim().slice(0, 80), reason: 'jsx_text' });
        }
      }
    });
  }

  const byFile: Record<string, number> = {};
  for (const f of findings) byFile[f.file] = (byFile[f.file] ?? 0) + 1;

  return {
    scannedFiles: files.length,
    totalFindings: findings.length,
    byFile,
    findings,
  };
}
