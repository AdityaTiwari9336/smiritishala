import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Heart, Download, Share, Bookmark, Clock, Users, X } from "lucide-react";
import { useState } from "react";

interface AudioCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  audio: {
    id: string;
    title: string;
    author: string;
    duration: string;
    category: string;
    url: string;
    coverUrl?: string;
    isPremium?: boolean;
    plays?: number;
    audioDuration?: number;
    description?: string;
  } | null;
  onPlay: () => void;
}

export const AudioCardModal = ({ isOpen, onClose, audio, onPlay }: AudioCardModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!audio) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloaded(!isDownloaded);
    // TODO: Implement download functionality
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.share?.({
      title: audio.title,
      text: `Listen to ${audio.title} - ${audio.author}`,
      url: window.location.href
    });
  };

  const handlePlay = () => {
    onPlay();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Audio Details</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-secondary">
            {audio.coverUrl ? (
              <img src={audio.coverUrl} alt={audio.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-card">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}

            {/* Premium Badge */}
            {audio.isPremium && (
              <div className="absolute top-3 right-3">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs px-3 py-1 rounded-full text-white font-medium">
                  Premium
                </span>
              </div>
            )}
          </div>

          {/* Audio Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold leading-tight">{audio.title}</h2>
              <p className="text-sm text-muted-foreground">{audio.author}</p>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{audio.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{audio.plays?.toLocaleString()} plays</span>
              </div>
              <span className="bg-secondary px-2 py-1 rounded-full text-xs">{audio.category}</span>
            </div>

            {/* Description */}
            {audio.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {audio.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Primary Play Button */}
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handlePlay}
            >
              <Play className="w-5 h-5 mr-2" />
              Play Audio
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLike}
                className={`flex flex-col gap-1 h-auto py-3 ${isLiked ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs">Like</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBookmark}
                className={`flex flex-col gap-1 h-auto py-3 ${isBookmarked ? "text-primary border-primary" : ""}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                <span className="text-xs">Save</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className={`flex flex-col gap-1 h-auto py-3 ${isDownloaded ? "text-success border-success" : ""}`}
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">{isDownloaded ? "Downloaded" : "Download"}</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Share className="w-4 h-4" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};