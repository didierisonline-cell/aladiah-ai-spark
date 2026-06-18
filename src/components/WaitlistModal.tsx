import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Sparkles } from 'lucide-react';
import { z } from 'zod';

const waitlistSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
});

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const translations: Record<string, {
  title: string;
  description: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successDesc: string;
  errorDuplicate: string;
}> = {
  en: {
    title: 'Join the Waitlist',
    description: 'Be the first to know when our Project Management Professional course launches. Get early access and exclusive pricing.',
    name: 'Full Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'you@example.com',
    submit: 'Join Waitlist',
    submitting: 'Joining...',
    successTitle: "You're on the list! 🎉",
    successDesc: "We'll notify you as soon as the course is ready.",
    errorDuplicate: "You're already on the waitlist!",
  },
  es: {
    title: 'Únete a la Lista de Espera',
    description: 'Sé el primero en enterarte cuando se lance nuestro curso de Gestión de Proyectos Profesional. Obtén acceso anticipado y precios exclusivos.',
    name: 'Nombre Completo',
    namePlaceholder: 'Ingresa tu nombre completo',
    email: 'Correo Electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    submit: 'Unirse a la Lista',
    submitting: 'Uniéndose...',
    successTitle: '¡Estás en la lista! 🎉',
    successDesc: 'Te notificaremos tan pronto como el curso esté listo.',
    errorDuplicate: '¡Ya estás en la lista de espera!',
  },
  zh: {
    title: '加入等候名单',
    description: '第一时间了解我们的项目管理专业课程何时上线。获得提前访问权和独家定价。',
    name: '全名',
    namePlaceholder: '输入您的全名',
    email: '电子邮箱',
    emailPlaceholder: 'you@example.com',
    submit: '加入等候名单',
    submitting: '加入中...',
    successTitle: '您已加入名单！🎉',
    successDesc: '课程准备就绪后我们会通知您。',
    errorDuplicate: '您已在等候名单中！',
  },
  ar: {
    title: 'انضم إلى قائمة الانتظار',
    description: 'كن أول من يعرف عند إطلاق دورة إدارة المشاريع الاحترافية. احصل على وصول مبكر وأسعار حصرية.',
    name: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    submit: 'انضم للقائمة',
    submitting: 'جاري الانضمام...',
    successTitle: 'أنت في القائمة! 🎉',
    successDesc: 'سنخبرك فور جهوز الدورة.',
    errorDuplicate: 'أنت بالفعل في قائمة الانتظار!',
  },
  fr: {
    title: "Rejoindre la Liste d'Attente",
    description: "Soyez le premier informé du lancement de notre cours de Gestion de Projet Professionnel. Bénéficiez d'un accès anticipé et de tarifs exclusifs.",
    name: 'Nom Complet',
    namePlaceholder: 'Entrez votre nom complet',
    email: 'Adresse E-mail',
    emailPlaceholder: 'vous@exemple.com',
    submit: "Rejoindre la Liste",
    submitting: 'En cours...',
    successTitle: 'Vous êtes inscrit ! 🎉',
    successDesc: 'Nous vous notifierons dès que le cours sera prêt.',
    errorDuplicate: "Vous êtes déjà sur la liste d'attente !",
  },
  de: {
    title: 'Warteliste beitreten',
    description: 'Erfahren Sie als Erster, wann unser Kurs für Projektmanagement-Profis startet. Erhalten Sie frühzeitigen Zugang und exklusive Preise.',
    name: 'Vollständiger Name',
    namePlaceholder: 'Geben Sie Ihren vollständigen Namen ein',
    email: 'E-Mail-Adresse',
    emailPlaceholder: 'sie@beispiel.com',
    submit: 'Zur Warteliste',
    submitting: 'Beitritt...',
    successTitle: 'Sie sind auf der Liste! 🎉',
    successDesc: 'Wir benachrichtigen Sie, sobald der Kurs bereit ist.',
    errorDuplicate: 'Sie stehen bereits auf der Warteliste!',
  },
  ja: {
    title: 'ウェイトリストに参加',
    description: 'プロジェクトマネジメントプロフェッショナルコースの開講をいち早くお知らせします。早期アクセスと特別価格をゲット。',
    name: '氏名',
    namePlaceholder: 'お名前を入力',
    email: 'メールアドレス',
    emailPlaceholder: 'you@example.com',
    submit: 'ウェイトリストに参加',
    submitting: '参加中...',
    successTitle: 'リストに追加されました！🎉',
    successDesc: 'コースの準備ができ次第お知らせします。',
    errorDuplicate: 'すでにウェイトリストに登録されています！',
  },
  pt: {
    title: 'Entre na Lista de Espera',
    description: 'Seja o primeiro a saber quando nosso curso de Gestão de Projetos Profissional for lançado. Tenha acesso antecipado e preços exclusivos.',
    name: 'Nome Completo',
    namePlaceholder: 'Digite seu nome completo',
    email: 'Endereço de E-mail',
    emailPlaceholder: 'voce@exemplo.com',
    submit: 'Entrar na Lista',
    submitting: 'Entrando...',
    successTitle: 'Você está na lista! 🎉',
    successDesc: 'Avisaremos assim que o curso estiver pronto.',
    errorDuplicate: 'Você já está na lista de espera!',
  },
  hi: {
    title: 'प्रतीक्षा सूची में शामिल हों',
    description: 'हमारे प्रोजेक्ट मैनेजमेंट प्रोफेशनल कोर्स के लॉन्च होने पर सबसे पहले जानें। शीघ्र पहुँच और विशेष मूल्य प्राप्त करें।',
    name: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    email: 'ईमेल पता',
    emailPlaceholder: 'aap@udaharan.com',
    submit: 'सूची में शामिल हों',
    submitting: 'शामिल हो रहे हैं...',
    successTitle: 'आप सूची में हैं! 🎉',
    successDesc: 'कोर्स तैयार होते ही हम आपको सूचित करेंगे।',
    errorDuplicate: 'आप पहले से ही प्रतीक्षा सूची में हैं!',
  },
};

const WaitlistModal = ({ open, onOpenChange }: WaitlistModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { language, t: tr } = useLanguage();

  const t = translations[language] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = waitlistSchema.safeParse({ full_name: fullName, email });
    if (!result.success) {
      toast({ title: result.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_waitlist')
        .insert({ full_name: result.data.full_name, email: result.data.email, course_interest: 'project_management' });

      if (error) {
        if (error.code === '23505') {
          toast({ title: t.errorDuplicate });
          setSuccess(true);
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      toast({ title: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSuccess(false);
      setFullName('');
      setEmail('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <DialogTitle className="text-2xl font-display">{t.successTitle}</DialogTitle>
            <DialogDescription className="text-base">{t.successDesc}</DialogDescription>
            <Button onClick={() => handleClose(false)} className="mt-4">{tr('modal.ok')}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{tr('modal.coming_soon')}</span>
              </div>
              <DialogTitle className="text-xl font-display">{t.title}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="waitlist-name">{t.name}</Label>
                <Input
                  id="waitlist-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waitlist-email">{t.email}</Label>
                <Input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  maxLength={255}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.submitting : t.submit}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
