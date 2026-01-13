// ==============================================================================
// SF DAYCARE LIST - NEW COMPONENT TYPE DEFINITIONS
// ==============================================================================

// ==============================================================================
// DAYCARE TYPES (Core Data Model)
// ==============================================================================

export interface DaycareContact {
  phone: string;
  email: string;
  website: string;
}

export interface DaycareLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  public_transit?: string[];
}

export interface DaycareLicensing {
  license_number: string;
  status: string;
  type: string;
  capacity: number;
  issued_date: string;
  expiration_date: string;
  last_inspection: string;
  inspection_score: number;
  violations: string[];
  data_source: string;
}

export interface DaycareProgram {
  age_groups: ('infant' | 'toddler' | 'preschool')[];
  ages_min_months: number;
  ages_max_years: number;
  languages: string[];
  curriculum: string;
  special_programs: string[];
}

export interface DaycareAvailability {
  accepting_enrollment: boolean;
  infant_spots: number;
  toddler_spots: number;
  preschool_spots: number;
  waitlist_available: boolean;
  last_updated: string;
}

export interface DaycareHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface DaycarePricing {
  infant_monthly: number;
  toddler_monthly: number;
  preschool_monthly: number;
  part_time_available: boolean;
  financial_aid: boolean;
  accepts_subsidy: string[];
}

export interface DaycareRatings {
  overall: number;
  safety: number;
  education: number;
  staff: number;
  facilities: number;
  nutrition: number;
  review_count: number;
  verified_reviews: number;
}

export interface DaycarePremium {
  is_premium: boolean;
  tier: 'basic' | 'premium' | 'enterprise' | null;
  featured_until: string | null;
}

export interface DaycareSEO {
  meta_title: string;
  meta_description: string;
}

export interface Daycare {
  id: string;
  name: string;
  slug: string;
  description: string;
  contact: DaycareContact;
  location: DaycareLocation;
  licensing: DaycareLicensing;
  program: DaycareProgram;
  availability: DaycareAvailability;
  hours: DaycareHours;
  pricing: DaycarePricing;
  features: string[];
  ratings: DaycareRatings;
  reviews: any[]; // Can be extended with proper Review interface
  photos: string[];
  premium: DaycarePremium;
  verified: boolean;
  claimed_by_owner: boolean;
  owner_email: string | null;
  seo: DaycareSEO;
  created_at: string;
  updated_at: string;
  coordinates?: [number, number]; // [lng, lat] for Mapbox
  distance_to_user?: number; // Calculated in frontend
}

// ==============================================================================
// MAP COMPONENT TYPES
// ==============================================================================

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TransitStation {
  name: string;
  lat: number;
  lng: number;
  type: 'muni' | 'bart';
}

export interface TransitLine {
  name: string;
  coordinates: number[][]; // Array of [lat, lng] pairs (JSON doesn't preserve tuple types)
  color: string;
  type: 'muni' | 'bart' | 'slow-street';
}

export interface TransitData {
  bart_stations: TransitStation[];
  muni_lines: TransitLine[];
  slow_streets?: TransitLine[];
  sf_bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface MapMarker {
  id: string;
  daycare: Daycare;
  position: [number, number]; // [lng, lat]
  highlighted?: boolean;
  hasImmediateOpening?: boolean;
}

export interface FilterState {
  neighborhoods: string[];
  ageGroups: ('infant' | 'toddler' | 'preschool')[];
  acceptingEnrollment: boolean | null;
  verified: boolean | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  searchQuery?: string;
}

// ==============================================================================
// QUIZ COMPONENT TYPES
// ==============================================================================

export interface QuizAnswer {
  crossStreet?: string;
  childAge?: 'infant' | 'toddler' | 'preschool';
  mustHave?: ('transit' | 'bilingual' | 'outdoor' | 'organic')[];
}

export interface DaycareMatch {
  daycare: Daycare;
  score: number;
  reasons: string[];
}

export interface QuizStep {
  id: number;
  title: string;
  question: string;
  type: 'text' | 'single-choice' | 'multi-choice';
  options?: QuizOption[];
}

export interface QuizOption {
  value: string;
  label: string;
  icon: string;
  description?: string;
}

// ==============================================================================
// ACTIVITY FEED TYPES
// ==============================================================================

export type ActivityType = 'new_opening' | 'tour_activity' | 'enrollment' | 'review';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  icon: string;
  timestamp: Date;
  daycareSlug?: string;
  daycareName?: string;
  neighborhood?: string;
}

export interface ActivityTemplate {
  type: ActivityType;
  templates: string[];
  icon: string;
}

// ==============================================================================
// BENTO GRID TYPES
// ==============================================================================

export type TileSize = 'small' | 'medium' | 'large' | 'wide';

export type TileType = 'vibe' | 'parent-pulse' | 'safety-snapshot' | 'info';

export interface BentoTile {
  id: string;
  type: TileType;
  size: TileSize;
  daycare: Daycare;
  order: number;
}

export interface SafetyMetric {
  label: string;
  value: string | number;
  icon: string;
  status: 'good' | 'warning' | 'poor';
  color: string;
}

export interface ParentReview {
  quote: string;
  author: string;
  role: string;
  rating: number;
  neighborhood?: string;
}

// ==============================================================================
// NEIGHBORHOOD THEME TYPES
// ==============================================================================

export interface NeighborhoodTheme {
  primary: string;
  secondary: string;
  gradient: string;
  icon: string;
}

export interface Neighborhood {
  slug: string;
  name: string;
  description: string;
  daycare_count: number;
  center_coordinates?: {
    lat: number;
    lng: number;
  };
  parks?: string[];
  bart_stations?: string[];
  local_favorites?: string[];
  community_tips?: string[];
  best_for?: string[];
  theme?: NeighborhoodTheme;
}

export interface NeighborhoodTip {
  category: 'parks' | 'transit' | 'cafes' | 'schools' | 'community';
  icon: string;
  title: string;
  items: string[];
}

// ==============================================================================
// VIEW MODE TYPES
// ==============================================================================

export type ViewMode = 'grid' | 'bento' | 'map';

// ==============================================================================
// COMMON UI TYPES
// ==============================================================================

export interface ToastPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
