import MobileTopBar from './MobileTopBar';
import BottomTabBar from './BottomTabBar';

interface Props {
  children: React.ReactNode;
  title?: string;
  score?: number;
  back?: string;
}

/**
 * The student mobile app shell: safe-area top bar + scrollable content +
 * fixed bottom tab bar. Used by every mobile student surface (< lg).
 */
export default function MobileShell({ children, title, score, back }: Props) {
  return (
    <div className="min-h-dvh app-tap" style={{ background: '#060E1C', color: '#EDF2F7', fontFamily: '"Inter",system-ui,sans-serif' }}>
      <MobileTopBar title={title} score={score} back={back} />
      <main className="pb-tabbar" style={{ position: 'relative' }}>
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
