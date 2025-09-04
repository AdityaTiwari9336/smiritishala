import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { EnhancedAudioPlayer } from "@/components/audio/EnhancedAudioPlayer";
import { useAudio } from "@/contexts/AudioContext";

const Index = () => {
  const { currentAudio } = useAudio();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection />
      </main>

      {/* Fixed Audio Player - Only show when audio is playing */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <EnhancedAudioPlayer />
        </div>
      )}
      
      {/* Bottom padding to account for fixed player when visible */}
      {currentAudio && <div className="h-24"></div>}
    </div>
  );
};

export default Index;