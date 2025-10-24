
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
// import { useAISummary } from "@/hooks/useAISummary"; // AI hook

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// interface ChartCardProps {
//   title: string;
//   children: React.ReactNode;
//   isLoading?: boolean;
//   summary?: string;
//   summaryLoading?: boolean;
// }

// function ChartCard({ title, children, isLoading, summary, summaryLoading }: ChartCardProps) {
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
//         <div className="mt-3 text-sm text-muted-foreground">
//           {summaryLoading ? "Generating AI summary..." : summary}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default function ChartsGrid() {
//   const BASE_URL = "http://localhost:8000"; // replace with your remote FastAPI URL

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

//   // Chart Data
//   const topProductsChart = {
//     labels: topProducts.map((p) => p.title.replace(/"/g, "")),
//     datasets: [{ label: "Rating", data: topProducts.map((p) => p.rating), backgroundColor: "hsl(142,76%,36%)" }],
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

//   // AI Summaries
//   const { summary: topProductsSummary, loading: topProductsSummaryLoading } = useAISummary(
//     "Summarize insights of top products by rating",
//     "products",
//     topProducts,
//     topProducts.length
//   );

//   const { summary: topReviewsSummary, loading: topReviewsSummaryLoading } = useAISummary(
//     "Summarize insights of top reviews (average rating)",
//     "amazon_reviews",
//     topReviews,
//     topReviews.length
//   );

//   const { summary: trendingSummary, loading: trendingSummaryLoading } = useAISummary(
//     "Summarize trending products based on reviews",
//     "amazon_reviews",
//     topReviews,
//     topReviews.length
//   );

//   const { summary: categoriesSummary, loading: categoriesSummaryLoading } = useAISummary(
//     "Summarize products by categories",
//     "products",
//     categories,
//     categories.length
//   );

//   const { summary: ratingsSummary, loading: ratingsSummaryLoading } = useAISummary(
//     "Summarize rating distribution insights",
//     "amazon_reviews",
//     ratings,
//     ratings.length
//   );

//   const { summary: sentimentsSummary, loading: sentimentsSummaryLoading } = useAISummary(
//     "Summarize sentiment distribution insights",
//     "amazon_reviews",
//     sentiments,
//     sentiments.length
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       <ChartCard title="Top Products by Rating" isLoading={isLoading} summary={topProductsSummary} summaryLoading={topProductsSummaryLoading}>
//         <Bar data={topProductsChart} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading} summary={topReviewsSummary} summaryLoading={topReviewsSummaryLoading}>
//         <Bar data={topReviewsChart} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Top Trending Products" isLoading={isLoading} summary={trendingSummary} summaryLoading={trendingSummaryLoading}>
//         <Bar data={trendingChart} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Products by Category" isLoading={isLoading} summary={categoriesSummary} summaryLoading={categoriesSummaryLoading}>
//         <Bar data={categoriesChart} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Rating Distribution" isLoading={isLoading} summary={ratingsSummary} summaryLoading={ratingsSummaryLoading}>
//         <Bar data={ratingsChart} options={commonOptions} />
//       </ChartCard>

//       <ChartCard title="Sentiment Distribution" isLoading={isLoading} summary={sentimentsSummary} summaryLoading={sentimentsSummaryLoading}>
//         <Doughnut data={sentimentsChart} options={commonOptions} />
//       </ChartCard>
//     </div>
//   );
// }



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
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useAISummary } from "@/hooks/useAISummary"; // AI hook

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  summary?: string;
  summaryLoading?: boolean;
}

function ChartCard({ title, children, isLoading, summary, summaryLoading }: ChartCardProps) {
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
        <div className="mt-3 text-sm text-muted-foreground">
          {summaryLoading ? "Generating AI summary..." : summary}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChartsGrid({ selectedSource }: { selectedSource: string }) {
  const BASE_URL = "http://localhost:8000"; // replace with your remote FastAPI URL

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topReviews, setTopReviews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [sentiments, setSentiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          fetch(`${BASE_URL}/top?table=flipkart&n=10`), // <-- updated table name
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
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" as const } },
  };

  // Chart Data
  const topProductsChart = {
    labels: topProducts.map((p) => p.title.replace(/"/g, "")),
    datasets: [{ label: "Rating", data: topProducts.map((p) => p.rating), backgroundColor: "hsl(142,76%,36%)" }],
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

  // AI Summaries
  const { summary: topProductsSummary, loading: topProductsSummaryLoading } = useAISummary(
    "Summarize insights of top products by rating",
    "flipkart", // <-- updated table name
    topProducts,
    topProducts.length
  );

  const { summary: topReviewsSummary, loading: topReviewsSummaryLoading } = useAISummary(
    "Summarize insights of top reviews (average rating)",
    "amazon_reviews",
    topReviews,
    topReviews.length
  );

  const { summary: trendingSummary, loading: trendingSummaryLoading } = useAISummary(
    "Summarize trending products based on reviews",
    "amazon_reviews",
    topReviews,
    topReviews.length
  );

  const { summary: categoriesSummary, loading: categoriesSummaryLoading } = useAISummary(
    "Summarize products by categories",
    "flipkart", // <-- updated table name
    categories,
    categories.length
  );

  const { summary: ratingsSummary, loading: ratingsSummaryLoading } = useAISummary(
    "Summarize rating distribution insights",
    "amazon_reviews",
    ratings,
    ratings.length
  );

  const { summary: sentimentsSummary, loading: sentimentsSummaryLoading } = useAISummary(
    "Summarize sentiment distribution insights",
    "amazon_reviews",
    sentiments,
    sentiments.length
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard title="Top Products by Rating" isLoading={isLoading} summary={topProductsSummary} summaryLoading={topProductsSummaryLoading}>
        <Bar data={topProductsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Top Reviews (Average Rating)" isLoading={isLoading} summary={topReviewsSummary} summaryLoading={topReviewsSummaryLoading}>
        <Bar data={topReviewsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Top Trending Products" isLoading={isLoading} summary={trendingSummary} summaryLoading={trendingSummaryLoading}>
        <Bar data={trendingChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Products by Category" isLoading={isLoading} summary={categoriesSummary} summaryLoading={categoriesSummaryLoading}>
        <Bar data={categoriesChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Rating Distribution" isLoading={isLoading} summary={ratingsSummary} summaryLoading={ratingsSummaryLoading}>
        <Bar data={ratingsChart} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Sentiment Distribution" isLoading={isLoading} summary={sentimentsSummary} summaryLoading={sentimentsSummaryLoading}>
        <Doughnut data={sentimentsChart} options={commonOptions} />
      </ChartCard>
    </div>
  );
}


