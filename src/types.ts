export interface Platform {
  id: string;
  name: string;
  description: string;
  category: string;
  slug?: string;
  website?: string;
  url?: string;
  rating?: number;
  featured?: boolean;
  verified?: boolean;
  tags?: string[];
  pricing?: string;
  features?: string[];
  use_cases?: string[];
  affiliate_url?: string;
  featured_tier?: 'basic' | 'premium' | 'enterprise';
  clicks?: number;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface SubmitToolForm {
  name: string;
  description: string;
  website: string;
  category: string;
  pricing: string;
  contactEmail: string;
  wantsFeatured: boolean;
  featuredTier?: 'basic' | 'premium' | 'enterprise';
}

export interface AnalyticsEvent {
  type: 'click' | 'view' | 'submit';
  platformId?: string;
  metadata?: Record<string, any>;
}
