// ==============================================================================
// QUIZ STEP - Individual Step in Quiz Flow
// ==============================================================================

import { motion } from 'framer-motion';
import type { QuizOption } from '../../types/components';

interface QuizStepProps {
  stepNumber: number;
  title: string;
  question: string;
  type: 'text' | 'single-choice' | 'multi-choice';
  options?: QuizOption[];
  value: any;
  onValueChange: (value: any) => void;
  onNext: () => void;
  onBack?: () => void;
}

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export default function QuizStep({
  stepNumber,
  title,
  question,
  type,
  options,
  value,
  onValueChange,
  onNext,
  onBack,
}: QuizStepProps) {
  const canProceed = () => {
    if (type === 'text') return value && value.trim().length > 0;
    if (type === 'single-choice') return value !== null && value !== undefined;
    if (type === 'multi-choice') return value && value.length > 0;
    return false;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed()) {
      onNext();
    }
  };

  return (
    <motion.div
      className="quiz-step"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="quiz-step-header">
        <span className="quiz-step-label">Step {stepNumber} of 3</span>
        <h2 className="quiz-step-title">{title}</h2>
        <p className="quiz-step-question">{question}</p>
      </div>

      <div className="quiz-step-content">
        {/* Text Input */}
        {type === 'text' && (
          <div className="quiz-input-wrapper">
            <input
              type="text"
              className="quiz-input"
              placeholder="Type your answer..."
              value={value || ''}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              aria-label={question}
            />
          </div>
        )}

        {/* Single Choice */}
        {type === 'single-choice' && options && (
          <div className="quiz-options">
            {options.map((option) => (
              <motion.button
                key={option.value}
                className={`quiz-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => onValueChange(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="quiz-option-icon">{option.icon}</span>
                <div className="quiz-option-content">
                  <span className="quiz-option-label">{option.label}</span>
                  {option.description && (
                    <span className="quiz-option-description">{option.description}</span>
                  )}
                </div>
                {value === option.value && (
                  <span className="quiz-option-check">✓</span>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Multi Choice */}
        {type === 'multi-choice' && options && (
          <div className="quiz-options">
            <p className="quiz-multi-hint">Select 1-2 options</p>
            {options.map((option) => {
              const isSelected = value && value.includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  className={`quiz-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const currentValues = value || [];
                    if (isSelected) {
                      // Deselect
                      onValueChange(currentValues.filter((v: string) => v !== option.value));
                    } else {
                      // Select (limit to 2)
                      if (currentValues.length < 2) {
                        onValueChange([...currentValues, option.value]);
                      }
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isSelected && value && value.length >= 2}
                >
                  <span className="quiz-option-icon">{option.icon}</span>
                  <div className="quiz-option-content">
                    <span className="quiz-option-label">{option.label}</span>
                    {option.description && (
                      <span className="quiz-option-description">{option.description}</span>
                    )}
                  </div>
                  {isSelected && <span className="quiz-option-check">✓</span>}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <div className="quiz-step-actions">
        {onBack && (
          <button className="quiz-btn quiz-btn-secondary" onClick={onBack}>
            ← Back
          </button>
        )}
        <button
          className="quiz-btn quiz-btn-primary"
          onClick={onNext}
          disabled={!canProceed()}
        >
          {stepNumber === 3 ? 'Find Matches' : 'Next →'}
        </button>
      </div>
    </motion.div>
  );
}
