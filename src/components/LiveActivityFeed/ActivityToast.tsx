// ==============================================================================
// ACTIVITY TOAST - Individual Toast Notification
// ==============================================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Activity } from '../../types/components';

interface ActivityToastProps {
  activity: Activity;
  onDismiss: () => void;
}

// Framer Motion animation variants
const toastVariants = {
  initial: { x: 400, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export default function ActivityToast({ activity, onDismiss }: ActivityToastProps) {
  const navigate = useNavigate();

  // Handle click on toast - navigate to daycare detail page
  const handleClick = () => {
    if (activity.daycareSlug) {
      navigate(`/daycare/${activity.daycareSlug}`);
      onDismiss();
    }
  };

  // Get border color based on activity type
  const getBorderColor = () => {
    switch (activity.type) {
      case 'new_opening':
        return 'var(--primary-orange)';
      case 'tour_activity':
        return 'var(--soft-blue)';
      case 'enrollment':
        return 'var(--primary-yellow)';
      case 'review':
        return 'var(--sage-green)';
      default:
        return 'var(--primary-orange)';
    }
  };

  // Format timestamp for display
  const timeAgo = () => {
    const seconds = Math.floor((new Date().getTime() - activity.timestamp.getTime()) / 1000);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="activity-toast"
      onClick={handleClick}
      style={{ borderLeftColor: getBorderColor() }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="activity-toast-icon">{activity.icon}</div>

      <div className="activity-toast-content">
        <div className="activity-toast-message">{activity.message}</div>
        <div className="activity-toast-time">{timeAgo()}</div>
      </div>

      <button
        className="activity-toast-dismiss"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </motion.div>
  );
}
