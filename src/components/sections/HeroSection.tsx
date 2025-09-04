import { Button } from "@/components/ui/button";
import { Play, Headphones, Users, Star } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      
      {/* Floating audio waves animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex items-end gap-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="audio-wave bg-primary w-1 rounded-full"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Master UPSC with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Audio Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Access comprehensive UPSC preparation materials, current affairs, and expert lectures. 
            Learn on-the-go with offline downloads and personalized study plans.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Learning Today
            </Button>
            <Button variant="glass" size="xl">
              <Headphones className="w-5 h-5" />
              Browse Current Affairs
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">UPSC Lectures</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-muted-foreground">UPSC Aspirants</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-muted-foreground">Success Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};