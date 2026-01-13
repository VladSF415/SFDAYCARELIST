// ==============================================================================
// MAP CONTROLS - Control Panel for Map Interactions
// ==============================================================================

import type { MapControlsProps } from './types';

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleTransitLayers,
  onToggleCommuteOverlay,
  showTransitLayers,
  commuteMode,
}: MapControlsProps) {
  return (
    <div className="map-controls">
      {/* Zoom Controls */}
      <div className="map-controls-group">
        <button
          className="map-control-btn"
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          className="map-control-btn"
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
      </div>

      {/* View Controls */}
      <div className="map-controls-group">
        <button
          className="map-control-btn"
          onClick={onResetView}
          aria-label="Reset view"
          title="Reset to SF overview"
        >
          <span className="map-control-icon">🗺️</span>
        </button>
      </div>

      {/* Layer Toggles */}
      <div className="map-controls-group">
        <button
          className={`map-control-btn ${showTransitLayers ? 'active' : ''}`}
          onClick={onToggleTransitLayers}
          aria-label="Toggle transit layers"
          title="Show/hide transit lines"
        >
          <span className="map-control-icon">🚇</span>
        </button>
        <button
          className={`map-control-btn ${commuteMode ? 'active' : ''}`}
          onClick={onToggleCommuteOverlay}
          aria-label="Toggle commute overlay"
          title="Find commute-friendly daycares"
        >
          <span className="map-control-icon">🚶</span>
        </button>
      </div>
    </div>
  );
}
