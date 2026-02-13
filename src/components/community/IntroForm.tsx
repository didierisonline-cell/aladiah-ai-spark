import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { communityTranslations, type SupportedLanguage } from '@/utils/communityTranslations';

interface IntroFormProps {
  userId: string;
  fullName: string;
  onComplete: () => void;
}

const IntroForm = ({ userId, fullName, onComplete }: IntroFormProps) => {
  const { language } = useLanguage();
  const supportedLangs: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLangs.includes(language as SupportedLanguage) ? (language as SupportedLanguage) : 'en';
  const ct = communityTranslations[currentLang];

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
      toast({ title: ct.allFieldsRequired, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const introData = { whoAmI, whereFrom, howLearned, goals, sixMonthGoals, pledge };

      const content = `${ct.introHey} **${fullName}**!\n\n` +
        `${ct.introFrom} ${whereFrom}\n\n` +
        `${ct.introHow} ${howLearned}\n\n` +
        `${ct.introGoals} ${goals}\n\n` +
        `${ct.introSixMonth} ${sixMonthGoals}\n\n` +
        `${ct.introPledge} ${pledge}`;

      const { error } = await supabase.from('community_posts').insert({
        user_id: userId,
        content,
        post_type: 'intro',
        intro_data: introData as any,
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ has_completed_intro: true })
        .eq('user_id', userId);

      toast({ title: ct.welcomeToast });
      onComplete();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { label: ct.whoAreYou, value: whoAmI, setter: setWhoAmI, placeholder: ct.whoPlaceholder },
    { label: ct.whereFrom, value: whereFrom, setter: setWhereFrom, placeholder: ct.wherePlaceholder },
    { label: ct.howLearned, value: howLearned, setter: setHowLearned, placeholder: ct.howPlaceholder },
    { label: ct.whatAchieve, value: goals, setter: setGoals, placeholder: ct.whatPlaceholder },
    { label: ct.sixMonthGoals, value: sixMonthGoals, setter: setSixMonthGoals, placeholder: ct.sixMonthPlaceholder },
    { label: ct.pledgeLabel, value: pledge, setter: setPledge, placeholder: ct.pledgePlaceholder },
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
          <CardTitle className="text-2xl font-display">{ct.welcomeCommunity}</CardTitle>
          <CardDescription>{ct.introSubtitle}</CardDescription>
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
              {submitting ? ct.submitting : ct.postIntro}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntroForm;
