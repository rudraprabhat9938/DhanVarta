import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Globe,
  BarChart3,
  Bell,
  Users,
  Flame,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Trending", id: "trending-section", icon: Flame },
    { label: "Converter", id: "converter-section", icon: Globe },
    { label: "Portfolio", id: "portfolio-section", icon: BarChart3 },
    { label: "Community", id: "community-section", icon: Users },
    { label: "Insights", id: "insights-section", icon: Bell },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b border-card-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DhanVarta</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => scrollToSection(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                  onClick={() => scrollToSection("alerts-section")}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                          {user.email?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline max-w-[120px] truncate">
                        {user.email?.split("@")[0] || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background border-card-border z-[100]"
                  >
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[350px] bg-background border-card-border"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-card-border">
                    <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      DhanVarta
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="justify-start gap-3 py-3 h-auto text-left"
                        onClick={() => scrollToSection(item.id)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.label}</span>
                      </Button>
                    ))}
                  </nav>

                  {!user && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-card-border">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/auth");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="bg-gradient-primary hover:opacity-90"
                        onClick={() => {
                          navigate("/auth");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
