import { Button } from "@/components/ui/button";
import { Play, Heart, Download, Clock, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AudioCardProps {
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
  onPlay: () => void;
  onOpenAudioCard: () => void;
}

export const AudioCard = ({ 
  id,
  title, 
  author, 
  duration, 
  category, 
  url,
  coverUrl, 
  isPremium = false,
  plays = 0,
  audioDuration = 0,
  description,
  onPlay,
  onOpenAudioCard
}: AudioCardProps) => {
  return (
    <div 
      className="glass-card shadow-card hover:shadow-player transition-smooth hover:scale-[1.02] group cursor-pointer"
      onClick={onOpenAudioCard}
    >
      <div className="p-4">
        {/* Cover Image */}
        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-secondary">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-card">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}

          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-2 right-2">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs px-2 py-1 rounded-full text-white font-medium">
                Premium
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-smooth">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{author}</p>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="bg-secondary px-2 py-1 rounded-full">{category}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">{plays.toLocaleString()} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
};