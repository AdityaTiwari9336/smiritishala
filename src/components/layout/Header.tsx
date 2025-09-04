import { Button } from "@/components/ui/button";
import { Search, Bell, User, Menu, LogOut, Shield, Download, Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = user?.email === "at9997152@gmail.com";

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="glass-card border-b border-glass-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Greeting */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-foreground/20 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smiritishala
            </span>
            {user && (
              <span className="text-xs text-muted-foreground">
                Hi {user.email?.split('@')[0]}! Ready to continue learning?
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects, chapters, topics..."
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/downloads')}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Downloads</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/bookmarks')}>
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bookmarks</span>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="w-4 h-4" />
          </Button>

          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="glass" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="glass" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button variant="hero" size="sm">
                Get Premium
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};