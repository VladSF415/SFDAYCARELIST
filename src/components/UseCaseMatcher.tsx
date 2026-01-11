import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import '../styles/InteractiveComponents.css';

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
}

const NLP_USE_CASES: UseCase[] = [
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Analysis',
    description: 'Analyze emotions and opinions in text',
    icon: '😊',
    keywords: ['sentiment', 'emotion', 'opinion', 'analysis']
  },
  {
    id: 'text-classification',
    title: 'Text Classification',
    description: 'Categorize and label documents automatically',
    icon: '🏷️',
    keywords: ['classification', 'categorization', 'labeling', 'tagging']
  },
  {
    id: 'named-entity-recognition',
    title: 'Named Entity Recognition',
    description: 'Extract names, locations, organizations from text',
    icon: '🎯',
    keywords: ['NER', 'entity', 'extraction', 'recognition']
  },
  {
    id: 'text-summarization',
    title: 'Text Summarization',
    description: 'Generate concise summaries of long documents',
    icon: '📄',
    keywords: ['summarization', 'summary', 'condensed', 'brief']
  },
  {
    id: 'question-answering',
    title: 'Question Answering',
    description: 'Build systems that answer questions from text',
    icon: '❓',
    keywords: ['QA', 'question', 'answering', 'chatbot']
  },
  {
    id: 'translation',
    title: 'Machine Translation',
    description: 'Translate text between languages',
    icon: '🌐',
    keywords: ['translation', 'multilingual', 'language', 'translate']
  },
  {
    id: 'text-generation',
    title: 'Text Generation',
    description: 'Generate human-like text content',
    icon: '✍️',
    keywords: ['generation', 'GPT', 'content', 'writing']
  },
  {
    id: 'speech-recognition',
    title: 'Speech to Text',
    description: 'Convert speech to written text',
    icon: '🎤',
    keywords: ['speech', 'transcription', 'voice', 'STT']
  }
];

export function UseCaseMatcher() {
  const navigate = useNavigate();
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [matchedPlatforms, setMatchedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUseCase) {
      findMatchingPlatforms();
    }
  }, [selectedUseCase]);

  const findMatchingPlatforms = async () => {
    if (!selectedUseCase) return;

    setLoading(true);
    try {
      const useCase = NLP_USE_CASES.find(uc => uc.id === selectedUseCase);
      if (!useCase) return;

      // Fetch NLP platforms
      const response = await fetch('/api/platforms?category=nlp&limit=100');
      const data = await response.json();
      let platforms = data.platforms || [];

      // Filter platforms by use case keywords
      const scored = platforms.map((platform: Platform) => {
        let score = 0;

        // Check description
        const description = platform.description?.toLowerCase() || '';
        useCase.keywords.forEach(keyword => {
          if (description.includes(keyword.toLowerCase())) score += 3;
        });

        // Check features
        if (platform.features) {
          platform.features.forEach(feature => {
            const featureText = feature.toLowerCase();
            useCase.keywords.forEach(keyword => {
              if (featureText.includes(keyword.toLowerCase())) score += 5;
            });
          });
        }

        // Check use_cases field
        if (platform.use_cases) {
          platform.use_cases.forEach(uc => {
            const ucText = typeof uc === 'string' ? uc.toLowerCase() : '';
            useCase.keywords.forEach(keyword => {
              if (ucText.includes(keyword.toLowerCase())) score += 4;
            });
          });
        }

        // Check tags
        if (platform.tags) {
          platform.tags.forEach(tag => {
            const tagText = tag.toLowerCase();
            useCase.keywords.forEach(keyword => {
              if (tagText.includes(keyword.toLowerCase())) score += 2;
            });
          });
        }

        return { platform, score };
      });

      // Sort by score and filter out zero-score platforms
      const matched = scored
        .filter((item: { platform: Platform; score: number }) => item.score > 0)
        .sort((a: { platform: Platform; score: number }, b: { platform: Platform; score: number }) => b.score - a.score)
        .map((item: { platform: Platform; score: number }) => item.platform);

      setMatchedPlatforms(matched);
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
    setLoading(false);
  };

  return (
    <div className="use-case-matcher">
      <h3>🎯 Find NLP Tools by Use Case</h3>
      <p className="widget-description">
        Select your use case to discover the best NLP platforms and tools
      </p>

      <div className="use-case-grid">
        {NLP_USE_CASES.map(useCase => (
          <div
            key={useCase.id}
            className={`use-case-card ${selectedUseCase === useCase.id ? 'selected' : ''}`}
            onClick={() => setSelectedUseCase(useCase.id)}
          >
            <div className="use-case-icon">{useCase.icon}</div>
            <div className="use-case-title">{useCase.title}</div>
            <div className="use-case-description">{useCase.description}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Finding matching platforms...</p>
        </div>
      )}

      {!loading && selectedUseCase && matchedPlatforms.length > 0 && (
        <div className="matched-results">
          <h4>
            {matchedPlatforms.length} platforms found for {NLP_USE_CASES.find(uc => uc.id === selectedUseCase)?.title}
          </h4>

          <div className="matched-platforms">
            {matchedPlatforms.map((platform, index) => (
              <div
                key={platform.id}
                className="matched-platform-card"
                onClick={() => navigate(`/platform/${platform.slug}`)}
              >
                <div className="match-rank">#{index + 1}</div>
                <h5>{platform.name}</h5>
                <p>{platform.description?.substring(0, 150)}...</p>

                {platform.rating && (
                  <div className="rating">⭐ {platform.rating.toFixed(1)}/5.0</div>
                )}

                {platform.pricing && (
                  <div className="pricing-badge">{platform.pricing}</div>
                )}

                <button className="view-platform-btn">View Details →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && selectedUseCase && matchedPlatforms.length === 0 && (
        <div className="no-results">
          <p>No platforms found for this use case. Try selecting a different one.</p>
        </div>
      )}
    </div>
  );
}

export default UseCaseMatcher;
