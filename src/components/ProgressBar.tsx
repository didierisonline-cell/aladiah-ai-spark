import { useAuth } from '@/hooks/useAuth';
import { useProgress, getProgressColor } from '@/hooks/useProgress';
import { motion } from 'framer-motion';

const ProgressBar = () => {
  const { user } = useAuth();
  const { progress, loading } = useProgress(user?.id);

  if (!user || loading) return null;

  const color = getProgressColor(progress);

  return (
    <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border/30 h-8 flex items-center px-4">
      <div className="container mx-auto flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          Course Progress
        </span>
        <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <span
          className="text-xs font-bold whitespace-nowrap"
          style={{ color }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
