// ==============================================================================
// LIVE ACTIVITY FEED - Real-Time Activity Notifications
// ==============================================================================

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Activity, Daycare } from '../../types/components';
import { generateRandomActivity, getRandomInterval } from './activityGenerator';
import ActivityToast from './ActivityToast';
import './LiveActivityFeed.css';

interface LiveActivityFeedProps {
  daycares: Daycare[];
  enabled?: boolean;
  maxToasts?: number;
}

export default function LiveActivityFeed({
  daycares,
  enabled = true,
  maxToasts = 5,
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!enabled || daycares.length === 0) return;

    // Track all timeouts for cleanup
    const intervalTimeouts: NodeJS.Timeout[] = [];

    // Generate initial activity after a short delay
    const initialTimeout = setTimeout(() => {
      const activity = generateRandomActivity(daycares);
      setActivities([activity]);
    }, 3000); // Wait 3 seconds before showing first toast

    // Function to generate and add new activity
    const addNewActivity = () => {
      const activity = generateRandomActivity(daycares);
      setActivities(prev => {
        // Add new activity to the beginning and limit to maxToasts
        const updated = [activity, ...prev].slice(0, maxToasts);
        return updated;
      });
    };

    // Set up interval with random timing
    const scheduleNext = (): NodeJS.Timeout => {
      const interval = getRandomInterval();
      return setTimeout(() => {
        addNewActivity();
        // Schedule the next one
        const nextTimeout = scheduleNext();
        intervalTimeouts.push(nextTimeout);
      }, interval);
    };

    // Start the interval chain after initial activity
    const chainStart = setTimeout(() => {
      const firstInterval = scheduleNext();
      intervalTimeouts.push(firstInterval);
    }, 3000);

    // Auto-dismiss toasts after 8 seconds
    const autoDismissInterval = setInterval(() => {
      setActivities(prev => {
        const now = new Date().getTime();
        return prev.filter(activity => {
          const age = now - activity.timestamp.getTime();
          return age < 8000; // Keep only activities less than 8 seconds old
        });
      });
    }, 1000); // Check every second

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(chainStart);
      clearInterval(autoDismissInterval);
      intervalTimeouts.forEach(clearTimeout);
    };
  }, [daycares, enabled, maxToasts]);

  // Handle manual dismiss
  const handleDismiss = (activityId: string) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
  };

  if (!enabled || activities.length === 0) {
    return null;
  }

  return (
    <div className="live-activity-feed" role="region" aria-label="Live activity updates">
      <AnimatePresence mode="popLayout">
        {activities.map(activity => (
          <ActivityToast
            key={activity.id}
            activity={activity}
            onDismiss={() => handleDismiss(activity.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
