import React from 'react';
import DaycareCard from './DaycareCard';
import '../styles/DaycareGrid.css';

interface Daycare {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: {
    address: string;
    neighborhood: string;
    public_transit?: string[];
  };
  licensing: {
    status: string;
    inspection_score?: number;
  };
  program: {
    age_groups: string[];
    curriculum?: string;
    languages?: string[];
  };
  availability: {
    accepting_enrollment: boolean;
    infant_spots?: number;
    toddler_spots?: number;
    preschool_spots?: number;
  };
  pricing: {
    infant_monthly?: number;
    toddler_monthly?: number;
    preschool_monthly?: number;
  };
  features?: string[];
  ratings: {
    overall: number;
    review_count: number;
  };
  premium?: {
    is_premium: boolean;
    tier?: string | null;
  };
  verified?: boolean;
}

interface DaycareGridProps {
  daycares: Daycare[];
  loading?: boolean;
  emptyMessage?: string;
}

const DaycareGrid: React.FC<DaycareGridProps> = ({
  daycares,
  loading = false,
  emptyMessage = 'No daycares found matching your criteria.'
}) => {
  if (loading) {
    return (
      <div className="daycare-grid-loading">
        <div className="spinner"></div>
        <p>Loading daycares...</p>
      </div>
    );
  }

  if (daycares.length === 0) {
    return (
      <div className="daycare-grid-empty">
        <div className="empty-icon">🏫</div>
        <h3>No Results Found</h3>
        <p>{emptyMessage}</p>
        <p className="empty-hint">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="daycare-grid-container">
      <div className="daycare-grid-header">
        <p className="results-count">
          <strong>{daycares.length}</strong> daycare{daycares.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="daycare-grid">
        {daycares.map((daycare) => (
          <DaycareCard key={daycare.id} daycare={daycare} />
        ))}
      </div>
    </div>
  );
};

export default DaycareGrid;
