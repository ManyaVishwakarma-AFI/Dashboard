// ============================================
// FILE: src/components/layout/sidebar.tsx (UPDATED)
// ============================================
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ChartLine, 
  Crown,
  Home, 
  Info, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/App";


const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/subscription", label: "Subscription", icon: Crown },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Reload on location change

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('rememberMe');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    setLocation('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

    // ✅ Dynamic color for subscription tier
  const getSubscriptionColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "premium":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "basic":
        return "bg-primary text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transform transition-transform duration-300",
          isCollapsed ? "w-16" : "w-64",
          "lg:translate-x-0",
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ChartLine className="text-primary-foreground h-5 w-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">Reviews</h1>
                  <p className="text-xs text-muted-foreground">Analytics</p>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href === "/dashboard" && location === "/");
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={cn(
            "flex items-center p-3 bg-muted rounded-lg",
            isCollapsed && "justify-center"
          )}>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
             {!isCollapsed && (
              <div className="flex-1 ml-3 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      user.name ||
                      "User"
                    : "User"}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs mt-1",
                    getSubscriptionColor(user?.subscriptionTier || "Free")
                  )}
                >
                  {user?.subscriptionTier
                    ? `${user.subscriptionTier} Plan`
                    : "Free Plan"}
                </Badge>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isCollapsed && "p-2"
              )}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}


