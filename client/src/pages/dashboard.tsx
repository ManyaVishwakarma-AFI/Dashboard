// dashboard.tsx - Complete Integration
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ChartsGrid from "@/components/dashboard/charts-grid";
import ProductRankings from "@/components/dashboard/product-rankings";
import FiltersPanel from "@/components/dashboard/filters-panel";
import { Button } from "@/components/ui/button";
import { Bell, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  dateRange: string;
  showTrendingOnly: boolean;
  sortBy: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
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

  const handleFiltersApply = (filters: FilterState) => {
    console.log("Dashboard received filters:", filters);
    setAppliedFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">
                Amazon Reviews Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time analytics from your review database
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

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

          {/* Filter Panel */}
          {showFilters && <FiltersPanel onFiltersApply={handleFiltersApply} />}

          {/* Dashboard Components - Pass filters to them */}
          <MetricsCards filters={appliedFilters} />
          <ChartsGrid filters={appliedFilters} />
          <ProductRankings filters={appliedFilters} />
        </div>
      </div>
    </div>
  );
}

// // ============================================
// // FILE 2: src/pages/dashboard.tsx (ADD FILTER PANEL)
// // ============================================
// import { useEffect, useState } from "react";
// import Sidebar from "@/components/layout/sidebar";
// import MetricsCards from "@/components/dashboard/metrics-cards";
// import ChartsGrid from "@/components/dashboard/charts-grid";
// import ProductRankings from "@/components/dashboard/product-rankings";
// import FiltersPanel from "@/components/dashboard/filters-panel";
// import { Button } from "@/components/ui/button";
// import { Bell, X, Filter } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [showWelcome, setShowWelcome] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       setUser(userData);
      
//       const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
//       if (!hasSeenWelcome && userData.businessInterests?.length > 0) {
//         setShowWelcome(true);
//       }
//     }
//   }, []);

//   const handleDismissWelcome = () => {
//     setShowWelcome(false);
//     localStorage.setItem('hasSeenWelcome', 'true');
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
      
//       <div className="ml-64 min-h-screen">
//         <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center space-x-4">
//             <div>
//               <h2 className="text-xl font-semibold">
//                 Amazon Reviews Dashboard
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Real-time analytics from your review database
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button 
//               variant="ghost" 
//               size="sm"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="h-4 w-4 mr-1" />
//               Filters
//             </Button>

//             <Button variant="ghost" size="sm">
//               <Bell className="h-4 w-4" />
//             </Button>
//           </div>
//         </header>

//         <div className="p-6 space-y-6">
//           {/* Welcome Message */}
//           {showWelcome && user?.businessInterests && (
//             <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200">
//               <CardContent className="pt-6 relative">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="absolute top-2 right-2"
//                   onClick={handleDismissWelcome}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//                 <h3 className="font-semibold text-lg mb-2">
//                   Welcome, {user.name}! 👋
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-3">
//                   Your dashboard is customized for: {' '}
//                   <span className="font-medium text-foreground">
//                     {user.businessInterests.map((interest: string) => 
//                       interest.charAt(0).toUpperCase() + interest.slice(1)
//                     ).join(', ')}
//                   </span>
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Start exploring insights from Amazon reviews to make data-driven decisions.
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           {/* Filter Panel */}
//           {showFilters && <FiltersPanel />}

//           {/* Dashboard Components */}
//           <MetricsCards />
//           <ChartsGrid />
//           <ProductRankings />
//         </div>
//       </div>
//     </div>
//   );
// }

// ============================================
// FILE 2: src/pages/dashboard.tsx (ADD FILTER PANEL)
// ============================================
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import FiltersPanel from "@/components/dashboard/filters-panel";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ChartsGrid from "@/components/dashboard/charts-grid";
import ProductRankings from "@/components/dashboard/product-rankings";
import FiltersPanel from "@/components/dashboard/filters-panel"; // ADD THIS
import { Button } from "@/components/ui/button";
import { Bell, Filter } from "lucide-react";
import AIRecommendations from "@/components/dashboard/ai-recommendations";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
import { Bell, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // ADD THIS

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
              <h2 className="text-xl font-semibold">
                Amazon Reviews Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time analytics from your review database
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>

            {/* Select Table for Notifications */}
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-transparent"
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                fetchNotifications(e.target.value);
              }}
            >
              <option value="products">Products</option>
              <option value="amazon_reviews">Amazon Reviews</option>
            </select>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 rounded-lg shadow-lg">
                <DropdownMenuLabel className="font-semibold">
                  Notifications ({selectedSource})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-sm text-muted-foreground">
                    No new notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex flex-col items-start py-2 border-b last:border-none border-border"
                    >
                      <p className="text-sm truncate w-full">{n.message}</p>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                    </DropdownMenuItem>
                  ))
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setNotifications([])}
                  className="text-sm text-blue-600 cursor-pointer"
                >
                  Clear all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-6 space-y-6">
            <Button variant="ghost" size="sm"
              onClick={() => setShowFilters(prev => !prev)}
          >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </header>

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

          {/* Filter Panel - ADD THIS */}
          {showFilters && <FiltersPanel />}

          {/* Dashboard Components */}
          <MetricsCards />
          <ChartsGrid />
          <AIRecommendations />
          <ProductRankings />
        </main>
      </div>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}
