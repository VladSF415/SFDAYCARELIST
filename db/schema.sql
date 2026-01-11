-- SF Daycare List Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  daycare_count INTEGER DEFAULT 0,
  center_lat DECIMAL(10, 8),
  center_lng DECIMAL(11, 8),
  zip_codes TEXT[], -- Array of zip codes
  nearby_neighborhoods TEXT[], -- Array of slugs
  bart_stations TEXT[],
  parks TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daycares table
CREATE TABLE IF NOT EXISTS daycares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,

  -- Contact information
  contact_phone VARCHAR(50),
  contact_email VARCHAR(200),
  contact_website VARCHAR(500),

  -- Location
  location_address VARCHAR(300) NOT NULL,
  location_city VARCHAR(100) NOT NULL DEFAULT 'San Francisco',
  location_state VARCHAR(2) NOT NULL DEFAULT 'CA',
  location_zip VARCHAR(10) NOT NULL,
  location_neighborhood VARCHAR(100) NOT NULL REFERENCES neighborhoods(slug) ON DELETE CASCADE,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  location_public_transit TEXT[], -- Array of transit options

  -- Licensing
  license_number VARCHAR(50) UNIQUE,
  license_status VARCHAR(50) DEFAULT 'active',
  license_type VARCHAR(100),
  license_capacity INTEGER,
  license_issued_date DATE,
  license_expiration_date DATE,
  license_last_inspection DATE,
  license_inspection_score INTEGER,
  license_violations TEXT[], -- Array of violation descriptions
  license_data_source VARCHAR(200),

  -- Program details
  program_age_groups TEXT[] NOT NULL, -- ['infant', 'toddler', 'preschool']
  program_ages_min_months INTEGER,
  program_ages_max_years INTEGER,
  program_languages TEXT[] DEFAULT ARRAY['English'],
  program_curriculum VARCHAR(100),
  program_special_programs TEXT[],

  -- Availability
  availability_accepting_enrollment BOOLEAN DEFAULT true,
  availability_infant_spots INTEGER DEFAULT 0,
  availability_toddler_spots INTEGER DEFAULT 0,
  availability_preschool_spots INTEGER DEFAULT 0,
  availability_waitlist_available BOOLEAN DEFAULT true,
  availability_last_updated DATE DEFAULT CURRENT_DATE,

  -- Hours (stored as JSON for flexibility)
  hours JSONB DEFAULT '{"monday":"Closed","tuesday":"Closed","wednesday":"Closed","thursday":"Closed","friday":"Closed","saturday":"Closed","sunday":"Closed"}',

  -- Pricing
  pricing_infant_monthly INTEGER,
  pricing_toddler_monthly INTEGER,
  pricing_preschool_monthly INTEGER,
  pricing_part_time_available BOOLEAN DEFAULT false,
  pricing_financial_aid BOOLEAN DEFAULT false,
  pricing_accepts_subsidy TEXT[], -- ['Title 5', 'CCPP']

  -- Features
  features TEXT[],

  -- Ratings
  ratings_overall DECIMAL(2, 1) DEFAULT 0.0,
  ratings_safety DECIMAL(2, 1) DEFAULT 0.0,
  ratings_education DECIMAL(2, 1) DEFAULT 0.0,
  ratings_staff DECIMAL(2, 1) DEFAULT 0.0,
  ratings_facilities DECIMAL(2, 1) DEFAULT 0.0,
  ratings_nutrition DECIMAL(2, 1) DEFAULT 0.0,
  ratings_review_count INTEGER DEFAULT 0,
  ratings_verified_reviews INTEGER DEFAULT 0,

  -- Premium/Featured status
  premium_is_premium BOOLEAN DEFAULT false,
  premium_tier VARCHAR(50), -- 'premium', 'premium_plus'
  premium_featured_until DATE,

  -- Verification
  verified BOOLEAN DEFAULT false,
  claimed_by_owner BOOLEAN DEFAULT false,
  owner_email VARCHAR(200),

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for common queries
  CONSTRAINT check_inspection_score CHECK (license_inspection_score >= 0 AND license_inspection_score <= 100),
  CONSTRAINT check_ratings CHECK (
    ratings_overall >= 0 AND ratings_overall <= 5 AND
    ratings_safety >= 0 AND ratings_safety <= 5 AND
    ratings_education >= 0 AND ratings_education <= 5 AND
    ratings_staff >= 0 AND ratings_staff <= 5 AND
    ratings_facilities >= 0 AND ratings_facilities <= 5 AND
    ratings_nutrition >= 0 AND ratings_nutrition <= 5
  )
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daycare_id UUID NOT NULL REFERENCES daycares(id) ON DELETE CASCADE,

  -- Review content
  parent_name VARCHAR(200),
  parent_email VARCHAR(200),
  title VARCHAR(300),
  content TEXT NOT NULL,

  -- Ratings
  overall_rating DECIMAL(2, 1) NOT NULL,
  safety_rating DECIMAL(2, 1),
  education_rating DECIMAL(2, 1),
  staff_rating DECIMAL(2, 1),
  facilities_rating DECIMAL(2, 1),
  nutrition_rating DECIMAL(2, 1),

  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  verified_by VARCHAR(200),

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderation_notes TEXT,

  -- Helpfulness
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT check_overall_rating CHECK (overall_rating >= 1 AND overall_rating <= 5),
  CONSTRAINT check_safety_rating CHECK (safety_rating IS NULL OR (safety_rating >= 1 AND safety_rating <= 5)),
  CONSTRAINT check_education_rating CHECK (education_rating IS NULL OR (education_rating >= 1 AND education_rating <= 5)),
  CONSTRAINT check_staff_rating CHECK (staff_rating IS NULL OR (staff_rating >= 1 AND staff_rating <= 5)),
  CONSTRAINT check_facilities_rating CHECK (facilities_rating IS NULL OR (facilities_rating >= 1 AND facilities_rating <= 5)),
  CONSTRAINT check_nutrition_rating CHECK (nutrition_rating IS NULL OR (nutrition_rating >= 1 AND nutrition_rating <= 5))
);

