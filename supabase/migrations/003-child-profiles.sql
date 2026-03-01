-- Child profiles table
CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 12),
  avatar_id TEXT DEFAULT 'child',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own children" ON child_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add child_profile_id to stories (optional link)
ALTER TABLE stories ADD COLUMN IF NOT EXISTS child_profile_id UUID REFERENCES child_profiles(id);
