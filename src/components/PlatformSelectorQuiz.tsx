import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Platform } from '../types';

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

interface QuizOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
}

interface QuizResult {
  platforms: Platform[];
  reasoning: string;
  totalMatches: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'primary-use-case',
    question: 'What is your primary use case?',
    description: 'Select the main task you want to accomplish with AI',
    type: 'single',
    options: [
      { value: 'code-ai', label: 'Code Generation & Development', icon: '💻' },
      { value: 'nlp', label: 'Text Analysis & NLP', icon: '📝' },
      { value: 'computer-vision', label: 'Image & Video Analysis', icon: '👁️' },
      { value: 'generative-ai', label: 'Content Creation', icon: '🎨' },
      { value: 'analytics-bi', label: 'Data Analytics & BI', icon: '📊' },
      { value: 'workflow-automation', label: 'Workflow Automation', icon: '⚙️' }
    ]
  },
  {
    id: 'technical-level',
    question: 'What is your technical expertise level?',
    description: 'This helps us recommend platforms that match your skill level',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Beginner', description: 'No coding experience, need visual tools' },
      { value: 'intermediate', label: 'Intermediate', description: 'Some coding, can use APIs and SDKs' },
      { value: 'advanced', label: 'Advanced', description: 'Experienced developer, comfortable with custom solutions' }
    ]
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    description: 'Select your preferred pricing model',
    type: 'single',
    options: [
      { value: 'free', label: 'Free Only', icon: '🆓' },
      { value: 'freemium', label: 'Freemium (Free + Paid tiers)', icon: '💡' },
      { value: 'paid', label: 'Paid (Budget available)', icon: '💳' }
    ]
  },
  {
    id: 'deployment',
    question: 'How do you want to deploy?',
    type: 'single',
    options: [
      { value: 'cloud', label: 'Cloud-based (SaaS)', description: 'No infrastructure management' },
      { value: 'on-premise', label: 'On-premise', description: 'Full control, self-hosted' },
      { value: 'hybrid', label: 'Hybrid', description: 'Flexible deployment options' }
    ]
  },
  {
    id: 'team-size',
    question: 'What is your team size?',
    type: 'single',
    options: [
      { value: 'solo', label: 'Solo / Individual', icon: '👤' },
      { value: 'small', label: 'Small Team (2-10)', icon: '👥' },
      { value: 'medium', label: 'Medium Team (11-50)', icon: '👨‍👩‍👧‍👦' },
      { value: 'enterprise', label: 'Enterprise (50+)', icon: '🏢' }
    ]
  },
  {
    id: 'features',
    question: 'Which features are most important?',
    description: 'Select all that apply',
    type: 'multiple',
    options: [
      { value: 'api-access', label: 'API Access', icon: '🔌' },
      { value: 'custom-models', label: 'Custom Model Training', icon: '🔧' },
      { value: 'collaboration', label: 'Team Collaboration', icon: '🤝' },
      { value: 'integration', label: 'Third-party Integrations', icon: '🔗' },
      { value: 'analytics', label: 'Advanced Analytics', icon: '📈' },
      { value: 'support', label: 'Priority Support', icon: '💬' }
    ]
  }
];

export function PlatformSelectorQuiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUIZ_QUESTIONS.length - 1;
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.type === 'single') {
      setSelectedOptions([value]);
    } else {
      // Multiple selection
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter(v => v !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    // Save answer
    const newAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        selectedOptions: [...selectedOptions]
      }
    ];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Submit quiz
      submitQuiz(newAnswers);
    } else {
      // Go to next question
      setCurrentStep(currentStep + 1);
      setSelectedOptions([]);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Load previous answer
      const prevAnswer = answers.find(a => a.questionId === QUIZ_QUESTIONS[currentStep - 1].id);
      setSelectedOptions(prevAnswer?.selectedOptions || []);
    }
  };

  const submitQuiz = async (finalAnswers: QuizAnswer[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
    }
    setLoading(false);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedOptions([]);
    setResults(null);
  };

  if (results) {
    return (
      <div className="quiz-results">
        <div className="results-header">
          <h2>✨ Your Recommended AI Platforms</h2>
          <p className="results-reasoning">{results.reasoning}</p>
          <p className="results-matches">
            We found <strong>{results.totalMatches} platforms</strong> that match your criteria.
            Here are the top {results.platforms.length} recommendations:
          </p>
        </div>

        <div className="recommended-platforms">
          {results.platforms.map((platform, index) => (
            <div
              key={platform.id || platform.slug}
              className="recommended-platform-card"
              onClick={() => navigate(`/platform/${platform.slug}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="rank-badge">#{index + 1}</div>

              {platform.featured && <span className="badge featured-badge">⭐ FEATURED</span>}

              <h3>{platform.name}</h3>
              <p className="platform-description">{platform.description}</p>

              {platform.rating && (
                <div className="rating">⭐ {platform.rating.toFixed(1)}/5.0</div>
              )}

              {platform.pricing && (
                <div className="pricing-badge">💰 {platform.pricing}</div>
              )}

              {platform.tags && platform.tags.length > 0 && (
                <div className="tags">
                  {platform.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              <button className="view-details-btn">View Details →</button>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button onClick={resetQuiz} className="retake-quiz-btn">
            🔄 Retake Quiz
          </button>
          <button onClick={() => navigate('/')} className="browse-all-btn">
            Browse All Platforms
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Finding your perfect AI platforms...</p>
      </div>
    );
  }

  return (
    <div className="platform-selector-quiz">
      <div className="quiz-header">
        <h2>🎯 AI Platform Selector Quiz</h2>
        <p>Answer 6 quick questions to get personalized platform recommendations</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="quiz-question">
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.description && (
          <p className="question-description">{currentQuestion.description}</p>
        )}

        <div className={`quiz-options ${currentQuestion.type === 'multiple' ? 'multiple' : ''}`}>
          {currentQuestion.options.map((option) => (
            <div
              key={option.value}
              className={`quiz-option ${selectedOptions.includes(option.value) ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.icon && <span className="option-icon">{option.icon}</span>}
              <div className="option-content">
                <div className="option-label">{option.label}</div>
                {option.description && (
                  <div className="option-description">{option.description}</div>
                )}
              </div>
              {currentQuestion.type === 'multiple' && (
                <div className="checkbox">
                  {selectedOptions.includes(option.value) && '✓'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="quiz-back-btn"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={selectedOptions.length === 0}
          className="quiz-next-btn"
        >
          {isLastQuestion ? 'Get Recommendations 🎉' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

export default PlatformSelectorQuiz;
