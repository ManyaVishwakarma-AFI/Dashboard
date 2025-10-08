// // ============================================
// // FILE: src/components/dashboard/charts-grid.tsx (CORRECTED)
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
// } from 'chart.js';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import { api, SentimentData, RatingData, CategoryData } from "@/lib/api";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

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

// export default function ChartsGrid() {
//   const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
//   const [ratingData, setRatingData] = useState<RatingData[]>([]);
//   const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [sentiment, ratings, categories] = await Promise.all([
//           api.getSentimentDistribution(),
//           api.getRatingDistribution(),
//           api.getCategoryStatistics()
//         ]);
//         setSentimentData(sentiment);
//         setRatingData(ratings);
//         setCategoryData(categories);
//       } catch (error) {
//         console.error('Error fetching chart data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const commonOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'bottom' as const,
//       },
//     },
//   };

//   // Sentiment chart
//   const sentimentChartData = {
//     labels: sentimentData.map(d => d.sentiment),
//     datasets: [{
//       data: sentimentData.map(d => d.count),
//       backgroundColor: [
//         'hsl(142.1 76.2% 36.3%)', // Positive - green
//         'hsl(24.6 95% 53.1%)',    // Negative - orange
//         'hsl(221.2 83.2% 53.3%)', // Neutral - blue
//       ],
//       borderWidth: 2,
//       borderColor: 'hsl(var(--background))',
//     }],
//   };

//   // Rating distribution chart
//   const ratingChartData = {
//     labels: ratingData.map(d => `${d.rating} Star`),
//     datasets: [{
//       label: 'Number of Reviews',
//       data: ratingData.map(d => d.count),
//       backgroundColor: [
//         'hsl(0 84% 60%)',      // 1 star - red
//         'hsl(24 84% 60%)',     // 2 stars - orange
//         'hsl(45 84% 60%)',     // 3 stars - yellow
//         'hsl(142 71% 45%)',    // 4 stars - light green
//         'hsl(142 76% 36%)',    // 5 stars - dark green
//       ],
//     }],
//   };

//   // Category chart
//   const categoryChartData = {
//     labels: categoryData.slice(0, 6).map(d => d.category),
//     datasets: [{
//       label: 'Reviews by Category',
//       data: categoryData.slice(0, 6).map(d => d.review_count),
//       backgroundColor: [
//         'hsl(221.2 83.2% 53.3%)',
//         'hsl(142.1 76.2% 36.3%)',
//         'hsl(24.6 95% 53.1%)',
//         'hsl(280 80% 55%)',
//         'hsl(38.7 92% 50%)',
//         'hsl(200 80% 55%)',
//       ],
//     }],
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       <ChartCard title="Sentiment Distribution" isLoading={isLoading}>
//         <Doughnut data={sentimentChartData} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Rating Distribution" isLoading={isLoading}>
//         <Bar data={ratingChartData} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Top Categories" isLoading={isLoading}>
//         <Bar data={categoryChartData} options={commonOptions} />
//       </ChartCard>
//     </div>
//   );
// }

// ============================================
// FILE: src/components/dashboard/charts-grid.tsx
// ============================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Bar, Doughnut } from "react-chartjs-2";
 
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
 
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

 
function ChartCard({ title, children, isLoading }: ChartCardProps) {
  return (
    <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="secondary" className="text-xs">
          Live Data
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="chart-container relative h-80 w-full">
          {isLoading ? <Skeleton className="w-full h-full" /> : children}
        </div>
      </CardContent>
    </Card>
  );
}
 
