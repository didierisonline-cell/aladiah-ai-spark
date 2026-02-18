import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Lightbulb, X } from 'lucide-react';
import { BoardStory, BOARD_COLUMNS, PRIORITY_COLORS, EPIC_COLORS, TEAM_MEMBERS, SPRINT_SCHEDULE } from './SimulationTypes';
import TicketDetailModal from './TicketDetailModal';

interface JiraBoardProps {
  stories: BoardStory[];
  currentDay: number;
  onStoriesChange?: (stories: BoardStory[]) => void;
}

// Expected transitions per day for guidance
const DAY_EXPECTED_MOVES: Record<number, { storyPattern: string; from: string; to: string; reason: string }[]> = {
  1: [
    { storyPattern: 'NEB-101', from: 'Backlog', to: 'Ready', reason: 'Sprint Planning: critical VPC stories should be pulled into Ready.' },
    { storyPattern: 'NEB-102', from: 'Backlog', to: 'Ready', reason: 'Sprint Planning: IAM is a critical dependency — move to Ready.' },
    { storyPattern: 'NEB-112', from: 'Backlog', to: 'Ready', reason: 'Sprint Planning: network peering is a critical blocker.' },
    { storyPattern: 'NEB-111', from: 'Backlog', to: 'Ready', reason: 'Sprint Planning: acceptance criteria writing can start immediately.' },
  ],
  2: [
    { storyPattern: 'NEB-101', from: 'Ready', to: 'In Progress', reason: 'Day 2: Maya starts VPC provisioning after sprint planning.' },
    { storyPattern: 'NEB-102', from: 'Ready', to: 'In Progress', reason: 'Day 2: Priya begins IAM configuration.' },
    { storyPattern: 'NEB-111', from: 'Ready', to: 'In Progress', reason: 'Day 2: Aisha starts writing acceptance criteria.' },
  ],
  3: [
    { storyPattern: 'NEB-111', from: 'In Progress', to: 'Code Review', reason: 'Day 3: Acceptance criteria doc ready for PO review.' },
    { storyPattern: 'NEB-103', from: 'Backlog', to: 'Ready', reason: 'Day 3 Refinement: CI/CD pipeline should be refined and readied.' },
  ],
  4: [
    { storyPattern: 'NEB-101', from: 'In Progress', to: 'Code Review', reason: 'Day 4: VPC provisioning complete, needs peer review.' },
    { storyPattern: 'NEB-111', from: 'Code Review', to: 'Done', reason: 'Day 4: Acceptance criteria approved by PO.' },
    { storyPattern: 'NEB-103', from: 'Ready', to: 'In Progress', reason: 'Day 4: Carlos starts CI/CD pipeline work.' },
  ],
  5: [
    { storyPattern: 'NEB-101', from: 'Code Review', to: 'QA', reason: 'Mid-sprint audit: VPC should move to QA after review.' },
    { storyPattern: 'NEB-102', from: 'In Progress', to: 'Code Review', reason: 'Day 5: IAM policies complete, needs security review.' },
  ],
  6: [
    { storyPattern: 'NEB-101', from: 'QA', to: 'Ready for Release', reason: 'Day 6: VPC validated, ready for release.' },
    { storyPattern: 'NEB-104', from: 'Backlog', to: 'Ready', reason: 'Day 6 Refinement: Auth migration stories should be refined.' },
  ],
  7: [
    { storyPattern: 'NEB-101', from: 'Ready for Release', to: 'Done', reason: 'Stabilization: VPC story done, no new stories today.' },
    { storyPattern: 'NEB-102', from: 'Code Review', to: 'QA', reason: 'Day 7: IAM moves to QA for security validation.' },
  ],
  8: [
    { storyPattern: 'NEB-102', from: 'QA', to: 'Done', reason: 'Sprint Close: IAM story completed.' },
    { storyPattern: 'NEB-103', from: 'In Progress', to: 'Code Review', reason: 'Sprint Close: CI/CD pipeline ready for final review.' },
  ],
};

const MOVE_RULES: { check: (from: string, to: string) => boolean; lesson: string }[] = [
  {
    check: (from, to) => from === 'Backlog' && !['Ready', 'In Progress'].includes(to),
    lesson: '📚 Lesson: Stories should move from Backlog → Ready first. Skipping columns breaks flow visibility.',
  },
  {
    check: (from, to) => from === 'In Progress' && to === 'Done',
    lesson: '📚 Lesson: Stories should pass through Code Review and QA before Done. Skipping review stages introduces risk.',
  },
  {
    check: (from, to) => BOARD_COLUMNS.indexOf(to) < BOARD_COLUMNS.indexOf(from) && to !== 'Backlog' && to !== 'In Progress',
    lesson: '📚 Lesson: Moving stories backward may indicate rework. Consider documenting blockers in the ticket.',
  },
  {
    check: (from, to) => from === 'Ready' && to === 'Done',
    lesson: '📚 Lesson: A story can\'t go directly from Ready to Done — it needs development, review, and testing.',
  },
];

