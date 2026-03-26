import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import ProgressBar from '@/components/ProgressBar';
import IntroForm from '@/components/community/IntroForm';
import PostCard from '@/components/community/PostCard';
import { GraduationCap, LogOut, Send, MessageCircle, Sparkles } from 'lucide-react';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
import { communityTranslations, type SupportedLanguage } from '@/utils/communityTranslations';
import BackToPortal from '@/components/portal/BackToPortal';

interface PostData {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  user_id: string;
  author_name: string;
  author_progress: number;
  replies: any[];
}

const Community = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const supportedLangs: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLangs.includes(language as SupportedLanguage) ? (language as SupportedLanguage) : 'en';
  const ct = communityTranslations[currentLang];

  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    checkIntroStatus();
  }, [user]);

  const checkIntroStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('has_completed_intro')
      .eq('user_id', user.id)
      .single();

    setHasCompletedIntro(data?.has_completed_intro ?? false);
    if (data?.has_completed_intro) loadPosts();
  };

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      // Get community posts (not feedback)
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*')
        .in('post_type', ['intro', 'general', 'question'])
        .order('created_at', { ascending: false });

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoadingPosts(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(postsData.map(p => p.user_id))];

      // Get profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      // Get progress for each user
      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('user_id, quiz_id')
        .in('user_id', userIds)
        .not('quiz_id', 'is', null);

      const { data: allQuizzes } = await supabase
        .from('quizzes')
        .select('id');

      const totalQuizzes = allQuizzes?.length || 1;

      const userProgressMap: Record<string, number> = {};
      userIds.forEach(uid => {
        const passed = (allProgress || []).filter(p => p.user_id === uid).length;
        userProgressMap[uid] = Math.round((passed / totalQuizzes) * 100);
      });

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => {
        profileMap[p.user_id] = p.full_name || 'Student';
      });

      // Get replies
      const postIds = postsData.map(p => p.id);
      const { data: repliesData } = await supabase
        .from('community_replies')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

      // Get reply author IDs
      const replyUserIds = [...new Set((repliesData || []).map(r => r.user_id))];
      const missingIds = replyUserIds.filter(id => !profileMap[id]);
      if (missingIds.length > 0) {
        const { data: moreProfiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', missingIds);
        (moreProfiles || []).forEach(p => {
          profileMap[p.user_id] = p.full_name || 'Student';
        });

        const { data: moreProgress } = await supabase
          .from('user_progress')
          .select('user_id, quiz_id')
          .in('user_id', missingIds)
          .not('quiz_id', 'is', null);
        missingIds.forEach(uid => {
          const passed = (moreProgress || []).filter(p => p.user_id === uid).length;
          userProgressMap[uid] = Math.round((passed / totalQuizzes) * 100);
        });
      }

      const enrichedPosts: PostData[] = postsData.map(post => ({
        ...post,
        author_name: profileMap[post.user_id] || 'Student',
        author_progress: userProgressMap[post.user_id] || 0,
        replies: (repliesData || [])
          .filter(r => r.post_id === post.id)
          .map(r => ({
            ...r,
            author_name: profileMap[r.user_id] || 'Student',
            author_progress: userProgressMap[r.user_id] || 0,
          })),
      }));

      setPosts(enrichedPosts);
    } catch (error: any) {
      toast({ title: 'Error loading posts', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingPosts(false);
    }
  }, [toast]);

  const handleNewPost = async () => {
    if (!newPost.trim() || !user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        content: newPost.trim(),
        post_type: 'general',
      });
      if (error) throw error;
      setNewPost('');
      loadPosts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading || hasCompletedIntro === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GraduationCap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-14 w-auto object-contain mix-blend-multiply" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="ghost" size="sm">{ct.myCourses}</Button>
            </Link>
            <Link to="/feedback">
              <Button variant="ghost" size="sm">{ct.feedback}</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {ct.logout}
            </Button>
          </div>
        </div>
      </header>

      <ProgressBar />

      <main className="container mx-auto px-4 py-8 pt-16">
        <BackToPortal />
        {!hasCompletedIntro ? (
          <IntroForm
            userId={user!.id}
            fullName={user!.user_metadata?.full_name || 'Student'}
            onComplete={() => {
              setHasCompletedIntro(true);
              loadPosts();
            }}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                {ct.communityTitle}
              </h1>
              <p className="text-muted-foreground">
                {ct.communitySubtitle}
              </p>
            </motion.div>

            {/* New post */}
            <div className="mb-8">
              <div className="flex gap-3">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={ct.sharePlaceholder}
                  className="min-h-[80px]"
                />
                <Button
                  onClick={handleNewPost}
                  disabled={submitting || !newPost.trim()}
                  variant="coral"
                  className="self-end"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {ct.post}
                </Button>
              </div>
            </div>

            {/* Posts */}
            {loadingPosts ? (
              <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto mb-2" />
                <p className="text-muted-foreground">{ct.loadingPosts}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">{ct.noPosts} {ct.beFirst}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user!.id}
                    onReplyAdded={loadPosts}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Community;