export default function ChartsGrid() {
  const BASE_URL = "http://122.176.108.253:9002"; // your remote server IP
 
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topReviews, setTopReviews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [sentiments, setSentiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from FastAPI endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topProductsRes,
          topReviewsRes,
          categoriesRes,
          ratingsRes,
          sentimentsRes,
        ] = await Promise.all([
          fetch("http://localhost:8000/products/top?n=10").then((res) => res.json()),
          fetch("http://localhost:8000/Amazon_Reviews/top?n=10").then((res) => res.json()),
          fetch("http://localhost:8000/Amazon_Reviews/categories").then((res) => res.json()),
          fetch("http://localhost:8000/Amazon_Reviews/ratings").then((res) => res.json()),
          fetch("http://localhost:8000/Amazon_Reviews/sentiment").then((res) => res.json()),
        ]);

        setTopProducts(topProductsRes);
        setTopReviews(topReviewsRes);
        setCategories(categoriesRes);
        setRatings(ratingsRes);
        setSentiments(sentimentsRes);
 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          productsRes,
          reviewsRes,
          categoriesRes,
          ratingsRes,
          sentimentRes,
        ] = await Promise.all([
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
 
        // Map data correctly based on your backend JSON structure
        setTopProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
        setTopReviews(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
        setCategories(Array.isArray(categoriesJson) ? categoriesJson : []);
        setRatings(Array.isArray(ratingsJson) ? ratingsJson : []);
        setSentiments(Array.isArray(sentimentJson) ? sentimentJson : []);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

 
    fetchAll();
  }, []);
 
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" as const } },
  };

  // Chart Data
  const topProductsChart = {
    labels: topProducts.map((p) => p.title),
    datasets: [{ label: "Rating", data: topProducts.map((p) => p.rating), backgroundColor: "hsl(142,76%,36%)" }],
  };

  const topReviewsChart = {
    labels: topReviews.map((r) => r.product_title),
    datasets: [{ label: "Star Rating", data: topReviews.map((r) => r.star_rating), backgroundColor: "hsl(221,83%,53%)" }],
  };

  const categoriesChart = {
    labels: categories.map((c) => c.category),
    datasets: [{ label: "Number of Products", data: categories.map((c) => c.count), backgroundColor: "hsl(280,80%,55%)" }],
  };

  const ratingsChart = {
    labels: ratings.map((r) => r.rating),
    datasets: [{ label: "Count", data: ratings.map((r) => r.count), backgroundColor: "hsl(24,95%,53%)" }],
  };

  const sentimentsChart = {
    labels: sentiments.map((s) => s.sentiment),
    datasets: [{ label: "Count", data: sentiments.map((s) => s.count), backgroundColor: ["hsl(142,76%,36%)","hsl(24,95%,53%)","hsl(221,83%,53%)"] }],
 
  // Charts
 
  const topProductsChart = {
    labels: topProducts.map((p) => p.title.replace(/"/g, "")),
    datasets: [
      { label: "Rating", data: topProducts.map((p) => p.rating), backgroundColor: "hsl(142,76%,36%)" },
    ],
  };
 
  const topReviewsChart = {
    labels: topReviews.map((r) => r.product_title.replace(/"/g, "")),
    datasets: [
      { label: "Average Rating", data: topReviews.map((r) => r.avg_rating), backgroundColor: "hsl(221,83%,53%)" },
    ],
  };
 
  const trendingChart = {
    labels: topReviews.map((r) => r.product_title.replace(/"/g, "")),
    datasets: [
      { label: "Review Count", data: topReviews.map((r) => r.review_count), backgroundColor: "hsl(45,84%,60%)" },
    ],
  };
 
  const categoriesChart = {
    labels: categories.map((c) => c.category.replace(/"/g, "")),
    datasets: [
      { label: "Number of Products", data: categories.map((c) => c.count), backgroundColor: "hsl(280,80%,55%)" },
    ],
  };
 
  const ratingsChart = {
    labels: ratings.map((r) => `${r.rating} Star`),
    datasets: [
      {
        label: "Number of Reviews",
        data: ratings.map((r) => r.count),
        backgroundColor: ["hsl(0,84%,60%)","hsl(24,84%,60%)","hsl(45,84%,60%)","hsl(142,71%,45%)","hsl(142,76%,36%)"],
      },
    ],
  };
 
  const sentimentsChart = {
    labels: sentiments.map((s) => s.sentiment),
    datasets: [
      { label: "Count", data: sentiments.map((s) => s.count), backgroundColor: ["hsl(142,76%,36%)","hsl(24,95%,53%)","hsl(221,83%,53%)"] },
    ],
  };
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard title="Top Products by Rating" isLoading={isLoading}>
        <Bar data={topProductsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Top Reviews (Star Rating)" isLoading={isLoading}>
        <Bar data={topReviewsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Products by Category" isLoading={isLoading}>
        <Bar data={categoriesChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Rating Distribution" isLoading={isLoading}>
        <Bar data={ratingsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Sentiment Distribution" isLoading={isLoading}>
        <Doughnut data={sentimentsChart} options={commonOptions} />
      </ChartCard>
      <ChartCard title="Top Products by Rating" isLoading={isLoading}><Bar data={topProductsChart} options={commonOptions} /></ChartCard>
      <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading}><Bar data={topReviewsChart} options={commonOptions} /></ChartCard>
      <ChartCard title="Top Trending Products" isLoading={isLoading}><Bar data={trendingChart} options={commonOptions} /></ChartCard>
      <ChartCard title="Products by Category" isLoading={isLoading}><Bar data={categoriesChart} options={commonOptions} /></ChartCard>
      <ChartCard title="Rating Distribution" isLoading={isLoading}><Bar data={ratingsChart} options={commonOptions} /></ChartCard>
      <ChartCard title="Sentiment Distribution" isLoading={isLoading}><Doughnut data={sentimentsChart} options={commonOptions} /></ChartCard>
    </div>
  );
}
 