// ==============================================================================
// SAFETY SNAPSHOT TILE - 2x2 Icon Grid for Safety Metrics
// ==============================================================================

import { motion } from 'framer-motion';
import type { Daycare, SafetyMetric } from '../../types/components';

interface SafetySnapshotTileProps {
  daycare: Daycare;
}

// Helper to get safety metrics from daycare data
function getSafetyMetrics(daycare: Daycare): SafetyMetric[] {
  const metrics: SafetyMetric[] = [];

  // License Status
  const licenseStatus = daycare.licensing.status === 'active';
  metrics.push({
    label: 'Licensed',
    value: licenseStatus ? 'Active' : 'Inactive',
    icon: licenseStatus ? '✓' : '⚠',
    status: licenseStatus ? 'good' : 'poor',
    color: licenseStatus ? 'var(--color-success)' : 'var(--color-error)',
  });

  // Inspection Score
  const inspectionScore = daycare.licensing.inspection_score;
  let scoreStatus: 'good' | 'warning' | 'poor' = 'good';
  if (inspectionScore < 80) scoreStatus = 'poor';
  else if (inspectionScore < 90) scoreStatus = 'warning';

  metrics.push({
    label: 'Inspection',
    value: `${inspectionScore}%`,
    icon: '📋',
    status: scoreStatus,
    color:
      scoreStatus === 'good'
        ? 'var(--color-success)'
        : scoreStatus === 'warning'
        ? 'var(--color-warning)'
        : 'var(--color-error)',
  });

  // Staff Ratio (from features)
  const hasGoodRatio = daycare.features.some(f => f.toLowerCase().includes('ratio'));
  metrics.push({
    label: 'Staff Ratio',
    value: hasGoodRatio ? 'Excellent' : 'Good',
    icon: '👥',
    status: hasGoodRatio ? 'good' : 'warning',
    color: hasGoodRatio ? 'var(--color-success)' : 'var(--color-warning)',
  });

  // Security (cameras, safety features)
  const hasSecurity = daycare.features.some(
    f => f.toLowerCase().includes('camera') || f.toLowerCase().includes('security')
  );
  metrics.push({
    label: 'Security',
    value: hasSecurity ? 'Cameras' : 'Standard',
    icon: '📹',
    status: hasSecurity ? 'good' : 'warning',
    color: hasSecurity ? 'var(--color-success)' : 'var(--color-warning)',
  });

  return metrics;
}

export default function SafetySnapshotTile({ daycare }: SafetySnapshotTileProps) {
  const metrics = getSafetyMetrics(daycare);

  return (
    <motion.div
      className="bento-tile bento-tile-small safety-snapshot-tile"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <h4 className="bento-tile-title">Safety Snapshot</h4>

      <div className="safety-metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="safety-metric" data-status={metric.status}>
            <div className="safety-metric-icon" style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div className="safety-metric-label">{metric.label}</div>
            <div className="safety-metric-value">{metric.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
