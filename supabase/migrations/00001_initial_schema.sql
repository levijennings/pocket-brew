-- Pocket Brew - Initial Schema Migration
-- Created: 2026-04-03
-- Description: Complete database schema for Pocket Brew craft beer journal app

-- =============================================================================
-- 1. TABLES
-- =============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  favorite_styles TEXT[] DEFAULT '{}',
  beers_logged INTEGER DEFAULT 0,
  unique_breweries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beer styles lookup table
CREATE TABLE beer_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  typical_abv_min NUMERIC(4,2),
  typical_abv_max NUMERIC(4,2),
  typical_ibu_min INTEGER,
  typical_ibu_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breweries table
CREATE TABLE breweries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  website_url TEXT,
  logo_url TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  beer_count INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beers table
CREATE TABLE beers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brewery_id UUID NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  style_id UUID REFERENCES beer_styles(id),
  abv NUMERIC(4,2),
  ibu INTEGER,
  description TEXT,
  image_url TEXT,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasting notes table (user reviews/ratings of beers)
CREATE TABLE tasting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  beer_id UUID NOT NULL REFERENCES beers(id) ON DELETE CASCADE,
  rating NUMERIC(3,2) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  aroma NUMERIC(3,2) CHECK (aroma >= 0.5 AND aroma <= 5.0),
  appearance NUMERIC(3,2) CHECK (appearance >= 0.5 AND appearance <= 5.0),
  taste NUMERIC(3,2) CHECK (taste >= 0.5 AND taste <= 5.0),
  mouthfeel NUMERIC(3,2) CHECK (mouthfeel >= 0.5 AND mouthfeel <= 5.0),
  overall_impression TEXT,
  flavor_notes TEXT[] DEFAULT '{}',
  serving_type TEXT CHECK (serving_type IN ('draft', 'bottle', 'can', 'cask', 'crowler', 'growler')),
  location TEXT,
  photo_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections table (custom user beer lists)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  beer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection beers junction table
CREATE TABLE collection_beers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  beer_id UUID NOT NULL REFERENCES beers(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(collection_id, beer_id)
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  beer_id UUID NOT NULL REFERENCES beers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, beer_id)
);

-- =============================================================================
-- 2. INDEXES
-- =============================================================================

-- Beers indexes
CREATE INDEX idx_beers_brewery_id ON beers(brewery_id);
CREATE INDEX idx_beers_style_id ON beers(style_id);
CREATE INDEX idx_beers_slug ON beers(slug);
CREATE INDEX idx_beers_avg_rating DESC ON beers(avg_rating DESC);

-- Tasting notes indexes
CREATE INDEX idx_tasting_notes_user_id ON tasting_notes(user_id);
CREATE INDEX idx_tasting_notes_beer_id ON tasting_notes(beer_id);
CREATE INDEX idx_tasting_notes_created_at DESC ON tasting_notes(created_at DESC);

-- Breweries indexes
CREATE INDEX idx_breweries_slug ON breweries(slug);
CREATE INDEX idx_breweries_geo ON breweries(latitude, longitude);