const JiraBoard = ({ stories, currentDay, onStoriesChange }: JiraBoardProps) => {
  const [selectedStory, setSelectedStory] = useState<BoardStory | null>(null);
  const [draggedStory, setDraggedStory] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [assistantTip, setAssistantTip] = useState<string | null>(null);

  const totalPoints = stories.reduce((s, st) => s + st.points, 0);
  const donePoints = stories.filter(s => s.status === 'Done').reduce((s, st) => s + st.points, 0);
  const inProgressCount = stories.filter(s => s.status === 'In Progress').length;

  const handleDragStart = (storyId: string) => {
    setDraggedStory(storyId);
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = useCallback((targetCol: string) => {
    if (!draggedStory) return;

    const story = stories.find(s => s.id === draggedStory);
    if (!story || story.status === targetCol) {
      setDraggedStory(null);
      setDragOverCol(null);
      return;
    }

    // Check for bad moves
    const violation = MOVE_RULES.find(rule => rule.check(story.status, targetCol));
    if (violation) {
      setAssistantTip(violation.lesson);
      setTimeout(() => setAssistantTip(null), 8000);
    }

    // Check if this matches expected day moves
    const expectedMoves = DAY_EXPECTED_MOVES[currentDay] || [];
    const matchesExpected = expectedMoves.some(
      m => story.id.startsWith(m.storyPattern) && m.to === targetCol
    );

    if (!violation && !matchesExpected && expectedMoves.length > 0) {
      const hint = expectedMoves.find(m => !stories.find(s => s.id.startsWith(m.storyPattern) && s.status === m.to));
      if (hint) {
        setAssistantTip(`💡 Tip: On Day ${currentDay}, consider moving ${hint.storyPattern} to "${hint.to}". ${hint.reason}`);
        setTimeout(() => setAssistantTip(null), 8000);
      }
    }

    // Apply the move
    const updated = stories.map(s =>
      s.id === draggedStory ? { ...s, status: targetCol } : s
    );

    if (onStoriesChange) {
      onStoriesChange(updated);
    }

    setDraggedStory(null);
    setDragOverCol(null);
  }, [draggedStory, stories, currentDay, onStoriesChange]);

  const handleSaveTicket = (updated: BoardStory) => {
    const newStories = stories.map(s => s.id === updated.id ? updated : s);
    if (onStoriesChange) onStoriesChange(newStories);
    setSelectedStory(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Board header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-display font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">N</span>
              Project Nebula — Sprint 21
            </h2>
            <p className="text-xs text-muted-foreground mt-1">AWS Cloud Migration • Day {currentDay}/8 • {SPRINT_SCHEDULE[currentDay - 1]?.weekday} — {SPRINT_SCHEDULE[currentDay - 1]?.description}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Velocity</p>
              <p className="font-bold text-primary">{donePoints}/{totalPoints} pts</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">In Flight</p>
              <p className="font-bold text-secondary">{inProgressCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Stories</p>
              <p className="font-bold">{stories.length}</p>
            </div>
          </div>
        </div>
        {/* Burndown mini bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalPoints > 0 ? (donePoints / totalPoints) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Assistant tip banner */}
      <AnimatePresence>
        {assistantTip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-accent/10 border-b flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground flex-1">{assistantTip}</p>
              <button onClick={() => setAssistantTip(null)} className="p-0.5 rounded hover:bg-muted">
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag instruction */}
      <div className="px-4 py-1.5 bg-muted/20 border-b">
        <p className="text-[10px] text-muted-foreground text-center">
          🖱️ Drag stories between columns to update status • Click a ticket to open details
        </p>
      </div>

      {/* Board columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 min-w-max h-full">
          {BOARD_COLUMNS.map(col => {
            const colStories = stories.filter(s => s.status === col);
            const colPoints = colStories.reduce((s, st) => s + st.points, 0);
            const isDragTarget = dragOverCol === col;
            return (
              <div
                key={col}
                className="w-56 flex-shrink-0 flex flex-col"
                onDragOver={(e) => handleDragOver(e, col)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(col)}
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{col}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {colStories.length} • {colPoints}pts
                  </span>
                </div>
                <div className={`flex-1 rounded-lg p-2 space-y-2 min-h-[200px] transition-colors duration-200 ${
                  isDragTarget ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/30'
                }`}>
                  {colStories.map((story, i) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: draggedStory === story.id ? 0.4 : 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      draggable
                      onDragStart={() => handleDragStart(story.id)}
                      onClick={() => setSelectedStory(story)}
                      className="bg-card rounded-lg p-3 border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[10px] font-mono font-bold text-primary">{story.id}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[story.priority] || ''}`}>
                          {story.priority}
                        </span>
                      </div>
                      <p className="text-xs font-medium leading-snug mb-2">{story.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${EPIC_COLORS[story.epic] || 'bg-muted'}`}>
                          {story.epic}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            {story.points} pts
                          </span>
                          <span className="text-sm" title={`${story.assignee} (${TEAM_MEMBERS[story.assignee]?.role || ''})`}>
                            {TEAM_MEMBERS[story.assignee]?.avatar || '👤'}
                          </span>
                        </div>
                      </div>
                      {/* Tags indicator */}
                      {story.ticketData?.tags && story.ticketData.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {story.ticketData.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                          ))}
                          {story.ticketData.tags.length > 3 && (
                            <span className="text-[8px] px-1 py-0.5 text-muted-foreground">+{story.ticketData.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {colStories.length === 0 && (
                    <div className={`text-center py-8 text-xs text-muted-foreground ${isDragTarget ? 'opacity-100' : 'opacity-50'}`}>
                      {isDragTarget ? 'Drop here' : 'No items'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket detail modal */}
      <AnimatePresence>
        {selectedStory && (
          <TicketDetailModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            onSave={handleSaveTicket}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JiraBoard;
