import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// Self-contained strings (not via useLanguage): an error boundary must not depend
// on React context that may itself have thrown during the render it is catching.
// Language is read directly from the same localStorage key the LanguageProvider uses.
const EB_STRINGS: Record<string, { title: string; body: string; reload: string; signin: string }> = {
  en: { title: 'Something went wrong', body: 'This page hit an unexpected error. Your session is safe — try reloading, or head back to sign in.', reload: 'Reload page', signin: 'Back to sign in' },
  es: { title: 'Algo salió mal', body: 'Esta página tuvo un error inesperado. Tu sesión está a salvo — intenta recargar o vuelve a iniciar sesión.', reload: 'Recargar página', signin: 'Volver a iniciar sesión' },
  fr: { title: "Une erreur s'est produite", body: "Cette page a rencontré une erreur inattendue. Votre session est en sécurité — essayez de recharger ou revenez à la connexion.", reload: 'Recharger la page', signin: 'Retour à la connexion' },
  pt: { title: 'Algo deu errado', body: 'Esta página teve um erro inesperado. Sua sessão está segura — tente recarregar ou volte para entrar.', reload: 'Recarregar página', signin: 'Voltar para entrar' },
  de: { title: 'Etwas ist schiefgelaufen', body: 'Auf dieser Seite ist ein unerwarteter Fehler aufgetreten. Deine Sitzung ist sicher — lade neu oder kehre zur Anmeldung zurück.', reload: 'Seite neu laden', signin: 'Zurück zur Anmeldung' },
  ar: { title: 'حدث خطأ ما', body: 'واجهت هذه الصفحة خطأً غير متوقع. جلستك آمنة — حاول إعادة التحميل أو ارجع لتسجيل الدخول.', reload: 'إعادة تحميل الصفحة', signin: 'العودة لتسجيل الدخول' },
  zh: { title: '出了点问题', body: '此页面发生了意外错误。你的会话是安全的 — 请尝试重新加载，或返回登录。', reload: '重新加载页面', signin: '返回登录' },
  hi: { title: 'कुछ गलत हो गया', body: 'इस पेज पर एक अप्रत्याशित त्रुटि आई। आपका सत्र सुरक्षित है — पुनः लोड करें, या साइन इन पर लौटें।', reload: 'पेज पुनः लोड करें', signin: 'साइन इन पर लौटें' },
};

interface State {
  hasError: boolean;
  message: string;
}

/**
 * App-wide render safety net. Without this, any uncaught error thrown while
 * rendering a route unmounts the entire React tree, leaving the user on a blank
 * dark page (the body background) with no UI — exactly the /portal blank-screen
 * symptom. This boundary catches the error and shows a recoverable fallback
 * (Reload / Sign in) instead, and logs the error to the console for diagnosis.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Surface the real error so it shows up in the browser console / logs.
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleSignIn = () => {
    window.location.href = '/auth';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    let lang = 'en';
    try { lang = localStorage.getItem('aladiah_lang') || 'en'; } catch { /* storage blocked */ }
    const s = EB_STRINGS[lang] || EB_STRINGS.en;

    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-card/80 shadow-large p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{s.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {s.body}
          </p>
          {this.state.message && (
            <p className="mt-3 break-words rounded-lg bg-muted/50 px-3 py-2 text-left font-mono text-[11px] text-muted-foreground">
              {this.state.message}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={this.handleReload}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {s.reload}
            </button>
            <button
              onClick={this.handleSignIn}
              className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              {s.signin}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
