-- Create chapters table for Subject → Chapter → Topic → Audio hierarchy
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for chapters
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Create policies for chapters
CREATE POLICY "Chapters are viewable by everyone" 
ON public.chapters 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage chapters" 
ON public.chapters 
FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'at9997152@gmail.com'::text);

-- Update topics table to reference chapters
ALTER TABLE public.topics ADD COLUMN chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE;
ALTER TABLE public.topics ADD COLUMN order_index INTEGER DEFAULT 0;

-- Update audios table to add chapter_id and improve structure
ALTER TABLE public.audios ADD COLUMN chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL;
ALTER TABLE public.audios ADD COLUMN cover_image_url TEXT;

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'English',
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  total_audios_completed INTEGER DEFAULT 0,
  listening_streak INTEGER DEFAULT 0,
  last_listening_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, audio_id)
);

-- Enable RLS for bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" 
ON public.bookmarks 
FOR ALL 
USING (auth.uid() = user_id);

-- Create listening_history table for progress tracking
CREATE TABLE public.listening_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE,
  current_position INTEGER DEFAULT 0, -- in seconds
  completed BOOLEAN DEFAULT false,
  last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_listening_time INTEGER DEFAULT 0, -- total time spent on this audio
  UNIQUE(user_id, audio_id)
);

-- Enable RLS for listening_history
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;

-- Create policies for listening_history
CREATE POLICY "Users can manage their own listening history" 
ON public.listening_history 
FOR ALL 
USING (auth.uid() = user_id);

-- Create downloads table for offline audio tracking
CREATE TABLE public.downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
  UNIQUE(user_id, audio_id)
);

-- Enable RLS for downloads
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for downloads
CREATE POLICY "Users can manage their own downloads" 
ON public.downloads 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updating profiles.updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();