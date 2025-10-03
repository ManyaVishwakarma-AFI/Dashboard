// ============================================
// FILE: src/pages/dashboard.tsx (CORRECTED)
// ============================================

import Sidebar from "@/components/layout/sidebar";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ChartsGrid from "@/components/dashboard/charts-grid";
import ProductRankings from "@/components/dashboard/product-rankings";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">Amazon Reviews Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Real-time analytics from your review database
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <MetricsCards />
          <ChartsGrid />
          <ProductRankings />
        </div>
      </div>
    </div>
  );
}

