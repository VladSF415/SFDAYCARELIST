// ==============================================================================
// TRANSIT PULSE MAP - TYPE DEFINITIONS
// ==============================================================================

import type { Daycare, FilterState } from '../../types/components';

export interface TransitPulseMapProps {
  daycares: Daycare[];
  filters?: FilterState;
  selectedDaycareId?: string;
  onDaycareClick?: (daycareId: string) => void;
  commuteMode?: boolean;
}

export interface MapState {
  zoom: number;
  center: [number, number]; // [lng, lat]
  pitch: number;
  bearing: number;
}

export interface CommuteOverlayState {
  workAddress: string;
  isActive: boolean;
  highlightedDaycares: string[]; // IDs of daycares within commute range
}

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleTransitLayers: () => void;
  onToggleCommuteOverlay: () => void;
  showTransitLayers: boolean;
  commuteMode: boolean;
}

export interface CommuteOverlayProps {
  workAddress: string;
  onWorkAddressChange: (address: string) => void;
  onActivate: () => void;
  onDeactivate: () => void;
  isActive: boolean;
}
