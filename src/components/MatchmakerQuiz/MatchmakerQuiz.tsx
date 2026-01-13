// ==============================================================================
// MATCHMAKER QUIZ - Interactive Quiz for Personalized Daycare Recommendations
// ==============================================================================

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Daycare, QuizAnswer, DaycareMatch, QuizOption } from '../../types/components';
import { getTopMatches } from './quizLogic';
import ProgressIndicator from './ProgressIndicator';
import QuizStep from './QuizStep';
import PerfectMatchCard from './PerfectMatchCard';
import './MatchmakerQuiz.css';

interface MatchmakerQuizProps {
  daycares: Daycare[];
  onComplete?: (matches: Daycare[]) => void;
  onClose: () => void;
}

// Quiz configuration
const QUIZ_STEPS = [
  {
    id: 1,
    title: 'Where are you located?',
    question: "What's your SF cross-street or neighborhood?",
    type: 'text' as const,
  },
  {
    id: 2,
    title: "Your child's age",
    question: 'How old is your child?',
    type: 'single-choice' as const,
    options: [
      {
        value: 'infant',
        label: 'Infant',
        icon: '👶',
        description: '0-12 months',
      },
      {
        value: 'toddler',
        label: 'Toddler',
        icon: '🧒',
        description: '1-3 years',
      },
      {
        value: 'preschool',
        label: 'Preschool',
        icon: '👧',
        description: '3-5 years',
      },
    ] as QuizOption[],
  },
  {
    id: 3,
    title: 'What matters most?',
    question: "What's your #1 (or #2) must-have?",
    type: 'multi-choice' as const,
    options: [
      {
        value: 'transit',
        label: 'Near Transit',
        icon: '🚇',
        description: 'Walking distance to BART/Muni',
      },
      {
        value: 'bilingual',
        label: 'Bilingual Program',
        icon: '🌎',
        description: 'English + Spanish or other',
      },
      {
        value: 'outdoor',
        label: 'Outdoor Play Area',
        icon: '🌳',
        description: 'Dedicated outdoor space',
      },
      {
        value: 'organic',
        label: 'Organic Meals',
        icon: '🥗',
        description: 'Healthy, organic food',
      },
    ] as QuizOption[],
  },
];

export default function MatchmakerQuiz({ daycares, onComplete, onClose }: MatchmakerQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [matches, setMatches] = useState<DaycareMatch[] | null>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when quiz is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAnswerChange = (key: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete - calculate matches
      const topMatches = getTopMatches(daycares, answers, 3);
      setMatches(topMatches);

      // Call onComplete callback
      if (onComplete) {
        onComplete(topMatches.map(m => m.daycare));
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepConfig = () => {
    return QUIZ_STEPS[currentStep - 1];
  };

  const getAnswerValue = () => {
    const step = getCurrentStepConfig();
    if (step.id === 1) return answers.crossStreet;
    if (step.id === 2) return answers.childAge;
    if (step.id === 3) return answers.mustHave;
    return null;
  };

  const setAnswerValue = (value: any) => {
    const step = getCurrentStepConfig();
    if (step.id === 1) handleAnswerChange('crossStreet', value);
    if (step.id === 2) handleAnswerChange('childAge', value);
    if (step.id === 3) handleAnswerChange('mustHave', value);
  };

  const currentStepConfig = getCurrentStepConfig();

  return (
    <div className="matchmaker-quiz-overlay" onClick={onClose}>
      <motion.div
        className="matchmaker-quiz-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button className="quiz-close-btn" onClick={onClose} aria-label="Close quiz">
          ×
        </button>

        {/* Quiz Content */}
        {!matches && (
          <>
            <ProgressIndicator currentStep={currentStep} totalSteps={QUIZ_STEPS.length} />

            <AnimatePresence mode="wait">
              <QuizStep
                key={currentStep}
                stepNumber={currentStep}
                title={currentStepConfig.title}
                question={currentStepConfig.question}
                type={currentStepConfig.type}
                options={currentStepConfig.options}
                value={getAnswerValue()}
                onValueChange={setAnswerValue}
                onNext={handleNext}
                onBack={currentStep > 1 ? handleBack : undefined}
              />
            </AnimatePresence>
          </>
        )}

        {/* Results */}
        {matches && <PerfectMatchCard matches={matches} onClose={onClose} />}
      </motion.div>
    </div>
  );
}
