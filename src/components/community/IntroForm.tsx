import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface IntroFormProps {
  userId: string;
  fullName: string;
  onComplete: () => void;
}

const IntroForm = ({ userId, fullName, onComplete }: IntroFormProps) => {
  const [whoAmI, setWhoAmI] = useState('');
  const [whereFrom, setWhereFrom] = useState('');
  const [howLearned, setHowLearned] = useState('');
  const [goals, setGoals] = useState('');
  const [sixMonthGoals, setSixMonthGoals] = useState('');
  const [pledge, setPledge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whoAmI || !whereFrom || !howLearned || !goals || !sixMonthGoals || !pledge) {
      toast({ title: 'All fields are required', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const introData = { whoAmI, whereFrom, howLearned, goals, sixMonthGoals, pledge };

      // Build formatted post content
      const content = `👋 Hey everyone! I'm **${fullName}**!\n\n` +
        `📍 **Where I'm from:** ${whereFrom}\n\n` +
        `🔍 **How I found Aladiah Academy:** ${howLearned}\n\n` +
        `🎯 **What I want to achieve:** ${goals}\n\n` +
        `📅 **My 6-month goals:** ${sixMonthGoals}\n\n` +
        `🤝 **My pledge & commitment:** ${pledge}`;

      const { error } = await supabase.from('community_posts').insert({
        user_id: userId,
        content,
        post_type: 'intro',
        intro_data: introData as any,
      });

      if (error) throw error;

      // Mark intro as completed
      await supabase
        .from('profiles')
        .update({ has_completed_intro: true })
        .eq('user_id', userId);

      toast({ title: 'Welcome to the community! 🎉' });
      onComplete();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { label: 'Who are you? Tell us about yourself', value: whoAmI, setter: setWhoAmI, placeholder: 'Share a bit about your background, career, and passions...' },
    { label: 'Where are you from?', value: whereFrom, setter: setWhereFrom, placeholder: 'Your city, country...' },
    { label: 'How did you learn about Aladiah Academy?', value: howLearned, setter: setHowLearned, placeholder: 'Social media, a friend, Google search...' },
    { label: 'What do you want to achieve?', value: goals, setter: setGoals, placeholder: 'Your career aspirations and learning goals...' },
    { label: 'What are your 6-month goals from now?', value: sixMonthGoals, setter: setSixMonthGoals, placeholder: 'Where do you see yourself in 6 months...' },
    { label: 'What do you pledge and commit to do?', value: pledge, setter: setPledge, placeholder: 'Your commitment to this learning journey...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-large border-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Welcome to the Community!</CardTitle>
          <CardDescription>
            Introduce yourself to your fellow students. This will be posted as your introduction in the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field, i) => (
              <div key={i} className="space-y-2">
                <Label>{field.label} *</Label>
                <Textarea
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="min-h-[80px]"
                />
              </div>
            ))}
            <Button type="submit" variant="coral" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post My Introduction'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntroForm;
