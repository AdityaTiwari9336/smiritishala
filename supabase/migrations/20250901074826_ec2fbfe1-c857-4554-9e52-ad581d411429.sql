-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subject_id, name)
);

-- Update audios table structure
ALTER TABLE public.audios 
ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id),
ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES public.topics(id),
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS play_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id);

-- Create listening_history table for tracking user progress
CREATE TABLE IF NOT EXISTS public.listening_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE,
    current_position INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, audio_id)
);

-- Enable RLS on new tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for subjects (readable by everyone)
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage subjects" ON public.subjects
FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'at9997152@gmail.com'::text);

-- RLS policies for topics (readable by everyone)
CREATE POLICY "Topics are viewable by everyone" ON public.topics
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage topics" ON public.topics
FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'at9997152@gmail.com'::text);

-- RLS policies for listening_history
CREATE POLICY "Users can view their own listening history" ON public.listening_history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listening history" ON public.listening_history
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listening history" ON public.listening_history
FOR UPDATE USING (auth.uid() = user_id);

-- Insert subjects
INSERT INTO public.subjects (name) VALUES
('Indian Society'),
('World History'),
('Geography'),
('Indian Culture'),
('Modern History'),
('Post-Independence India'),
('Indian Constitution & Polity'),
('Governance'),
('International Relations'),
('Economy'),
('Agriculture'),
('Science & Technology'),
('Environment'),
('Internal Security'),
('Ethics and Human Interface'),
('Human Values'),
('Attitude'),
('Aptitude and Foundational Values'),
('Emotional Intelligence'),
('Public/Civil Service Values'),
('Probity in Governance'),
('Contributions of Thinkers & Leaders'),
('Applied Ethics')
ON CONFLICT (name) DO NOTHING;

-- Insert topics for each subject
INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Diversity', 'Women Organizations', 'Poverty', 'Development', 'Urbanization', 
    'Globalization', 'Social Empowerment', 'Communalism', 'Regionalism', 'Secularism'
])
FROM public.subjects s WHERE s.name = 'Indian Society'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Industrial Revolution', 'French Revolution', 'Nationalism', 'Colonialism', 
    'Imperialism', 'US Emergence', 'World Wars', 'Russian Revolution', 'Cold War', 'Middle East'
])
FROM public.subjects s WHERE s.name = 'World History'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Physical Geography', 'Natural Resources', 'Industry Location', 
    'Geophysical Phenomena', 'Environmental Changes'
])
FROM public.subjects s WHERE s.name = 'Geography'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Art Forms', 'Literature', 'Architecture', 'Classical Dances', 
    'Music', 'Folk Art', 'Religion', 'Drama', 'Paintings'
])
FROM public.subjects s WHERE s.name = 'Indian Culture'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'British Conquest', 'Administration', 'Revolts', 'Nationalism', 
    'Freedom Struggle', 'Gandhi', 'Social Reforms', 'Partition'
])
FROM public.subjects s WHERE s.name = 'Modern History'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'State Reorganization', 'Vulnerable Sections', 'Economic Development'
])
FROM public.subjects s WHERE s.name = 'Post-Independence India'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Constitution', 'Federal Structure', 'Separation of Powers', 'Parliament', 
    'Executive', 'Judiciary', 'Pressure Groups', 'Representation of People''s Act'
])
FROM public.subjects s WHERE s.name = 'Indian Constitution & Polity'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Government Policies', 'NGOs', 'SHGs', 'Development Industry', 'Welfare Schemes', 
    'Education', 'Health', 'Hunger', 'E-Governance', 'Civil Services'
])
FROM public.subjects s WHERE s.name = 'Governance'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'India''s Foreign Policy', 'Neighbourhood Relations', 'Global Groupings', 'Diaspora', 
    'Bilateral Relations', 'SAARC', 'ASEAN', 'SCO', 'Indo-Pacific', 'Indian Ocean'
])
FROM public.subjects s WHERE s.name = 'International Relations'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Planning', 'Resource Mobilization', 'Inclusive Growth', 'Budgeting', 
    'Industrial Policy', 'Infrastructure', 'Investment Models'
])
FROM public.subjects s WHERE s.name = 'Economy'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Cropping Patterns', 'Irrigation', 'Agricultural Finance', 'Subsidies', 
    'MSP', 'PDS', 'Food Security', 'Food Processing'
])
FROM public.subjects s WHERE s.name = 'Agriculture'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'IT', 'Space', 'Biotechnology', 'Nanotech', 'Robotics', 
    'Nuclear', 'Energy', 'Defence', 'Innovations'
])
FROM public.subjects s WHERE s.name = 'Science & Technology'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Biodiversity', 'Pollution', 'Climate Change', 'EIA', 'Sustainable Development', 
    'Renewable Energy', 'Urbanization', 'Water Resources'
])
FROM public.subjects s WHERE s.name = 'Environment'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Extremism', 'Non-state Actors', 'Cyber Security', 'Social Media', 
    'Border Security', 'Organized Crime', 'Security Agencies'
])
FROM public.subjects s WHERE s.name = 'Internal Security'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Essence of ethics', 'Determinants', 'Consequences', 'Dimensions of ethics', 
    'Ethics in relationships', 'Indian perspectives', 'Western perspectives', 
    'Morality', 'Ethical dilemmas'
])
FROM public.subjects s WHERE s.name = 'Ethics and Human Interface'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Role of family', 'Role of society', 'Educational institutions', 'Fundamental values', 
    'Instrumental values', 'Democratic ethics', 'Aesthetic ethics', 'Work-life ethics'
])
FROM public.subjects s WHERE s.name = 'Human Values'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Components', 'Functions', 'Moral attitude', 'Political attitude', 
    'Influence of beliefs', 'Social influence', 'Persuasion'
])
FROM public.subjects s WHERE s.name = 'Attitude'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Integrity', 'Impartiality', 'Objectivity', 'Public service dedication', 
    'Empathy', 'Tolerance', 'Compassion', 'Accountability', 'Humility', 'Adaptability'
])
FROM public.subjects s WHERE s.name = 'Aptitude and Foundational Values'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Concepts', 'Components', 'Theories', 'Self-awareness', 'Self-management', 
    'Social awareness', 'Relationship management', 'Workplace relevance'
])
FROM public.subjects s WHERE s.name = 'Emotional Intelligence'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Ethical governance', 'Laws & rules', 'Corporate governance', 
    'Status & dilemmas', 'Sources of guidance'
])
FROM public.subjects s WHERE s.name = 'Public/Civil Service Values'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Public service', 'Work culture', 'Citizen charters', 'RTI', 'Transparency', 
    'Ethics code', 'Public fund utilization', 'Corruption challenges'
])
FROM public.subjects s WHERE s.name = 'Probity in Governance'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Gandhi', 'Vivekananda', 'Kant', 'Rawls', 'T.N. Seshan', 
    'E. Sreedharan', 'Max Weber', 'Reformers', 'Philosophers'
])
FROM public.subjects s WHERE s.name = 'Contributions of Thinkers & Leaders'
ON CONFLICT (subject_id, name) DO NOTHING;

INSERT INTO public.topics (subject_id, name)
SELECT s.id, unnest(ARRAY[
    'Abortion ethics', 'Euthanasia', 'Business ethics', 'Biotechnology ethics', 
    'Surrogacy', 'Child labour', 'LGBTQ+ rights', 'Environmental ethics'
])
FROM public.subjects s WHERE s.name = 'Applied Ethics'
ON CONFLICT (subject_id, name) DO NOTHING;