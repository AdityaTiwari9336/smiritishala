import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface AudioData {
  id: string;
  title: string;
  url: string;
  subject: string;
  topic: string;
  duration: number;
  is_premium: boolean;
}

interface AudioContextType {
  currentAudio: AudioData | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  playAudio: (audio: AudioData) => void;
  pauseAudio: () => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentAudio, setCurrentAudio] = useState<AudioData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio session for playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      // Cleanup sound when component unmounts
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const updateListeningHistory = async (audioId: string, currentPosition: number) => {
    // For now, just log the listening progress
    console.log('Listening progress:', { audioId, currentPosition });
  };

  const updatePlayCount = async (audioId: string) => {
    try {
      const { data: currentAudio } = await supabase
        .from('audios')
        .select('play_count')
        .eq('id', audioId)
        .single();

      if (currentAudio) {
        await supabase
          .from('audios')
          .update({ play_count: currentAudio.play_count + 1 })
          .eq('id', audioId);
      }
    } catch (error) {
      console.error('Error updating play count:', error);
    }
  };

  const playAudio = async (audio: AudioData) => {
    try {
      // If there's a different audio playing, unload it first
      if (soundRef.current && currentAudio?.id !== audio.id) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // If it's a new audio or no sound loaded
      if (!soundRef.current || currentAudio?.id !== audio.id) {
        setCurrentAudio(audio);
        
        // Create new sound
        const { sound } = await Audio.Sound.createAsync(
          { uri: audio.url },
          {
            shouldPlay: true,
            volume: volume,
            rate: playbackSpeed,
            shouldCorrectPitch: true,
          },
          (status) => {
            if (status.isLoaded) {
              setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
              setCurrentTime(status.positionMillis ? status.positionMillis / 1000 : 0);
              setIsPlaying(status.isPlaying || false);

              // Update listening history
              if (user && audio) {
                updateListeningHistory(audio.id, status.positionMillis ? status.positionMillis / 1000 : 0);
              }

              // Handle playback completion
              if (status.didJustFinish) {
                setIsPlaying(false);
                setCurrentTime(0);
              }
            }
          }
        );

        soundRef.current = sound;
        
        // Update play count
        await updatePlayCount(audio.id);
      } else {
        // Resume existing audio
        await soundRef.current.playAsync();
      }

      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseAudio();
    } else if (currentAudio && soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const seekTo = async (time: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(time * 1000);
        setCurrentTime(time);
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const setVolume = async (newVolume: number) => {
    try {
      setVolumeState(newVolume);
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(newVolume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const setPlaybackSpeed = async (speed: number) => {
    try {
      setPlaybackSpeedState(speed);
      if (soundRef.current) {
        await soundRef.current.setRateAsync(speed, true);
      }
    } catch (error) {
      console.error('Error setting playback speed:', error);
    }
  };

  const skipForward = async () => {
    const newTime = Math.min(currentTime + 10, duration);
    await seekTo(newTime);
  };

  const skipBackward = async () => {
    const newTime = Math.max(currentTime - 10, 0);
    await seekTo(newTime);
  };

  const value: AudioContextType = {
    currentAudio,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    playAudio,
    pauseAudio,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackSpeed,
    skipForward,
    skipBackward,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};