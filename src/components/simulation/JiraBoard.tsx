import { motion } from 'framer-motion';
import { BoardStory, BOARD_COLUMNS, PRIORITY_COLORS, EPIC_COLORS, TEAM_MEMBERS } from './SimulationTypes';

interface JiraBoardProps {
  stories: BoardStory[];
  currentDay: number;
}

const JiraBoard = ({ stories, currentDay }: JiraBoardProps) => {
  const totalPoints = stories.reduce((s, st) => s + st.points, 0);
  const donePoints = stories.filter(s => s.status === 'Done').reduce((s, st) => s + st.points, 0);
  const inProgressCount = stories.filter(s => s.status === 'In Progress').length;

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
            <p className="text-xs text-muted-foreground mt-1">AWS Cloud Migration • Day {currentDay}/8</p>
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

      {/* Board columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 min-w-max h-full">
          {BOARD_COLUMNS.map(col => {
            const colStories = stories.filter(s => s.status === col);
            const colPoints = colStories.reduce((s, st) => s + st.points, 0);
            return (
              <div key={col} className="w-56 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{col}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {colStories.length} • {colPoints}pts
                  </span>
                </div>
                <div className="flex-1 bg-muted/30 rounded-lg p-2 space-y-2 min-h-[200px]">
                  {colStories.map((story, i) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-lg p-3 border shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-primary">{story.id}</span>
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
                    </motion.div>
                  ))}
                  {colStories.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted-foreground opacity-50">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JiraBoard;
