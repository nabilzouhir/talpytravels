-- TalpyTravels Database Schema
-- Run this in the Supabase SQL Editor

-- Create custom enum types
CREATE TYPE destination_status AS ENUM ('wishlist', 'planned', 'visited');
CREATE TYPE activity_category AS ENUM ('food', 'sightseeing', 'adventure', 'accommodation', 'transport', 'other');

-- Destinations table
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status destination_status NOT NULL DEFAULT 'wishlist',
  start_date DATE,
  end_date DATE,
  budget DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category activity_category NOT NULL DEFAULT 'other',
  notes TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  day_number INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price DOUBLE PRECISION,
  place_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Diary entries table
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  diary_entry_id UUID REFERENCES diary_entries(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  taken_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_activities_destination ON activities(destination_id);
CREATE INDEX idx_diary_entries_destination ON diary_entries(destination_id);
CREATE INDEX idx_photos_destination ON photos(destination_id);
CREATE INDEX idx_photos_diary_entry ON photos(diary_entry_id);

-- Disable RLS (private app)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no multi-user concerns)
CREATE POLICY "Allow all on destinations" ON destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on diary_entries" ON diary_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on photos" ON photos FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('travel-photos', 'travel-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the bucket
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'travel-photos');

CREATE POLICY "Allow uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'travel-photos');

CREATE POLICY "Allow updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'travel-photos');

CREATE POLICY "Allow deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'travel-photos');
