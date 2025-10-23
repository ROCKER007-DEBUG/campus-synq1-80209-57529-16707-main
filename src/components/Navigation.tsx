import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, LogOut } from "lucide-react";
import { supabase, signOut, onAuthStateChange } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";
import { ThemeToggle } from "@/components/ThemeToggle";
import synqedLogo from "@/assets/synqed-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userXP, userLevel } = useXP();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    const unsubscribe = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      try {
        unsubscribe();
      } catch {}
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  const navItems = [
    { label: "Home", to: "/home" },
    { label: "Features", to: "/features" },
    { label: "Wellness", to: "/wellness" },
    { label: "Forum", to: "/forum" },
  ];

  const isActiveRoute = (path: string) => {
    if (path.includes('#')) return false; // Handle anchor links differently
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <img src={synqedLogo} alt="SYNQED Logo" className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-xl text-foreground">SYNQED</h1>
              <p className="text-xs text-muted-foreground">Synchronize Your Academic Journey</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(item.to) 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gradient-primary text-white">
                Level {userLevel}
              </Badge>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="text-sm font-semibold text-gamification-xp">{userXP.toLocaleString()}</p>
              </div>
            </div>
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-primary hover:opacity-90" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`block px-2 py-2 rounded-lg transition-colors ${
                    isActiveRoute(item.to) 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-3 border-t border-glass-border">
                <div className="flex items-center justify-between mb-3">
                  <ThemeToggle />
                  <Badge variant="secondary" className="bg-gradient-primary text-white">
                    Level {userLevel}
                  </Badge>
                  <span className="text-sm font-semibold text-gamification-xp">{userXP.toLocaleString()} XP</span>
                </div>
                <div className="space-y-2">
                  {user ? (
                    <>
                      <Link to="/profile">
                        <Button variant="outline" className="w-full" size="sm">
                          Profile
                        </Button>
                      </Link>
                      <Button onClick={handleSignOut} className="w-full" size="sm">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth">
                        <Button variant="outline" className="w-full" size="sm">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth">
                        <Button className="w-full bg-gradient-primary hover:opacity-90" size="sm">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;