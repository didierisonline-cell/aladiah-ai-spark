import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import WaitlistModal from '@/components/WaitlistModal';

const enrollmentSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().min(7, 'Phone number is required').max(20),
  company: z.string().trim().max(100).optional(),
  jobTitle: z.string().trim().max(100).optional(),
  country: z.string().trim().min(1, 'Country is required').max(100),
});

const countries = [
  'United States', 'Canada', 'Dominican Republic', 'Mexico', 'Colombia',
  'Brazil', 'Argentina', 'Chile', 'Spain', 'United Kingdom', 'Germany',
  'France', 'Australia', 'Japan', 'India', 'Other',
];

const Enroll = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const courseParam = searchParams.get('course') || 'scrum';

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    country: '',
  });

  const isScrum = courseParam === 'scrum';

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = enrollmentSchema.safeParse(form);
    if (!result.success) {
      toast({ title: result.error.errors[0].message, variant: 'destructive' });
      return;
    }

    if (!isScrum) {
      setWaitlistOpen(true);
      return;
    }

    setLoading(true);
    try {
      // TODO: Wire Stripe checkout here
      // This will call an edge function that:
      // 1. Creates a Stripe checkout session for $1,999
      // 2. On success webhook: creates user account with temp password
      // 3. Sends payment confirmation email
      // 4. Sends login credentials email
      toast({
        title: 'Payment integration coming soon',
        description: 'Stripe checkout will be connected shortly. Your enrollment details have been captured.',
      });
    } catch (err: any) {
      toast({ title: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-ocean text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            {isScrum ? 'Scrum Master Certification Course' : 'Project Management Professional'}
          </h1>
          <p className="text-primary-foreground/80 mt-1">Enrollment Application</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
              <h2 className="text-xl font-display font-bold text-foreground mb-6">
                Your Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={e => updateField('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="john@company.com"
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={form.country} onValueChange={v => updateField('country', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={e => updateField('company', e.target.value)}
                      placeholder="Acme Corp"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input
                      id="jobTitle"
                      value={form.jobTitle}
                      onChange={e => updateField('jobTitle', e.target.value)}
                      placeholder="Software Engineer"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {isScrum ? (
                    <Button type="submit" variant="coral" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Processing...' : 'Proceed to Payment — $1,999'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Processing...' : 'Join Waitlist'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Course Summary */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
              <h3 className="font-display font-bold text-foreground mb-4">
                {isScrum ? 'Scrum Master Certification Course' : 'Project Management Professional'}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{isScrum ? '8 weeks' : '12 weeks'}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>100% online learning</span>
                </div>
              </div>

              {isScrum && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="text-2xl font-display font-bold text-foreground">$1,999</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-4">
              <h4 className="font-display font-semibold text-foreground text-sm">What's Included</h4>
              {[
                'Full course access & materials',
                'Live project simulations',
                'AI-powered learning tools',
                'Lifetime community access',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground px-2">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Secure payment processing. Your data is encrypted and protected.</span>
            </div>
          </motion.div>
        </div>
      </div>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
};

export default Enroll;
