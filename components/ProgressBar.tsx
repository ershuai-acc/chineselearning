import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <div className={cn("h-4 w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-green-500 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute top-1 right-2 w-2/3 h-1 bg-white/20 rounded-full" />
      </motion.div>
    </div>
  );
};