-- Collections indexes
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- Wishlist indexes
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- =============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update beer ratings and count
CREATE OR REPLACE FUNCTION update_beer_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the beer's average rating and rating count
  UPDATE beers
  SET
    avg_rating = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM tasting_notes
      WHERE beer_id = COALESCE(NEW.beer_id, OLD.beer_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM tasting_notes
      WHERE beer_id = COALESCE(NEW.beer_id, OLD.beer_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.beer_id, OLD.beer_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for beer rating updates
CREATE TRIGGER trigger_update_beer_rating
AFTER INSERT OR UPDATE OR DELETE ON tasting_notes
FOR EACH ROW
EXECUTE FUNCTION update_beer_rating();

-- Function to update brewery stats
CREATE OR REPLACE FUNCTION update_brewery_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update brewery beer count and average rating
  UPDATE breweries
  SET
    beer_count = (
      SELECT COUNT(*)
      FROM beers
      WHERE brewery_id = COALESCE(NEW.brewery_id, OLD.brewery_id)
    ),
    avg_rating = (
      SELECT AVG(b.avg_rating)::NUMERIC(3,2)
      FROM beers b
      WHERE b.brewery_id = COALESCE(NEW.brewery_id, OLD.brewery_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.brewery_id, OLD.brewery_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for brewery stats updates
CREATE TRIGGER trigger_update_brewery_stats
AFTER INSERT OR UPDATE OR DELETE ON beers
FOR EACH ROW
EXECUTE FUNCTION update_brewery_stats();

-- Function to update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user profile stats when they log a beer
  UPDATE profiles
  SET
    beers_logged = (
      SELECT COUNT(DISTINCT beer_id)
      FROM tasting_notes
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    unique_breweries = (
      SELECT COUNT(DISTINCT b.brewery_id)
      FROM tasting_notes tn
      JOIN beers b ON tn.beer_id = b.id
      WHERE tn.user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile stats updates
CREATE TRIGGER trigger_update_profile_stats
AFTER INSERT OR DELETE ON tasting_notes
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();

-- Function to update collection beer count
CREATE OR REPLACE FUNCTION update_collection_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update collection beer count
  UPDATE collections
  SET
    beer_count = (
      SELECT COUNT(*)
      FROM collection_beers
      WHERE collection_id = COALESCE(NEW.collection_id, OLD.collection_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.collection_id, OLD.collection_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for collection count updates
CREATE TRIGGER trigger_update_collection_count
AFTER INSERT OR DELETE ON collection_beers
FOR EACH ROW
EXECUTE FUNCTION update_collection_count();

-- Generic function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER trigger_update_profiles_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_breweries_at
BEFORE UPDATE ON breweries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_beers_at
BEFORE UPDATE ON beers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_tasting_notes_at
BEFORE UPDATE ON tasting_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_collections_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Function to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER trigger_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE breweries ENABLE ROW LEVEL SECURITY;
ALTER TABLE beers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_beers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "profiles_read_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Beer styles RLS policies (public read)
CREATE POLICY "beer_styles_read_all" ON beer_styles
  FOR SELECT USING (true);

CREATE POLICY "beer_styles_insert_auth" ON beer_styles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Breweries RLS policies (public read, authenticated can insert)
CREATE POLICY "breweries_read_all" ON breweries
  FOR SELECT USING (true);

CREATE POLICY "breweries_insert_auth" ON breweries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "breweries_update_auth" ON breweries
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Beers RLS policies (public read, authenticated can insert)
CREATE POLICY "beers_read_all" ON beers
  FOR SELECT USING (true);

CREATE POLICY "beers_insert_auth" ON beers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "beers_update_auth" ON beers
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Tasting notes RLS policies (public ones readable, private only by owner)
CREATE POLICY "tasting_notes_read_public" ON tasting_notes
  FOR SELECT USING (is_public = true);

CREATE POLICY "tasting_notes_read_own_private" ON tasting_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasting_notes_insert_own" ON tasting_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasting_notes_update_own" ON tasting_notes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasting_notes_delete_own" ON tasting_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Collections RLS policies (public readable, private only by owner)
CREATE POLICY "collections_read_public" ON collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "collections_read_own_private" ON collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "collections_insert_own" ON collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collections_update_own" ON collections
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collections_delete_own" ON collections
  FOR DELETE USING (auth.uid() = user_id);

-- Collection beers RLS policies (based on collection ownership)
CREATE POLICY "collection_beers_read_public" ON collection_beers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_beers.collection_id AND is_public = true
    )
  );

CREATE POLICY "collection_beers_read_own" ON collection_beers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_beers.collection_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "collection_beers_insert_own" ON collection_beers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "collection_beers_delete_own" ON collection_beers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

-- Wishlist RLS policies (only own)
CREATE POLICY "wishlist_read_own" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wishlist_insert_own" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_delete_own" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);
