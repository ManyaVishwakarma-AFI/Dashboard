// // ============================================
// // FILE: src/pages/dashboard.tsx (CORRECTED)
// // ============================================

// import Sidebar from "@/components/layout/sidebar";
// import MetricsCards from "@/components/dashboard/metrics-cards";
// import ChartsGrid from "@/components/dashboard/charts-grid";
// import ProductRankings from "@/components/dashboard/product-rankings";
// import { Button } from "@/components/ui/button";
// import { Bell } from "lucide-react";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
      
//       <div className="ml-64 min-h-screen">
//         <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center space-x-4">
//             <div>
//               <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
//               <p className="text-sm text-muted-foreground">
//                 Real-time analytics from your review database
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" size="sm">
//               <Bell className="h-4 w-4" />
//             </Button>
//           </div>
//         </header>

//         <div className="p-6 space-y-6">
//           <MetricsCards />
//           <ChartsGrid />
//           <ProductRankings />
//         </div>
//       </div>
//     </div>
//   );
// }

// ============================================
// FILE: src/pages/dashboard.tsx (FIXED)
// ============================================

// ============================================
// FILE: src/pages/dashboard.tsx (FILTER TOGGLE)
// ============================================

// import { useState } from "react";
// import Sidebar from "@/components/layout/sidebar";
// import FiltersPanel from "@/components/dashboard/filters-panel";
// import MetricsCards from "@/components/dashboard/metrics-cards";
// import ChartsGrid from "@/components/dashboard/charts-grid";
// import ProductRankings from "@/components/dashboard/product-rankings";
// import { Button } from "@/components/ui/button";
// import { Bell, Filter } from "lucide-react";

// export default function Dashboard() {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content */}
//       <div className="flex-1 ml-64 min-h-screen flex flex-col">
//         {/* Header */}
//         <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center space-x-4">
//             <div>
//               <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
//               <p className="text-sm text-muted-foreground">
//                 Real-time analytics from your review database
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             {/* Filter toggle button */}
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={() => setShowFilters(prev => !prev)}
//             >
//               <Filter className="h-4 w-4 mr-1" />
//               Filters
//             </Button>

//             {/* Notifications */}
//             <Button variant="ghost" size="sm">
//               <Bell className="h-4 w-4" />
//             </Button>
//           </div>
//         </header>

//         {/* Filters panel - collapsible */}
//         {showFilters && (
//           <div className="px-6 py-4 border-b border-border bg-card transition-all duration-300">
//             <FiltersPanel />
//           </div>
//         )}

//         {/* Main content */}
//         <main className="p-6 space-y-6 flex-1 overflow-y-auto">
//           <MetricsCards />
//           <ChartsGrid />
//           <ProductRankings />
//         </main>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import Sidebar from "@/components/layout/sidebar";
// import FiltersPanel from "@/components/dashboard/filters-panel";
// import MetricsCards from "@/components/dashboard/metrics-cards";
// import ChartsGrid from "@/components/dashboard/charts-grid";
// import ProductRankings from "@/components/dashboard/product-rankings";
// import { Button } from "@/components/ui/button";
// import { Bell, Filter } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function Dashboard() {
//   const [showFilters, setShowFilters] = useState(false);
//   const [notifications, setNotifications] = useState<
//     { id: number; message: string; time: string }[]
//   >([]);

//   // Simulate fetching notifications (replace with FastAPI endpoint later)
//   useEffect(() => {
//     const fakeData = [
//       { id: 1, message: "New review added for iPhone 15", time: "2 mins ago" },
//       { id: 2, message: "Low rating detected on Samsung Galaxy S23", time: "10 mins ago" },
//       { id: 3, message: "Price alert triggered for OnePlus 12", time: "1 hour ago" },
//     ];
//     setNotifications(fakeData);
//   }, []);

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 ml-64 min-h-screen flex flex-col">
//         {/* Header */}
//         <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center space-x-4">
//             <div>
//               <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
//               <p className="text-sm text-muted-foreground">
//                 Real-time analytics from your review database
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             {/* Filter Toggle */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowFilters((prev) => !prev)}
//             >
//               <Filter className="h-4 w-4 mr-1" />
//               Filters
//             </Button>

//             {/* Notifications Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="relative">
//                   <Bell className="h-4 w-4" />
//                   {notifications.length > 0 && (
//                     <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end" className="w-80">
//                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                 <DropdownMenuSeparator />

//                 {notifications.length === 0 ? (
//                   <DropdownMenuItem className="text-sm text-muted-foreground">
//                     No new notifications
//                   </DropdownMenuItem>
//                 ) : (
//                   notifications.map((n) => (
//                     <DropdownMenuItem key={n.id} className="flex flex-col items-start">
//                       <p className="text-sm">{n.message}</p>
//                       <span className="text-xs text-muted-foreground">{n.time}</span>
//                     </DropdownMenuItem>
//                   ))
//                 )}

