import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, MessageSquare, Tag, Calendar, Users, Layers, GitBranch, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoardStory, StoryTicketData, StoryComment, TEAM_MEMBERS, PRIORITY_COLORS, EPIC_COLORS, BOARD_COLUMNS } from './SimulationTypes';

interface TicketDetailModalProps {
  story: BoardStory;
  onClose: () => void;
  onSave: (updated: BoardStory) => void;
}

const TAG_OPTIONS = ['backend', 'frontend', 'infra', 'security', 'blocker', 'tech-debt', 'spike', 'automation'];

const TicketDetailModal = ({ story, onClose, onSave }: TicketDetailModalProps) => {
  const [ticket, setTicket] = useState<StoryTicketData>(story.ticketData || {
    fixVersion: 'v2.1.0', platform: 'AWS', team: 'Nebula Core', sprint: 'Sprint 21',
    dueDate: '', tags: [], comments: [], notes: '',
  });
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [status, setStatus] = useState(story.status);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: StoryComment = {
      id: `c-${Date.now()}`,
      author: 'Scrum Master (You)',
      text: newComment.trim(),
      timestamp: new Date().toLocaleString(),
    };
    setTicket(prev => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment('');
  };

  const toggleTag = (tag: string) => {
    setTicket(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const addCustomTag = () => {
    if (!newTag.trim() || ticket.tags.includes(newTag.trim())) return;
    setTicket(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
    setNewTag('');
  };

  const handleSave = () => {
    onSave({ ...story, status, ticketData: ticket });
    onClose();
  };

  const member = TEAM_MEMBERS[story.assignee];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="bg-card border rounded-xl shadow-2xl w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{story.id}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[story.priority] || ''}`}>
                {story.priority}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${EPIC_COLORS[story.epic] || 'bg-muted'}`}>
                {story.epic}
              </span>
            </div>
            <h2 className="text-lg font-display font-bold leading-tight">{story.title}</h2>
            {story.description && (
              <p className="text-sm text-muted-foreground mt-1">{story.description}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Main - left 2/3 */}
          <div className="md:col-span-2 border-r">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-5 pt-2">
                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                <TabsTrigger value="comments" className="text-xs flex items-center gap-1">
                  Comments
                  {ticket.comments.length > 0 && (
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 rounded-full">{ticket.comments.length}</span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Fix Version</label>
                    <Input
                      value={ticket.fixVersion}
                      onChange={e => setTicket(prev => ({ ...prev, fixVersion: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
                    <Input
                      value={ticket.platform}
                      onChange={e => setTicket(prev => ({ ...prev, platform: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Team</label>
                    <Input
                      value={ticket.team}
                      onChange={e => setTicket(prev => ({ ...prev, team: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Sprint</label>
                    <Input
                      value={ticket.sprint}
                      onChange={e => setTicket(prev => ({ ...prev, sprint: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <Input
                      type="date"
                      value={ticket.dueDate}
                      onChange={e => setTicket(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Story Points</label>
                    <div className="h-8 flex items-center">
                      <span className="text-sm font-bold text-primary">{story.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {TAG_OPTIONS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          ticket.tags.includes(tag)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Custom tag..."
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                      className="h-7 text-xs flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={addCustomTag} className="h-7 text-xs px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-5">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Personal Notes (saved locally)
                </label>
                <Textarea
                  value={ticket.notes}
                  onChange={e => setTicket(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add your observations, blockers, or action items here..."
                  className="min-h-[200px] text-sm"
                />
              </TabsContent>

              <TabsContent value="comments" className="p-5 space-y-4">
                {/* Existing comments */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {ticket.comments.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">No comments yet</p>
                  )}
                  {ticket.comments.map(c => (
                    <div key={c.id} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{c.author}</span>
                        <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                      </div>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  ))}
                </div>
                {/* Add comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addComment()}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                    <MessageSquare className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - right 1/3 */}
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {BOARD_COLUMNS.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Assignee
              </label>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <span className="text-lg">{member?.avatar || '👤'}</span>
                <div>
                  <p className="text-xs font-semibold">{story.assignee}</p>
                  <p className="text-[10px] text-muted-foreground">{member?.role}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Epic
              </label>
              <div className={`text-xs px-2 py-1.5 rounded ${EPIC_COLORS[story.epic] || 'bg-muted'}`}>
                {story.epic}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> Fix Version
              </label>
              <p className="text-xs font-medium">{ticket.fixVersion}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sprint
              </label>
              <p className="text-xs font-medium">{ticket.sprint}</p>
            </div>

            {ticket.tags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Labels</label>
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map(t => (
                    <Badge key={t} variant="secondary" className="text-[10px] px-1.5">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-3 h-3 mr-1" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketDetailModal;
