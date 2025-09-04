import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [volume, setVolumeState] = useState(70);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Update listening history
      if (user && currentAudio) {
        updateListeningHistory(currentAudio.id, audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [user, currentAudio]);

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
    if (!audioRef.current) return;

    try {
      if (currentAudio?.id !== audio.id) {
        setCurrentAudio(audio);
        audioRef.current.src = audio.url;
        audioRef.current.load();
        
        // Update play count
        await updatePlayCount(audio.id);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentAudio && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      seekTo(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      seekTo(newTime);
    }
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