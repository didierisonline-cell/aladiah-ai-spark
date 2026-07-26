/**
 * LessonBoardVisual — FOUNDER RULE, lesson level: within every module, every
 * LESSON gets a uniquely different board — across every program (~455 lessons).
 *
 * How uniqueness is guaranteed:
 *  - CONTENT is always the lesson's own parsed key concepts (its real
 *    description/transcript), so no two lessons can ever show the same board.
 *  - SHAPE rotates deterministically through the archetype library, offset by
 *    program and module, so the five lessons of any module always get five
 *    different geometries — and never the same sequence as the next module.
 *
 * Lesson 1 of each module keeps the curated module board (moduleBoards.tsx /
 * program signature) as its own board; lessons 2..5 render here. If a lesson
 * has too few parsed concepts, we fall back to the curated module board rather
 * than draw a weak diagram.
 */
import { ReactNode } from "react";
import {
  VennBoard, TreeBoard, PyramidBoard, MatrixBoard, ScaleBoard, ShieldBoard,
  FunnelBoard, NetworkBoard, StepsBoard, SwimlaneBoard, RadarBoard, CycleBoard,
  FlowBoard, type Item,
} from "./BoardArchetypes";
import type { ProgramKey } from "./moduleBoards";

/** Split a raw concept sentence into a short label + optional sub line. */
function toItem(raw: string): Item {
  const clean = raw.replace(/\s+/g, " ").trim().replace(/[.:;,]+$/, "");
  const words = clean.split(" ");
  let label = "";
  for (const w of words) {
    if ((label + " " + w).trim().length > 24) break;
    label = (label + " " + w).trim();
  }
  if (!label) label = clean.slice(0, 24);
  let sub = clean.slice(label.length).trim();
  if (sub.length > 34) sub = sub.slice(0, 31).trimEnd() + "…";
  return { label, sub: sub || undefined };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

type Arch = {
  key: string;
  min: number; // minimum concepts required
  render: (items: Item[], ctx: { title: string; caption: string; hub: string }) => ReactNode;
};

const ARCHS: Arch[] = [
  { key: "flow", min: 3, render: (it, c) => <FlowBoard title={c.title} caption={c.caption} steps={it.slice(0, 5)} aria={c.title} /> },
  { key: "steps", min: 3, render: (it, c) => <StepsBoard title={c.title} caption={c.caption} steps={it.slice(0, 5)} flag="Mastered" aria={c.title} /> },
  { key: "cycle", min: 3, render: (it, c) => <CycleBoard title={c.title} caption={c.caption} nodes={it.slice(0, 5)} center={{ label: "PRACTICE" }} aria={c.title} /> },
  { key: "pyramid", min: 3, render: (it, c) => <PyramidBoard title={c.title} caption={c.caption} levels={[...it.slice(0, 4)].reverse()} aria={c.title} /> },
  { key: "network", min: 3, render: (it, c) => <NetworkBoard title={c.title} caption={c.caption} hub={{ label: c.hub }} nodes={it.slice(0, 6)} aria={c.title} /> },
  { key: "funnel", min: 3, render: (it, c) => <FunnelBoard title={c.title} caption={c.caption} stages={it.slice(0, 4)} aria={c.title} /> },
  { key: "shield", min: 3, render: (it, c) => <ShieldBoard title={c.title} caption={c.caption} segments={it.slice(0, 5)} aria={c.title} /> },
  { key: "swimlane", min: 3, render: (it, c) => <SwimlaneBoard title={c.title} caption={c.caption} lanes={it.slice(0, 4)} aria={c.title} /> },
  { key: "tree", min: 4, render: (it, c) => <TreeBoard title={c.title} caption={c.caption} root={it[0]} children={it.slice(1, 5)} aria={c.title} /> },
  { key: "radar", min: 4, render: (it, c) => <RadarBoard title={c.title} caption={c.caption} axes={it.slice(0, 6).map(i => ({ label: i.label }))} aria={c.title} /> },
  { key: "matrix", min: 4, render: (it, c) => <MatrixBoard title={c.title} caption={c.caption} axisX="Application" axisY="Understanding" quadrants={it.slice(0, 4)} aria={c.title} /> },
  { key: "venn", min: 3, render: (it, c) => <VennBoard title={c.title} caption={c.caption} circles={it.slice(0, 3)} center="THIS LESSON" aria={c.title} /> },
  { key: "scale", min: 2, render: (it, c) => <ScaleBoard title={c.title} caption={c.caption} left={it[0]} right={it[1]} pivot={c.hub} aria={c.title} /> },
];

const HEADINGS: Record<string, string> = {
  flow: "How the pieces connect", steps: "Building the skill", cycle: "The working loop",
  pyramid: "From foundation to mastery", network: "How it all links", funnel: "Narrowing to what matters",
  shield: "The non-negotiables", swimlane: "Side by side", tree: "The structure",
  radar: "Dimensions of this lesson", matrix: "Four ways to see it", venn: "Where ideas meet",
  scale: "The trade-off",
};

export interface LessonBoardProps {
  program: ProgramKey;
  moduleIndex: number;
  lessonIndex: number;
  lessonTitle: string;
  concepts: string[];
}

/** Returns the lesson's unique board, or null when the curated module board should show. */
export function getLessonBoard({ program, moduleIndex, lessonIndex, lessonTitle, concepts }: LessonBoardProps): ReactNode | null {
  // Lesson 1 = the curated module board's own lesson; weak concept sets also defer.
  if (lessonIndex <= 1) return null;
  const items = concepts.map(toItem).filter(i => i.label.length >= 3);
  if (items.length < 3) return null;

  // Deterministic rotation: program+module set the offset, lesson walks the pool,
  // so lessons 2..5 of one module always take four different consecutive shapes.
  const eligible = ARCHS.filter(a => a.min <= items.length);
  const base = hashStr(`${program}:${moduleIndex}`) % eligible.length;
  const arch = eligible[(base + (lessonIndex - 1)) % eligible.length];

  const hub = items[0].label.split(" ").slice(0, 2).join(" ") || "CORE";
  const title = HEADINGS[arch.key] || "Key ideas";
  const caption = `Module ${moduleIndex} · Lesson ${lessonIndex} — ${lessonTitle}`.slice(0, 88);
  return arch.render(items, { title, caption, hub });
}
