import { useState } from 'react';
import '../styles/InteractiveComponents.css';

interface CriteriaScore {
  id: string;
  title: string;
  description: string;
  score: number;
}

const CRITERIA: Omit<CriteriaScore, 'score'>[] = [
  {
    id: 'security',
    title: '🔒 Security & Compliance',
    description: 'SOC 2, HIPAA, GDPR compliance capabilities'
  },
  {
    id: 'scalability',
    title: '📈 Scalability',
    description: 'Ability to handle growing data and users'
  },
  {
    id: 'integration',
    title: '🔗 Integration Capabilities',
    description: 'APIs, SSO, existing system compatibility'
  },
  {
    id: 'support',
    title: '💬 Enterprise Support',
    description: 'Dedicated support, SLAs, training available'
  },
  {
    id: 'customization',
    title: '🔧 Customization',
    description: 'Ability to tailor platform to specific needs'
  },
  {
    id: 'team-readiness',
    title: '👥 Team Readiness',
    description: 'Team\'s technical skills and AI expertise'
  },
  {
    id: 'data-infrastructure',
    title: '💾 Data Infrastructure',
    description: 'Quality and organization of existing data'
  },
  {
    id: 'budget',
    title: '💰 Budget & Resources',
    description: 'Available budget for implementation and operation'
  }
];

export function ReadinessAssessment() {
  const [scores, setScores] = useState<CriteriaScore[]>(
    CRITERIA.map(c => ({ ...c, score: 0 }))
  );
  const [showResults, setShowResults] = useState(false);

  const updateScore = (id: string, score: number) => {
    setScores(scores.map(s => s.id === id ? { ...s, score } : s));
  };

  const calculateResults = () => {
    setShowResults(true);
  };

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const averageScore = totalScore / scores.length;
  const maxScore = scores.length * 5;
  const percentageScore = (totalScore / maxScore) * 100;

  const getMaturityLevel = () => {
    if (percentageScore >= 80) return { level: 'Advanced', color: '#10b981', icon: '🌟' };
    if (percentageScore >= 60) return { level: 'Intermediate', color: '#f59e0b', icon: '⚡' };
    if (percentageScore >= 40) return { level: 'Developing', color: '#3b82f6', icon: '🚀' };
    return { level: 'Early Stage', color: '#6b7280', icon: '🌱' };
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];
    const maturity = getMaturityLevel();

    if (maturity.level === 'Advanced') {
      recommendations.push('You\'re ready for advanced enterprise AI platforms');
      recommendations.push('Consider platforms with extensive customization options');
      recommendations.push('Look for vendors with proven enterprise track records');
    } else if (maturity.level === 'Intermediate') {
      recommendations.push('Focus on platforms with strong support and training');
      recommendations.push('Start with managed solutions to reduce complexity');
      recommendations.push('Invest in team training and skill development');
    } else if (maturity.level === 'Developing') {
      recommendations.push('Begin with user-friendly, low-code platforms');
      recommendations.push('Build foundational data infrastructure first');
      recommendations.push('Consider starting with a pilot project');
    } else {
      recommendations.push('Start with education and planning phase');
      recommendations.push('Assess and organize your data first');
      recommendations.push('Build internal AI literacy before platform selection');
    }

    // Add specific recommendations based on low scores
    scores.forEach(score => {
      if (score.score <= 2) {
        if (score.id === 'security') {
          recommendations.push('⚠️ Prioritize security compliance training and assessment');
        } else if (score.id === 'team-readiness') {
          recommendations.push('⚠️ Invest in AI/ML training for your team');
        } else if (score.id === 'data-infrastructure') {
          recommendations.push('⚠️ Focus on data quality and organization initiatives');
        }
      }
    });

    return recommendations;
  };

  const maturity = getMaturityLevel();

  return (
    <div className="readiness-assessment">
      <h3>🎯 Enterprise AI Readiness Assessment</h3>
      <p className="assessment-description">
        Evaluate your organization's readiness for enterprise AI adoption across 8 key criteria
      </p>

      <div className="assessment-criteria">
        {scores.map(criteria => (
          <div key={criteria.id} className="criteria-item">
            <div className="criteria-header">
              <div>
                <div className="criteria-title">{criteria.title}</div>
                <div className="criteria-description">{criteria.description}</div>
              </div>
              <div className="score-selector">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    className={`score-btn ${criteria.score === score ? 'selected' : ''}`}
                    onClick={() => updateScore(criteria.id, score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculateResults}
        disabled={scores.some(s => s.score === 0)}
        className="calculate-btn"
      >
        {showResults ? '🔄 Recalculate Assessment' : '📊 Calculate Readiness Score'}
      </button>

      {showResults && (
        <div className="assessment-results">
          <div className="maturity-level">
            <div className="maturity-icon" style={{ fontSize: '4rem' }}>
              {maturity.icon}
            </div>
            <div className="maturity-score" style={{ color: maturity.color }}>
              {percentageScore.toFixed(0)}%
            </div>
            <div className="maturity-label">
              {maturity.level} Readiness
            </div>
            <div className="maturity-description">
              Average score: {averageScore.toFixed(1)}/5.0
            </div>
          </div>

          <div className="score-breakdown">
            <h5>📋 Score Breakdown</h5>
            <div className="breakdown-grid">
              {scores.map(criteria => (
                <div key={criteria.id} className="breakdown-item">
                  <div className="breakdown-label">{criteria.title}</div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${(criteria.score / 5) * 100}%`,
                        backgroundColor: criteria.score >= 4 ? '#10b981' :
                                       criteria.score >= 3 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <div className="breakdown-score">{criteria.score}/5</div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-section">
            <h5>💡 Recommendations</h5>
            <ul className="recommendations-list">
              {getRecommendations().map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="next-steps">
            <h5>🚀 Recommended Next Steps</h5>
            <div className="next-steps-cards">
              <div className="next-step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h6>Explore Enterprise Platforms</h6>
                  <p>Browse platforms that match your maturity level</p>
                </div>
              </div>
              <div className="next-step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h6>Schedule Vendor Demos</h6>
                  <p>Connect with 3-5 top-rated platforms for demos</p>
                </div>
              </div>
              <div className="next-step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h6>Start Pilot Project</h6>
                  <p>Test selected platforms with a small-scale pilot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadinessAssessment;
