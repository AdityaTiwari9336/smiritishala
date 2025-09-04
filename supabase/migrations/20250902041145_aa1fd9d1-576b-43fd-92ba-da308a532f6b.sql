-- Create function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(audio_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE audios 
  SET play_count = play_count + 1 
  WHERE id = audio_id;
END;
$$ LANGUAGE plpgsql;