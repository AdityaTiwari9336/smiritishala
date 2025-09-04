import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Share, Bookmark, Download, MoreHorizontal } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const EnhancedAudioPlayer = () => {
  const { 
    currentAudio, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    playbackSpeed,
    togglePlayPause, 
    seekTo, 
    setVolume, 
    setPlaybackSpeed,
    skipForward, 
    skipBackward 
  } = useAudio();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * duration;
    seekTo(clickTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = (clickX / width) * 100;
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleShare = () => {
    if (currentAudio) {
      navigator.share?.({
        title: currentAudio.title,
        text: `Listen to ${currentAudio.title} - ${currentAudio.subject}`,
        url: window.location.href
      });
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const toggleDownload = () => {
    setIsDownloaded(!isDownloaded);
    // TODO: Implement download functionality
  };

  if (!currentAudio) {
    return null; // Don't show player when no audio is selected
  }

  return (
    <div className="glass-card border-t border-glass-border shadow-player">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-secondary flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-gradient-card">
                <Play className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium truncate">{currentAudio.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentAudio.subject} → {currentAudio.topic}</p>
              {(isBookmarked || isDownloaded) && (
                <div className="flex items-center gap-1 mt-1">
                  {isBookmarked && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  {isDownloaded && <div className="w-2 h-2 bg-success rounded-full"></div>}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm">
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={skipBackward}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button variant="player" size="icon-lg" className="rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:flex items-center gap-2 w-96">
              <span className="text-xs text-player-time">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-1 bg-secondary rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-player-progress rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-player-time">{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Actions & Volume */}
          <div className="hidden lg:flex items-center gap-2 min-w-0 flex-1 justify-end">
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              
              <Button variant="ghost" size="icon-sm" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleBookmark}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>

              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleDownload}
                className={isDownloaded ? "text-success" : ""}
              >
                <Download className="w-4 h-4" />
              </Button>

              {/* Speed Control */}
              <Button variant="ghost" size="sm" onClick={toggleSpeed}>
                {playbackSpeed}x
              </Button>

              {/* Volume */}
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div 
                className="w-20 h-1 bg-secondary rounded-full overflow-hidden cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div 
                  className="h-full bg-player-progress rounded-full"
                  style={{ width: `${volume}%` }}
                />
              </div>

              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                  <DropdownMenuItem>Sleep Timer</DropdownMenuItem>
                  <DropdownMenuItem>Equalizer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-2">
          <div className="flex items-center gap-2 text-xs text-player-time mb-1">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-auto"></span>
            <span>{formatTime(duration || 0)}</span>
          </div>
          <div 
            className="h-1 bg-secondary rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-player-progress rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Mobile Action Bar */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={toggleSpeed}>
                <span className="text-xs">{playbackSpeed}x</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleBookmark}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={toggleDownload}
                className={isDownloaded ? "text-success" : ""}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};