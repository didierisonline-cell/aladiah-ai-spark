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
import { enrollTranslations, type SupportedLanguage } from '@/utils/enrollTranslations';

const enrollmentSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().min(7, 'Phone number is required').max(20),
  company: z.string().trim().max(100).optional(),
  jobTitle: z.string().trim().max(100).optional(),
  country: z.string().trim().min(1, 'Country is required').max(100),
});

const countries = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
  'Croatia','Cuba','Cyprus','Czech Republic','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','East Timor',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland',
  'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
  'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
  'Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati',
  'Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
  'Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania',
  'Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
  'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa',
  'San Marino','São Tomé and Príncipe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden',
  'Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia',
  'Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

const Enroll = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const courseParam = searchParams.get('course') || 'scrum';

  const supportedLangs: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLangs.includes(language as SupportedLanguage) ? (language as SupportedLanguage) : 'en';
  const et = enrollTranslations[currentLang];

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
      toast({
        title: et.welcome,
        description: et.paymentSoon,
      });
      // Auto-redirect to the personalized student portal
      setTimeout(() => navigate('/portal'), 1500);
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
            <span className="text-sm font-medium">{et.backToHome}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            {isScrum ? et.scrumTitle : et.pmpTitle}
          </h1>
          <p className="text-primary-foreground/80 mt-1">{et.enrollmentApplication}</p>
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
                {et.yourInfo}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{et.fullName} *</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={e => updateField('fullName', e.target.value)}
                      placeholder={et.fullNamePlaceholder}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{et.emailAddress} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder={et.emailPlaceholder}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{et.phoneNumber} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      placeholder={et.phonePlaceholder}
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{et.country} *</Label>
                    <Select value={form.country} onValueChange={v => updateField('country', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={et.selectCountry} />
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
                    <Label htmlFor="company">{et.company} <span className="text-muted-foreground text-xs">({et.optional})</span></Label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={e => updateField('company', e.target.value)}
                      placeholder={et.companyPlaceholder}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">{et.jobTitle} <span className="text-muted-foreground text-xs">({et.optional})</span></Label>
                    <Input
                      id="jobTitle"
                      value={form.jobTitle}
                      onChange={e => updateField('jobTitle', e.target.value)}
                      placeholder={et.jobTitlePlaceholder}
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {isScrum ? (
                    <Button type="submit" variant="coral" size="lg" className="w-full" disabled={loading}>
                      {loading ? et.processing : et.proceedToPayment}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
                      {loading ? et.processing : et.joinWaitlist}
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
                {isScrum ? et.scrumTitle : et.pmpTitle}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{isScrum ? et.weeks8 : et.weeks12}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{et.onlineLearning}</span>
                </div>
              </div>

              {isScrum && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{et.total}</span>
                    <span className="text-2xl font-display font-bold text-foreground">$1,999</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-4">
              <h4 className="font-display font-semibold text-foreground text-sm">{et.whatsIncluded}</h4>
              {[et.fullAccess, et.liveProjects, et.aiTools, et.communityAccess].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground px-2">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>{et.securePayment}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
};

export default Enroll;
