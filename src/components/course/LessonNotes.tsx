import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StickyNote, Plus, Trash2, X, Clock } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  timestamp: number; // progress percentage when note was created
  createdAt: Date;
}

interface LessonNotesProps {
  videoId: string;
  currentProgress: number;
  isVisible: boolean;
  onClose: () => void;
}

const LessonNotes = ({ videoId, currentProgress, isVisible, onClose }: LessonNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`notes-${videoId}`);
    if (stored) {
      setNotes(JSON.parse(stored).map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })));
    }
  }, [videoId]);

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`notes-${videoId}`, JSON.stringify(notes));
    }
  }, [notes, videoId]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      text: newNote.trim(),
      timestamp: currentProgress,
      createdAt: new Date(),
    };
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-card border rounded-xl overflow-hidden shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm">My Notes</span>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
            {notes.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Add note */}
      <div className="p-3 border-b flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a note at this moment..."
          className="h-8 text-xs"
        />
        <Button onClick={addNote} size="icon" className="h-8 w-8 shrink-0" disabled={!newNote.trim()}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <StickyNote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No notes yet. Add one above!</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="group p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs leading-relaxed flex-1">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  at {note.timestamp}% • {note.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LessonNotes;
