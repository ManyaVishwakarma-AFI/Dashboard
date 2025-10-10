// // ============================================
// // FILE: src/components/dashboard/charts-grid.tsx
// // ============================================
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";
 
// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
 
// interface ChartCardProps {
//   title: string;
//   children: React.ReactNode;
//   isLoading?: boolean;
// }
 
// function ChartCard({ title, children, isLoading }: ChartCardProps) {
//   return (
//     <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//         <Badge variant="secondary" className="text-xs">
//           Live Data
//         </Badge>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="chart-container relative h-80 w-full">
//           {isLoading ? <Skeleton className="w-full h-full" /> : children}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
 
// export default function ChartsGrid() {
//   const BASE_URL = "http://127.0.0.1:9001"; // your remote server IP
 
//   const [topProducts, setTopProducts] = useState<any[]>([]);
//   const [topReviews, setTopReviews] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [sentiments, setSentiments] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
 
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [
//           productsRes,
//           reviewsRes,
//           categoriesRes,
//           ratingsRes,
//           sentimentRes,
//         ] = await Promise.all([
//           fetch(`${BASE_URL}/top?table=products&n=10`),
//           fetch(`${BASE_URL}/top?table=amazon_reviews&n=10`),
//           fetch(`${BASE_URL}/Amazon_Reviews/categories`),
//           fetch(`${BASE_URL}/Amazon_Reviews/ratings`),
//           fetch(`${BASE_URL}/Amazon_Reviews/sentiment`),
//         ]);
 
//         const productsJson = await productsRes.json();
//         const reviewsJson = await reviewsRes.json();
//         const categoriesJson = await categoriesRes.json();
//         const ratingsJson = await ratingsRes.json();
//         const sentimentJson = await sentimentRes.json();
 
//         // Map data correctly based on your backend JSON structure
//         setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
//         setTopReviews(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
//         setCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
//         setRatings(Array.isArray(ratingsJson) ? ratingsJson : []);
//         setSentiments(Array.isArray(sentimentJson) ? sentimentJson : []);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
 
//     fetchAll();
//   }, []);
 
//   const commonOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { display: true, position: "bottom" as const } },
//   };
 
//   // Charts
 
//   const topProductsChart = {
//     labels: topProducts.map((p) => p.title.replace(/"/g, "")),
//     datasets: [
//       { label: "Rating", data: topProducts.map((p) => p.rating), backgroundColor: "hsl(142,76%,36%)" },
//     ],
//   };
 
//   const topReviewsChart = {
//     labels: topReviews.map((r) => r.product_title.replace(/"/g, "")),
//     datasets: [
//       { label: "Average Rating", data: topReviews.map((r) => r.avg_rating), backgroundColor: "hsl(221,83%,53%)" },
//     ],
//   };
 
//   const trendingChart = {
//     labels: topReviews.map((r) => r.product_title.replace(/"/g, "")),
//     datasets: [
//       { label: "Review Count", data: topReviews.map((r) => r.review_count), backgroundColor: "hsl(45,84%,60%)" },
//     ],
//   };
 
//   const categoriesChart = {
//     labels: categories.map((c) => c.category.replace(/"/g, "")),
//     datasets: [
//       { label: "Number of Products", data: categories.map((c) => c.count), backgroundColor: "hsl(280,80%,55%)" },
//     ],
//   };
 
//   const ratingsChart = {
//     labels: ratings.map((r) => `${r.rating} Star`),
//     datasets: [
//       {
//         label: "Number of Reviews",
//         data: ratings.map((r) => r.count),
//         backgroundColor: ["hsl(0,84%,60%)","hsl(24,84%,60%)","hsl(45,84%,60%)","hsl(142,71%,45%)","hsl(142,76%,36%)"],
//       },
//     ],
//   };
 
//   const sentimentsChart = {
//     labels: sentiments.map((s) => s.sentiment),
//     datasets: [
//       { label: "Count", data: sentiments.map((s) => s.count), backgroundColor: ["hsl(142,76%,36%)","hsl(24,95%,53%)","hsl(221,83%,53%)"] },
//     ],
//   };
 
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       <ChartCard title="Top Products by Rating" isLoading={isLoading}><Bar data={topProductsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading}><Bar data={topReviewsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Top Trending Products" isLoading={isLoading}><Bar data={trendingChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Products by Category" isLoading={isLoading}><Bar data={categoriesChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Rating Distribution" isLoading={isLoading}><Bar data={ratingsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Sentiment Distribution" isLoading={isLoading}><Doughnut data={sentimentsChart} options={commonOptions} /></ChartCard>
//     </div>
//   );
// }
 
 
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";
// import { useChartInsight } from "@/hooks/useChartInsight";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// interface ChartCardProps {
//   title: string;
//   children: React.ReactNode;
//   isLoading?: boolean;
//   summary?: string | null;
//   summaryLoading?: boolean;
// }

// function ChartCard({ title, children, isLoading, summary, summaryLoading }: ChartCardProps) {
//   return (
//     <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//         <Badge variant="secondary" className="text-xs">Live Data</Badge>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="chart-container relative h-80 w-full">
//           {isLoading ? <Skeleton className="w-full h-full" /> : children}
//         </div>
//         {summary && (
//           <div className="mt-3 text-sm text-muted-foreground">
//             {summaryLoading ? "Generating AI summary..." : summary}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export default function ChartsGrid() {
//   const BASE_URL = "http://127.0.0.1:9001";
//   const [topProducts, setTopProducts] = useState<any[]>([]);
//   const [topReviews, setTopReviews] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [sentiments, setSentiments] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [productsRes, reviewsRes, categoriesRes, ratingsRes, sentimentRes] = await Promise.all([
//           fetch(`${BASE_URL}/top?table=products&n=10`),
//           fetch(`${BASE_URL}/top?table=amazon_reviews&n=10`),
//           fetch(`${BASE_URL}/Amazon_Reviews/categories`),
//           fetch(`${BASE_URL}/Amazon_Reviews/ratings`),
//           fetch(`${BASE_URL}/Amazon_Reviews/sentiment`),
//         ]);

//         const productsJson = await productsRes.json();
//         const reviewsJson = await reviewsRes.json();
//         const categoriesJson = await categoriesRes.json();
//         const ratingsJson = await ratingsRes.json();
//         const sentimentJson = await sentimentRes.json();

//         setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
//         setTopReviews(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
//         setCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
//         setRatings(Array.isArray(ratingsJson) ? ratingsJson : []);
//         setSentiments(Array.isArray(sentimentJson) ? sentimentJson : []);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);

//   const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom" as const } } };

//   const truncateTitle = (title: string, maxLength: number = 30) => {
//     if (!title) return "Unknown";
//     return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
//   };

//   // Chart data
//   const topProductsChart = { labels: topProducts.map(p => truncateTitle(p.title)), datasets: [{ label: "Rating", data: topProducts.map(p => p.rating), backgroundColor: "hsl(142,76%,36%)" }] };
//   const topReviewsChart = { labels: topReviews.map(r => truncateTitle(r.product_title)), datasets: [{ label: "Average Rating", data: topReviews.map(r => r.avg_rating), backgroundColor: "hsl(221,83%,53%)" }] };
//   const categoriesChart = { labels: categories.map(c => c.category || "Unknown"), datasets: [{ label: "Number of Products", data: categories.map(c => c.count), backgroundColor: "hsl(280,80%,55%)" }] };
//   const ratingsChart = { labels: ratings.map(r => `${r.rating} Star`), datasets: [{ label: "Number of Reviews", data: ratings.map(r => r.count), backgroundColor: ["hsl(0,84%,60%)","hsl(24,84%,60%)","hsl(45,84%,60%)","hsl(142,71%,45%)","hsl(142,76%,36%)"] }] };
//   const sentimentsChart = { labels: sentiments.map(s => s.sentiment || "Unknown"), datasets: [{ label: "Count", data: sentiments.map(s => s.count), backgroundColor: ["hsl(142,76%,36%)","hsl(24,95%,53%)","hsl(221,83%,53%)"] }] };

//   // AI Summaries via Ollama
//   const topProductsInsight = useChartInsight("Bar", topProductsChart);
//   const topReviewsInsight = useChartInsight("Bar", topReviewsChart);
//   const categoriesInsight = useChartInsight("Bar", categoriesChart);
//   const ratingsInsight = useChartInsight("Bar", ratingsChart);
//   const sentimentsInsight = useChartInsight("Doughnut", sentimentsChart);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       <ChartCard title="Top Products by Rating" isLoading={isLoading} summary={topProductsInsight.insight} summaryLoading={topProductsInsight.loading}><Bar data={topProductsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading} summary={topReviewsInsight.insight} summaryLoading={topReviewsInsight.loading}><Bar data={topReviewsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Products by Category" isLoading={isLoading} summary={categoriesInsight.insight} summaryLoading={categoriesInsight.loading}><Bar data={categoriesChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Rating Distribution" isLoading={isLoading} summary={ratingsInsight.insight} summaryLoading={ratingsInsight.loading}><Bar data={ratingsChart} options={commonOptions} /></ChartCard>
//       <ChartCard title="Sentiment Distribution" isLoading={isLoading} summary={sentimentsInsight.insight} summaryLoading={sentimentsInsight.loading}><Doughnut data={sentimentsChart} options={commonOptions} /></ChartCard>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// interface FilterState {
//   category: string;
//   priceRange: [number, number];
//   rating: number;
//   dateRange: string;
//   showTrendingOnly: boolean;
//   sortBy: string;
// }

// interface ChartsGridProps {
//   filters?: FilterState | null;
// }

// interface ChartCardProps {
//   title: string;
//   children: React.ReactNode;
//   isLoading?: boolean;
// }

// function ChartCard({ title, children, isLoading }: ChartCardProps) {
//   return (
//     <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//         <Badge variant="secondary" className="text-xs">Live Data</Badge>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="chart-container relative h-80 w-full">
//           {isLoading ? <Skeleton className="w-full h-full" /> : children}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default function ChartsGrid({ filters }: ChartsGridProps) {
//   const BASE_URL = "http://127.0.0.1:9001";
//   const [topProducts, setTopProducts] = useState<any[]>([]);
//   const [topReviews, setTopReviews] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [sentiments, setSentiments] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setIsLoading(true);
//       try {
//         // If filters are applied, use the filtered endpoint
//         if (filters && (filters.category !== "All Categories" || filters.rating > 0)) {
//           // Build query params
//           const params = new URLSearchParams();
//           if (filters.category && filters.category !== "All Categories") {
//             params.append("category", filters.category);
//           }
//           if (filters.rating > 0) {
//             params.append("min_rating", filters.rating.toString());
//           }
//           if (filters.dateRange) {
//             params.append("date_range", filters.dateRange);
//           }

//           // Fetch filtered analytics
//           const analyticsRes = await fetch(`${BASE_URL}/Amazon_Reviews/analytics/filtered?${params.toString()}`);
//           const analyticsData = await analyticsRes.json();

//           console.log("Filtered analytics data:", analyticsData);

//           // Set data from filtered response
//           setCategories(analyticsData.category_stats || []);
//           setRatings(analyticsData.rating_distribution || []);
//           setSentiments(analyticsData.sentiment_distribution || []);
//           setTopReviews(analyticsData.top_products || []);

//           // Still fetch top products from products table
//           const productsRes = await fetch(`${BASE_URL}/top?table=products&n=10`);
//           const productsJson = await productsRes.json();
//           setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);

//         } else {
//           // No filters applied - fetch all data normally
//           const [productsRes, reviewsRes, categoriesRes, ratingsRes, sentimentRes] = await Promise.all([
//             fetch(`${BASE_URL}/top?table=products&n=10`),
//             fetch(`${BASE_URL}/top?table=amazon_reviews&n=10`),
//             fetch(`${BASE_URL}/Amazon_Reviews/categories`),
//             fetch(`${BASE_URL}/Amazon_Reviews/ratings`),
//             fetch(`${BASE_URL}/Amazon_Reviews/sentiment`),
//           ]);

//           const productsJson = await productsRes.json();
//           const reviewsJson = await reviewsRes.json();
//           const categoriesJson = await categoriesRes.json();
//           const ratingsJson = await ratingsRes.json();
//           const sentimentJson = await sentimentRes.json();

//           setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
//           setTopReviews(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
//           setCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
//           setRatings(Array.isArray(ratingsJson) ? ratingsJson : []);
//           setSentiments(Array.isArray(sentimentJson) ? sentimentJson : []);
//         }
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAll();
//   }, [filters]); // Re-fetch when filters change

//   const commonOptions = { 
//     responsive: true, 
//     maintainAspectRatio: false, 
//     plugins: { 
//       legend: { 
//         display: true, 
//         position: "bottom" as const 
//       } 
//     } 
//   };

//   const truncateTitle = (title: string, maxLength: number = 30) => {
//     if (!title) return "Unknown";
//     return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
//   };

//   // Chart data
//   const topProductsChart = { 
//     labels: topProducts.map(p => truncateTitle(p.title || p.product_title)), 
//     datasets: [{ 
//       label: "Rating", 
//       data: topProducts.map(p => p.rating || p.avg_rating), 
//       backgroundColor: "hsl(142,76%,36%)" 
//     }] 
//   };

//   const topReviewsChart = { 
//     labels: topReviews.map(r => truncateTitle(r.product_title)), 
//     datasets: [{ 
//       label: "Average Rating", 
//       data: topReviews.map(r => r.avg_rating), 
//       backgroundColor: "hsl(221,83%,53%)" 
//     }] 
//   };

//   const categoriesChart = { 
//     labels: categories.map(c => c.category || "Unknown"), 
//     datasets: [{ 
//       label: "Number of Products", 
//       data: categories.map(c => c.count), 
//       backgroundColor: "hsl(280,80%,55%)" 
//     }] 
//   };

//   const ratingsChart = { 
//     labels: ratings.map(r => `${r.rating} Star`), 
//     datasets: [{ 
//       label: "Number of Reviews", 
//       data: ratings.map(r => r.count), 
//       backgroundColor: [
//         "hsl(0,84%,60%)",
//         "hsl(24,84%,60%)",
//         "hsl(45,84%,60%)",
//         "hsl(142,71%,45%)",
//         "hsl(142,76%,36%)"
//       ] 
//     }] 
//   };

//   const sentimentsChart = { 
//     labels: sentiments.map(s => s.sentiment || "Unknown"), 
//     datasets: [{ 
//       label: "Count", 
//       data: sentiments.map(s => s.count), 
//       backgroundColor: [
//         "hsl(142,76%,36%)",
//         "hsl(24,95%,53%)",
//         "hsl(221,83%,53%)"
//       ] 
//     }] 
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       <ChartCard title="Top Products by Rating" isLoading={isLoading}>
//         <Bar data={topProductsChart} options={commonOptions} />
//       </ChartCard>
      
//       <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading}>
//         <Bar data={topReviewsChart} options={commonOptions} />
//       </ChartCard>
      
//       <ChartCard title="Products by Category" isLoading={isLoading}>
//         <Bar data={categoriesChart} options={commonOptions} />
//       </ChartCard>
      
//       <ChartCard title="Rating Distribution" isLoading={isLoading}>
//         <Bar data={ratingsChart} options={commonOptions} />
//       </ChartCard>
      
//       <ChartCard title="Sentiment Distribution" isLoading={isLoading}>
//         <Doughnut data={sentimentsChart} options={commonOptions} />
//       </ChartCard>
//     </div>
//   );
// }

// ============================================
// FILE 1: src/components/dashboard/charts-grid.tsx (UPDATED WITH AI)
// ============================================
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { AISummaryDisplay } from "@/components/chatbot/ai_summary_display"; // ADD THIS IMPORT

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  dateRange: string;
  showTrendingOnly: boolean;
  sortBy: string;
}

interface ChartsGridProps {
  filters?: FilterState | null;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  chartData?: any[];
  chartType?: string;
}

function ChartCard({ title, children, isLoading, chartData, chartType }: ChartCardProps) {
  return (
    <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="chart-container relative h-80 w-full">
          {isLoading ? <Skeleton className="w-full h-full" /> : children}
        </div>
        
        {/* ADD AI SUMMARY HERE - Only show when not loading and data exists */}
        {!isLoading && chartData && chartData.length > 0 && chartType && (
          <AISummaryDisplay
            chartData={chartData}
            chartType={chartType}
            source="amazon_reviews"
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function ChartsGrid({ filters }: ChartsGridProps) {
  const BASE_URL = "http://127.0.0.1:9001";
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topReviews, setTopReviews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [sentiments, setSentiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        if (filters && (filters.category !== "All Categories" || filters.rating > 0)) {
          const params = new URLSearchParams();
          if (filters.category && filters.category !== "All Categories") {
            params.append("category", filters.category);
          }
          if (filters.rating > 0) {
            params.append("min_rating", filters.rating.toString());
          }
          if (filters.dateRange) {
            params.append("date_range", filters.dateRange);
          }

          const analyticsRes = await fetch(`${BASE_URL}/Amazon_Reviews/analytics/filtered?${params.toString()}`);
          const analyticsData = await analyticsRes.json();

          setCategories(analyticsData.category_stats || []);
          setRatings(analyticsData.rating_distribution || []);
          setSentiments(analyticsData.sentiment_distribution || []);
          setTopReviews(analyticsData.top_products || []);

          const productsRes = await fetch(`${BASE_URL}/top?table=products&n=10`);
          const productsJson = await productsRes.json();
          setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
        } else {
          const [productsRes, reviewsRes, categoriesRes, ratingsRes, sentimentRes] = await Promise.all([
            fetch(`${BASE_URL}/top?table=products&n=10`),
            fetch(`${BASE_URL}/top?table=amazon_reviews&n=10`),
            fetch(`${BASE_URL}/Amazon_Reviews/categories`),
            fetch(`${BASE_URL}/Amazon_Reviews/ratings`),
            fetch(`${BASE_URL}/Amazon_Reviews/sentiment`),
          ]);

          const productsJson = await productsRes.json();
          const reviewsJson = await reviewsRes.json();
          const categoriesJson = await categoriesRes.json();
          const ratingsJson = await ratingsRes.json();
          const sentimentJson = await sentimentRes.json();

          setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
          setTopReviews(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
          setCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
          setRatings(Array.isArray(ratingsJson) ? ratingsJson : []);
          setSentiments(Array.isArray(sentimentJson) ? sentimentJson : []);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [filters]);

  const commonOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { 
      legend: { 
        display: true, 
        position: "bottom" as const 
      } 
    } 
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (!title) return "Unknown";
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  // Chart data
  const topProductsChart = { 
    labels: topProducts.map(p => truncateTitle(p.title || p.product_title)), 
    datasets: [{ 
      label: "Rating", 
      data: topProducts.map(p => p.rating || p.avg_rating), 
      backgroundColor: "hsl(142,76%,36%)" 
    }] 
  };

  const topReviewsChart = { 
    labels: topReviews.map(r => truncateTitle(r.product_title)), 
    datasets: [{ 
      label: "Average Rating", 
      data: topReviews.map(r => r.avg_rating), 
      backgroundColor: "hsl(221,83%,53%)" 
    }] 
  };

  const categoriesChart = { 
    labels: categories.map(c => c.category || "Unknown"), 
    datasets: [{ 
      label: "Number of Products", 
      data: categories.map(c => c.count), 
      backgroundColor: "hsl(280,80%,55%)" 
    }] 
  };

  const ratingsChart = { 
    labels: ratings.map(r => `${r.rating} Star`), 
    datasets: [{ 
      label: "Number of Reviews", 
      data: ratings.map(r => r.count), 
      backgroundColor: [
        "hsl(0,84%,60%)",
        "hsl(24,84%,60%)",
        "hsl(45,84%,60%)",
        "hsl(142,71%,45%)",
        "hsl(142,76%,36%)"
      ] 
    }] 
  };

  const sentimentsChart = { 
    labels: sentiments.map(s => s.sentiment || "Unknown"), 
    datasets: [{ 
      label: "Count", 
      data: sentiments.map(s => s.count), 
      backgroundColor: [
        "hsl(142,76%,36%)",
        "hsl(24,95%,53%)",
        "hsl(221,83%,53%)"
      ] 
    }] 
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard 
        title="Top Products by Rating" 
        isLoading={isLoading}
        chartData={topProducts}
        chartType="Top Products by Rating"
      >
        <Bar data={topProductsChart} options={commonOptions} />
      </ChartCard>
      
      <ChartCard 
        title="Top Reviews (Average Rating)" 
        isLoading={isLoading}
        chartData={topReviews}
        chartType="Top Reviews Analysis"
      >
        <Bar data={topReviewsChart} options={commonOptions} />
      </ChartCard>
      
      <ChartCard 
        title="Products by Category" 
        isLoading={isLoading}
        chartData={categories}
        chartType="Category Distribution"
      >
        <Bar data={categoriesChart} options={commonOptions} />
      </ChartCard>
      
      <ChartCard 
        title="Rating Distribution" 
        isLoading={isLoading}
        chartData={ratings}
        chartType="Rating Distribution"
      >
        <Bar data={ratingsChart} options={commonOptions} />
      </ChartCard>
      
      <ChartCard 
        title="Sentiment Distribution" 
        isLoading={isLoading}
        chartData={sentiments}
        chartType="Sentiment Analysis"
      >
        <Doughnut data={sentimentsChart} options={commonOptions} />
      </ChartCard>
    </div>
  );
}