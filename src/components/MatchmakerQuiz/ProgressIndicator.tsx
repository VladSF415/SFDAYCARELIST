// ==============================================================================
// PROGRESS INDICATOR - Step Progress for Quiz
// ==============================================================================

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="quiz-progress-indicator">
      {steps.map(step => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="quiz-progress-step">
            <motion.div
              className={`quiz-progress-dot ${isCompleted ? 'completed' : ''} ${
                isActive ? 'active' : ''
              }`}
              initial={false}
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                repeat: isActive ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              {isCompleted && <span className="quiz-progress-check">✓</span>}
              {!isCompleted && <span className="quiz-progress-number">{step}</span>}
            </motion.div>

            {step < totalSteps && (
              <div
                className={`quiz-progress-line ${
                  isCompleted ? 'completed' : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
