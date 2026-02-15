import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookmarkPlus, Bookmark, FileText, X } from 'lucide-react';

interface TranscriptPanelProps {
  script: string;
  isVisible: boolean;
  onClose: () => void;
  currentProgress: number;
  onSeekTo?: (percent: number) => void;
}

interface BookmarkItem {
  id: string;
  text: string;
  position: number; // percentage through script
  label: string;
}

const TranscriptPanel = ({ script, isVisible, onClose, currentProgress }: TranscriptPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Split script into paragraphs
  const paragraphs = script.split('\n\n').filter(p => p.trim());

  // Highlight search matches
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/40 text-accent-foreground rounded px-0.5">{part}</mark>
      ) : part
    );
  };

  const matchCount = searchQuery.trim()
    ? paragraphs.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase())).length
    : 0;

  const addBookmark = (paragraphIndex: number) => {
    const text = paragraphs[paragraphIndex].substring(0, 60) + '...';
    const position = Math.round((paragraphIndex / paragraphs.length) * 100);
    const bookmark: BookmarkItem = {
      id: `bm-${Date.now()}`,
      text,
      position,
      label: `Bookmark ${bookmarks.length + 1}`,
    };
    setBookmarks(prev => [...prev, bookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Auto-scroll to approximate position based on progress
  useEffect(() => {
    if (scrollRef.current && currentProgress > 0 && !searchQuery) {
      const scrollHeight = scrollRef.current.scrollHeight;
      const target = (currentProgress / 100) * scrollHeight;
      scrollRef.current.scrollTo({ top: target - 100, behavior: 'smooth' });
    }
  }, [Math.floor(currentProgress / 10)]); // update every 10%

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
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Transcript</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={showBookmarks ? 'default' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            className="h-8 pl-8 text-xs"
          />
        </div>
        {searchQuery && (
          <p className="text-[10px] text-muted-foreground mt-1">
            {matchCount} match{matchCount !== 1 ? 'es' : ''} found
          </p>
        )}
      </div>

      {/* Bookmarks */}
      {showBookmarks && bookmarks.length > 0 && (
        <div className="px-3 py-2 border-b bg-accent/5 space-y-1 max-h-32 overflow-y-auto">
          {bookmarks.map(bm => (
            <div key={bm.id} className="flex items-center gap-2 text-xs group">
              <Bookmark className="w-3 h-3 text-accent flex-shrink-0" />
              <span className="truncate flex-1">{bm.text}</span>
              <button
                onClick={() => removeBookmark(bm.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Transcript body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {paragraphs.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Transcript will appear when the lesson starts.
          </p>
        ) : (
          paragraphs.map((para, i) => {
            const isVisible = !searchQuery || para.toLowerCase().includes(searchQuery.toLowerCase());
            if (!isVisible) return null;

            return (
              <div key={i} className="group relative">
                <p className="text-xs leading-relaxed text-muted-foreground hover:text-foreground transition-colors">
                  {highlightText(para)}
                </p>
                <button
                  onClick={() => addBookmark(i)}
                  className="absolute -left-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Bookmark this section"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-accent" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default TranscriptPanel;
