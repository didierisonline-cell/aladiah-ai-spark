// Class-flow content for the Professor Didier LIVE page (Foundations module of
// the AI-Powered Scrum Master Certification). Self-contained so the page has no
// external data dependency; can later be sourced from Supabase courses/chapters.

export interface LiveLessonBoard {
  headline: string;
  definition?: string;
  flow?: string[];
  points?: string[];
}

export interface LiveLesson {
  id: string;
  number: string;
  title: string;
  board: LiveLessonBoard;
  suggestions: string[];
  /** Short teaching focus injected into the professor's prompt for this lesson. */
  focus: string;
}

export interface LiveProgram {
  program: string;
  module: string;
  lessons: LiveLesson[];
}

export const SCRUM_CLASS: LiveProgram = {
  program: 'AI-Powered Scrum Master Certification',
  module: '1. Foundations of Scrum',
  lessons: [
    {
      id: 'what-is-scrum',
      number: '1.1',
      title: 'What Is Scrum?',
      focus:
        'What Scrum is: a lightweight empirical framework for delivering value in short Sprints, built on transparency, inspection, and adaptation.',
      board: {
        headline: 'What is Scrum?',
        definition: 'Scrum is a framework for developing, delivering, and sustaining complex products.',
        flow: ['Product Backlog', 'Sprint Planning', 'Daily Scrum', 'Sprint (1–4 wks)', 'Sprint Review', 'Sprint Retrospective'],
        points: [
          'Empirical: transparency, inspection, adaptation',
          'Work happens in short, fixed-length Sprints',
          'Deliver a usable Increment every Sprint',
        ],
      },
      suggestions: [
        'Explain Sprint Planning in detail',
        'Give me a real-world example',
        'Quiz me on Scrum Roles',
        "What's the difference between Scrum and Agile?",
      ],
    },
    {
      id: 'scrum-values',
      number: '1.2',
      title: 'Scrum Values',
      focus: 'The five Scrum Values — Commitment, Focus, Openness, Respect, Courage — and how they build trust.',
      board: {
        headline: 'The Five Scrum Values',
        definition: 'Values turn the mechanics of Scrum into a healthy way of working.',
        flow: ['Commitment', 'Focus', 'Openness', 'Respect', 'Courage'],
        points: ['Trust is the outcome when the values are lived', 'They guide behavior, decisions, and conflict'],
      },
      suggestions: [
        'Give an example of Courage on a team',
        'How do the values build trust?',
        'Quiz me on the Scrum Values',
        'What happens when Focus is missing?',
      ],
    },
    {
      id: 'scrum-roles',
      number: '1.3',
      title: 'Scrum Roles',
      focus: 'The three accountabilities: Product Owner (value), Scrum Master (effectiveness), Developers (the Increment).',
      board: {
        headline: 'One Team, Three Accountabilities',
        definition: 'The Scrum Team is small, cross-functional, and self-managing — no sub-teams, no hierarchy.',
        flow: ['Product Owner', 'Scrum Master', 'Developers'],
        points: [
          'Product Owner — maximizes value, owns the Product Backlog',
          'Scrum Master — fosters effectiveness, coaches team & org',
          'Developers — create a usable Increment each Sprint',
        ],
      },
      suggestions: [
        'What does a Scrum Master do all day?',
        'Is the Scrum Master a manager?',
        'Quiz me on the accountabilities',
        'How is a PO different from a Project Manager?',
      ],
    },
    {
      id: 'scrum-events',
      number: '1.4',
      title: 'Scrum Events',
      focus: 'The Sprint and its four events — Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective — as inspect-and-adapt points.',
      board: {
        headline: 'The Scrum Events',
        definition: 'Each event is timeboxed and reduces the need for meetings not defined in Scrum.',
        flow: ['Sprint Planning', 'Daily Scrum', 'Sprint Review', 'Sprint Retrospective'],
        points: ['The Sprint is the container for all other events', 'Every event is an inspect-and-adapt opportunity'],
      },
      suggestions: [
        'Walk me through Sprint Planning',
        'Why is the Daily Scrum only 15 minutes?',
        'Quiz me on the events',
        'Difference between Review and Retrospective?',
      ],
    },
    {
      id: 'scrum-artifacts',
      number: '1.5',
      title: 'Scrum Artifacts',
      focus: 'The three artifacts — Product Backlog, Sprint Backlog, Increment — and their commitments (Product Goal, Sprint Goal, Definition of Done).',
      board: {
        headline: 'Artifacts & Their Commitments',
        definition: 'Artifacts represent work or value; each commitment makes progress transparent.',
        flow: ['Product Backlog', 'Sprint Backlog', 'Increment'],
        points: ['Product Backlog → Product Goal', 'Sprint Backlog → Sprint Goal', 'Increment → Definition of Done'],
      },
      suggestions: [
        'Explain the Definition of Done',
        'Sprint Backlog vs Product Backlog?',
        'Quiz me on the artifacts',
        'What makes a good Product Goal?',
      ],
    },
  ],
};
