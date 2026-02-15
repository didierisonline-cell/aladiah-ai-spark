import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Youtube, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VideoSuggestion {
  searchQuery: string;
  reason: string;
  topic: string;
}

interface YouTubeRecommendationsProps {
  weakAreas: string[];
  recentQuestions: string[];
  currentTopic: string;
  onSwitchToAssistant: (prompt: string) => void;
}

const YouTubeRecommendations = ({
  weakAreas,
  recentQuestions,
  currentTopic,
  onSwitchToAssistant,
}: YouTubeRecommendationsProps) => {
  const [suggestions, setSuggestions] = useState<VideoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Suggest YouTube videos for me' }],
          studentContext: { weakAreas, recentQuestions, currentTopic },
          mode: 'suggest_videos',
        }),
      });

      if (!resp.ok || !resp.body) return;

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) full += content;
          } catch {}
        }
      }

      const jsonMatch = full.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setSuggestions(result.suggestions || []);
      }
    } catch (e) {
      console.error('YouTube suggestions error:', e);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    if (!hasLoaded) fetchSuggestions();
  }, [hasLoaded]);

  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Youtube className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold">Recommended Videos</h3>
            <p className="text-xs text-muted-foreground">AI-curated based on your weak areas</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchSuggestions} disabled={loading} className="h-8 w-8">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        {loading && !suggestions.length ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((v, i) => (
            <a
              key={i}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-2 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
            >
              <Youtube className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="block font-medium">{v.searchQuery}</span>
                <span className="block text-xs text-muted-foreground">{v.reason}</span>
                <Badge variant="outline" className="text-[10px] mt-1">{v.topic}</Badge>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
            </a>
          ))
        ) : (
          // Fallback static suggestions
          ['Scrum in 10 Minutes', 'Sprint Planning Best Practices', 'Daily Standup Anti-Patterns', 'Product Backlog Refinement Tips', 'Agile Retrospective Techniques'].map((v, i) => (
            <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <Youtube className="w-4 h-4 text-red-500 shrink-0" />
              <span>{v}</span>
              <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
            </a>
          ))
        )}
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={() => onSwitchToAssistant('Suggest 5 YouTube videos personalized to my weak areas in Scrum')}>
        <Sparkles className="w-3 h-3 mr-1" /> Get More Personalized Suggestions
      </Button>
    </Card>
  );
};

export default YouTubeRecommendations;
