// // ============================================
// // FILE: src/components/dashboard/metrics-cards.tsx (CORRECTED)
// // ============================================

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   ShoppingCart, 
//   Star,
//   MessageSquare
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { api } from "@/lib/api";

// interface MetricCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   color: string;
//   isLoading?: boolean;
// }

// function MetricCard({ title, value, icon, color, isLoading }: MetricCardProps) {
//   if (isLoading) {
//     return (
//       <Card className="metric-card bg-card rounded-xl p-6 border shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <div className={cn("p-3 rounded-lg", color)}>
//             <Skeleton className="h-6 w-6" />
//           </div>
//         </div>
//         <Skeleton className="h-8 w-32 mb-2" />
//         <Skeleton className="h-4 w-24" />
//       </Card>
//     );
//   }

//   return (
//     <Card className="metric-card bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-4">
//         <div className={cn("p-3 rounded-lg", color)}>
//           {icon}
//         </div>
//         <Badge variant="secondary" className="ai-badge text-xs">Live</Badge>
//       </div>
      
//       <h3 className="text-2xl font-bold text-foreground mb-1">
//         {value}
//       </h3>
      
//       <p className="text-sm text-muted-foreground">{title}</p>
//     </Card>
//   );
// }

// export default function MetricsCards() {
//   const [statistics, setStatistics] = useState<any>(null);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [stats, cats] = await Promise.all([
//           api.getStatistics(),
//           api.getCategoryStatistics()
//         ]);
//         setStatistics(stats);
//         setCategories(cats);
//       } catch (error) {
//         console.error('Error fetching metrics:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const cards = [
//     {
//       title: "Total Reviews",
//       value: statistics ? formatNumber(statistics.total_reviews) : "0",
//       icon: <MessageSquare className="text-blue-600 h-6 w-6" />,
//       color: "bg-blue-100"
//     },
//     {
//       title: "Average Rating",
//       value: statistics?.average_rating ? statistics.average_rating.toFixed(1) : "0.0",
//       icon: <Star className="text-yellow-600 h-6 w-6" />,
//       color: "bg-yellow-100"
//     },
//     {
//       title: "Products",
//       value: categories.length.toString(),
//       icon: <ShoppingCart className="text-green-600 h-6 w-6" />,
//       color: "bg-green-100"
//     },
//     {
//       title: "Categories",
//       value: categories.length.toString(),
//       icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
//       color: "bg-purple-100"
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       {cards.map((card, index) => (
//         <MetricCard
//           key={index}
//           title={card.title}
//           value={card.value}
//           icon={card.icon}
//           color={card.color}
//           isLoading={isLoading}
//         />
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ShoppingCart, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

function MetricCard({ title, value, icon, color, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="metric-card bg-card rounded-xl p-6 border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-lg", color)}>
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </Card>
    );
  }

  return (
    <Card className="metric-card bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-lg", color)}>{icon}</div>
        <Badge variant="secondary" className="ai-badge text-xs">
          Live
        </Badge>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </Card>
  );
}

export default function MetricsCards() {
  const BASE_URL = "http://localhost:8000"; // your remote server IP
  const [statistics, setStatistics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch summary statistics
        const statsRes = await fetch(`${BASE_URL}/analytics/summary`);
        const statsJson = await statsRes.json();
        setStatistics(statsJson);

        // Fetch categories
        const catsRes = await fetch(`${BASE_URL}/analytics/category`);
        const catsJson = await catsRes.json();
        setCategories(Array.isArray(catsJson.categories) ? catsJson.categories : []);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const cards = [
    {
      title: "Total Reviews",
      value: statistics?.total_reviews ? formatNumber(statistics.total_reviews) : "0",
      icon: <MessageSquare className="text-blue-600 h-6 w-6" />,
      color: "bg-blue-100",
    },
    {
      title: "Average Rating",
      value: statistics?.avg_rating ? statistics.avg_rating.toFixed(2) : "0.0",
      icon: <Star className="text-yellow-600 h-6 w-6" />,
      color: "bg-yellow-100",
    },
    {
      title: "Products",
      value: statistics?.total_products ? statistics.total_products.toString() : "0",
      icon: <ShoppingCart className="text-green-600 h-6 w-6" />,
      color: "bg-green-100",
    },
    {
      title: "Categories",
      value: categories.length.toString(),
      icon: <TrendingUp className="text-purple-600 h-6 w-6" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <MetricCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
