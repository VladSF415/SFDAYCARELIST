import { useState } from 'react';
import '../styles/InteractiveComponents.css';

interface ROIInputs {
  currentMonthlyCost: number;
  automationPercentage: number;
  platformMonthlyFee: number;
  implementationCost: number;
  teamSize: number;
}

interface ROIResults {
  monthlySavings: number;
  paybackMonths: number;
  roi12Month: number;
  tco36Month: number;
  totalSavings36Month: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    currentMonthlyCost: 10000,
    automationPercentage: 50,
    platformMonthlyFee: 500,
    implementationCost: 5000,
    teamSize: 5
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof ROIInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs({ ...inputs, [field]: numValue });
  };

  const calculateROI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculator/roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('ROI calculation error:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="roi-calculator">
      <h3>💰 Computer Vision ROI Calculator</h3>
      <p className="calculator-description">
        Calculate the return on investment for implementing computer vision solutions
      </p>

      <div className="calculator-form">
        <div className="form-group">
          <label className="form-label">
            Current Monthly Manual Processing Cost
          </label>
          <input
            type="number"
            className="form-input"
            value={inputs.currentMonthlyCost}
            onChange={(e) => handleInputChange('currentMonthlyCost', e.target.value)}
            placeholder="10000"
          />
          <span className="input-hint">
            Average cost of manual image/video processing per month
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Expected Automation Percentage
          </label>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.automationPercentage}
              onChange={(e) => handleInputChange('automationPercentage', e.target.value)}
              className="slider"
            />
            <span className="slider-value">{inputs.automationPercentage}%</span>
          </div>
          <span className="input-hint">
            Percentage of manual work that will be automated
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Platform Monthly Fee
          </label>
          <input
            type="number"
            className="form-input"
            value={inputs.platformMonthlyFee}
            onChange={(e) => handleInputChange('platformMonthlyFee', e.target.value)}
            placeholder="500"
          />
          <span className="input-hint">
            Monthly subscription cost for the CV platform
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            One-Time Implementation Cost
          </label>
          <input
            type="number"
            className="form-input"
            value={inputs.implementationCost}
            onChange={(e) => handleInputChange('implementationCost', e.target.value)}
            placeholder="5000"
          />
          <span className="input-hint">
            Setup, integration, and training costs
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Team Size
          </label>
          <input
            type="number"
            className="form-input"
            value={inputs.teamSize}
            onChange={(e) => handleInputChange('teamSize', e.target.value)}
            placeholder="5"
          />
          <span className="input-hint">
            Number of team members using the platform
          </span>
        </div>

        <button
          onClick={calculateROI}
          disabled={loading}
          className="calculate-btn"
        >
          {loading ? 'Calculating...' : '🧮 Calculate ROI'}
        </button>
      </div>

      {results && (
        <div className="roi-results">
          <h4>📊 Your ROI Analysis</h4>

          <div className="results-grid">
            <div className="result-card positive">
              <div className="result-value">{formatCurrency(results.monthlySavings)}</div>
              <div className="result-label">Monthly Savings</div>
            </div>

            <div className="result-card">
              <div className="result-value">{results.paybackMonths}</div>
              <div className="result-label">Payback Period (Months)</div>
            </div>

            <div className="result-card positive">
              <div className="result-value">{formatPercent(results.roi12Month)}</div>
              <div className="result-label">12-Month ROI</div>
            </div>

            <div className="result-card">
              <div className="result-value">{formatCurrency(results.tco36Month)}</div>
              <div className="result-label">3-Year Total Cost</div>
            </div>

            <div className="result-card positive">
              <div className="result-value">{formatCurrency(results.totalSavings36Month)}</div>
              <div className="result-label">3-Year Total Savings</div>
            </div>
          </div>

          <div className="roi-insights">
            <h5>💡 Key Insights</h5>
            <ul>
              <li>
                You'll save <strong>{formatCurrency(results.monthlySavings)}</strong> per month
                after platform costs
              </li>
              <li>
                Your investment will pay back in <strong>{results.paybackMonths} months</strong>
              </li>
              <li>
                Over 3 years, you'll save a total of{' '}
                <strong>{formatCurrency(results.totalSavings36Month)}</strong>
              </li>
              {results.roi12Month > 100 && (
                <li className="highlight">
                  ⭐ Excellent ROI! You'll more than double your investment in the first year
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ROICalculator;
