import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getProgressColor } from '@/hooks/useProgress';
import { MessageCircle, Send, Sparkles, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name: string;
  author_progress: number;
}

interface Post {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  user_id: string;
  author_name: string;
  author_progress: number;
  replies: Reply[];
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onReplyAdded: () => void;
}

const PostCard = ({ post, currentUserId, onReplyAdded }: PostCardProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const nameColor = getProgressColor(post.author_progress);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('community_replies').insert({
        post_id: post.id,
        user_id: currentUserId,
        content: replyText.trim(),
      });
      if (error) throw error;
      setReplyText('');
      onReplyAdded();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const typeIcon = post.post_type === 'intro' ? (
    <Sparkles className="w-4 h-4 text-accent" />
  ) : post.post_type === 'question' ? (
    <HelpCircle className="w-4 h-4 text-secondary" />
  ) : null;

  const progressBar = (progress: number) => (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: getProgressColor(progress) }}
        />
      </div>
      <span className="text-[10px] font-mono" style={{ color: getProgressColor(progress) }}>
        {progress}%
      </span>
    </div>
  );

  // Simple markdown bold rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={line === '' ? 'h-2' : ''}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          {/* Author header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: nameColor }}
            >
              {post.author_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {typeIcon}
                <span className="font-semibold text-sm" style={{ color: nameColor }}>
                  {post.author_name}
                </span>
              </div>
              {progressBar(post.author_progress)}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Content */}
          <div className="text-sm text-foreground space-y-1 mb-3 pl-12">
            {renderContent(post.content)}
          </div>

          {/* Reply toggle */}
          <div className="pl-12 flex items-center gap-4">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          </div>

          {/* Replies */}
          {showReplies && (
            <div className="pl-12 mt-4 space-y-3">
              {post.replies.map((reply) => {
                const replyColor = getProgressColor(reply.author_progress);
                return (
                  <div key={reply.id} className="flex gap-2 text-sm">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: replyColor }}
                    >
                      {reply.author_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs" style={{ color: replyColor }}>
                          {reply.author_name}
                        </span>
                        {progressBar(reply.author_progress)}
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                );
              })}

              {/* Reply input */}
              <div className="flex gap-2 mt-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px] text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReply}
                  disabled={submitting || !replyText.trim()}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