-- Analytics table (for tracking searches, clicks, etc.)
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL, -- 'search', 'view', 'click', 'filter'

  -- Context
  daycare_id UUID REFERENCES daycares(id) ON DELETE SET NULL,
  neighborhood_slug VARCHAR(100) REFERENCES neighborhoods(slug) ON DELETE SET NULL,

  -- Event data
  search_query TEXT,
  filters JSONB,

  -- User context
  session_id VARCHAR(200),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daycares_neighborhood ON daycares(location_neighborhood);
CREATE INDEX IF NOT EXISTS idx_daycares_slug ON daycares(slug);
CREATE INDEX IF NOT EXISTS idx_daycares_premium ON daycares(premium_is_premium, premium_featured_until);
CREATE INDEX IF NOT EXISTS idx_daycares_verified ON daycares(verified);
CREATE INDEX IF NOT EXISTS idx_daycares_accepting ON daycares(availability_accepting_enrollment);
CREATE INDEX IF NOT EXISTS idx_daycares_age_groups ON daycares USING GIN(program_age_groups);
CREATE INDEX IF NOT EXISTS idx_daycares_created_at ON daycares(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_daycare ON reviews(daycare_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_daycare ON analytics(daycare_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_daycares_updated_at BEFORE UPDATE ON daycares
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update daycare ratings when reviews change
CREATE OR REPLACE FUNCTION update_daycare_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE daycares SET
    ratings_overall = COALESCE((
      SELECT AVG(overall_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved'
    ), 0),
    ratings_safety = COALESCE((
      SELECT AVG(safety_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND safety_rating IS NOT NULL
    ), 0),
    ratings_education = COALESCE((
      SELECT AVG(education_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND education_rating IS NOT NULL
    ), 0),
    ratings_staff = COALESCE((
      SELECT AVG(staff_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND staff_rating IS NOT NULL
    ), 0),
    ratings_facilities = COALESCE((
      SELECT AVG(facilities_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND facilities_rating IS NOT NULL
    ), 0),
    ratings_nutrition = COALESCE((
      SELECT AVG(nutrition_rating)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND nutrition_rating IS NOT NULL
    ), 0),
    ratings_review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved'
    ),
    ratings_verified_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE daycare_id = NEW.daycare_id AND status = 'approved' AND verified = true
    )
  WHERE id = NEW.daycare_id;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update ratings
CREATE TRIGGER update_ratings_after_review AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_daycare_ratings();

-- Function to update neighborhood daycare counts
CREATE OR REPLACE FUNCTION update_neighborhood_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE neighborhoods SET daycare_count = daycare_count + 1 WHERE slug = NEW.location_neighborhood;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE neighborhoods SET daycare_count = daycare_count - 1 WHERE slug = OLD.location_neighborhood;
  ELSIF TG_OP = 'UPDATE' AND NEW.location_neighborhood != OLD.location_neighborhood THEN
    UPDATE neighborhoods SET daycare_count = daycare_count - 1 WHERE slug = OLD.location_neighborhood;
    UPDATE neighborhoods SET daycare_count = daycare_count + 1 WHERE slug = NEW.location_neighborhood;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update counts
CREATE TRIGGER update_neighborhood_daycare_count AFTER INSERT OR UPDATE OR DELETE ON daycares
  FOR EACH ROW EXECUTE FUNCTION update_neighborhood_count();
