// ============================================
// FILE 1: src/pages/dashboard.tsx (COMPLETE REPLACEMENT)
// ============================================
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MetricsCards from "@/components/dashboard/metrics-cards";
import FiltersPanel from "@/components/dashboard/filters-panel";
import ChartsGrid from "@/components/dashboard/charts-grid";
import ProductRankings from "@/components/dashboard/product-rankings";
import { Button } from "@/components/ui/button";
import { Bell, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Show welcome message for new users
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome && userData.businessInterests?.length > 0) {
        setShowWelcome(true);
      }
    }
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">
               Sellers Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time analytics from your review database
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm"
              onClick={() => setShowFilters(prev => !prev)}
          >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>

            <Button variant="ghost" size="sm">
               <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Filters panel - collapsible */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-border bg-card transition-all duration-300">
            <FiltersPanel />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Welcome Message */}
          {showWelcome && user?.businessInterests && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200">
              <CardContent className="pt-6 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleDismissWelcome}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-lg mb-2">
                  Welcome, {user.name}! 👋
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your dashboard is customized for: {' '}
                  <span className="font-medium text-foreground">
                    {user.businessInterests.map((interest: string) => 
                      interest.charAt(0).toUpperCase() + interest.slice(1)
                    ).join(', ')}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Start exploring insights from Amazon reviews to make data-driven decisions.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Dashboard Components */}
          <MetricsCards />
          <ChartsGrid />
          <ProductRankings />
        </div>
      </div>
    </div>
  );
}