//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => setNotifications([])}
//                   className="text-sm text-blue-600 cursor-pointer"
//                 >
//                   Clear all
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>

//         {/* Collapsible Filters Panel */}
//         {showFilters && (
//           <div className="px-6 py-4 border-b border-border bg-card transition-all duration-300">
//             <FiltersPanel />
//           </div>
//         )}

//         {/* Dashboard Main Section */}
//         <main className="p-6 space-y-6 flex-1 overflow-y-auto">
//           <MetricsCards />
//           <ChartsGrid />
//           <ProductRankings />
//         </main>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import Sidebar from "@/components/layout/sidebar";
// import FiltersPanel from "@/components/dashboard/filters-panel";
// import MetricsCards from "@/components/dashboard/metrics-cards";
// import ChartsGrid from "@/components/dashboard/charts-grid";
// import ProductRankings from "@/components/dashboard/product-rankings";
// import Chatbot from "@/components/chatbot/chatbot"; // <-- Import Chatbot
// import { Button } from "@/components/ui/button";
// import { Bell, Filter } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function Dashboard() {
//   const [showFilters, setShowFilters] = useState(false);
//   const [notifications, setNotifications] = useState<
//     { id: number; message: string; time: string }[]
//   >([]);

//   useEffect(() => {
//     const fakeData = [
//       { id: 1, message: "New review added for iPhone 15", time: "2 mins ago" },
//       { id: 2, message: "Low rating detected on Samsung Galaxy S23", time: "10 mins ago" },
//       { id: 3, message: "Price alert triggered for OnePlus 12", time: "1 hour ago" },
//     ];
//     setNotifications(fakeData);
//   }, []);

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 ml-64 min-h-screen flex flex-col">
//         {/* Header */}
//         <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//           <div className="flex items-center space-x-4">
//             <div>
//               <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
//               <p className="text-sm text-muted-foreground">
//                 Real-time analytics from your review database
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             {/* Filter Toggle */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowFilters((prev) => !prev)}
//             >
//               <Filter className="h-4 w-4 mr-1" />
//               Filters
//             </Button>

//             {/* Notifications Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="relative">
//                   <Bell className="h-4 w-4" />
//                   {notifications.length > 0 && (
//                     <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end" className="w-80">
//                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                 <DropdownMenuSeparator />

//                 {notifications.length === 0 ? (
//                   <DropdownMenuItem className="text-sm text-muted-foreground">
//                     No new notifications
//                   </DropdownMenuItem>
//                 ) : (
//                   notifications.map((n) => (
//                     <DropdownMenuItem key={n.id} className="flex flex-col items-start">
//                       <p className="text-sm">{n.message}</p>
//                       <span className="text-xs text-muted-foreground">{n.time}</span>
//                     </DropdownMenuItem>
//                   ))
//                 )}

//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => setNotifications([])}
//                   className="text-sm text-blue-600 cursor-pointer"
//                 >
//                   Clear all
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>

//         {/* Collapsible Filters Panel */}
//         {showFilters && (
//           <div className="px-6 py-4 border-b border-border bg-card transition-all duration-300">
//             <FiltersPanel />
//           </div>
//         )}

//         {/* Dashboard Main Section */}
//         <main className="p-6 space-y-6 flex-1 overflow-y-auto">
//           <MetricsCards />
//           <ChartsGrid />
//           <ProductRankings />
//         </main>
//       </div>

//       {/* Floating Chatbot */}
//       <Chatbot /> {/* <-- Your AI Chatbot appears on all pages */}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import FiltersPanel from "@/components/dashboard/filters-panel";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ChartsGrid from "@/components/dashboard/charts-grid";
import ProductRankings from "@/components/dashboard/product-rankings";
import Chatbot from "@/components/chatbot/chatbot";
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
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; time: string }[]
  >([]);
  const [selectedSource, setSelectedSource] = useState("products");

  const BASE_URL = "http://127.0.0.1:9001"; // 🔹 Change to your remote FastAPI URL in production

  // Fetch notifications from FastAPI
  const fetchNotifications = async (source = selectedSource) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications?table=${source}`);
      const data = await res.json();
      if (data?.data) {
        setNotifications(data.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // 🔄 Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [selectedSource]);

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

        {/* Collapsible Filters Panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-border bg-card transition-all duration-300">
            <FiltersPanel />
          </div>
        )}

        {/* Dashboard Main Section */}
        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
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

