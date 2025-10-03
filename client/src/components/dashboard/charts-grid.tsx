// ============================================
// FILE: src/components/dashboard/charts-grid.tsx (CORRECTED)
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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { api, SentimentData, RatingData, CategoryData } from "@/lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
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
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [ratingData, setRatingData] = useState<RatingData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sentiment, ratings, categories] = await Promise.all([
          api.getSentimentDistribution(),
          api.getRatingDistribution(),
          api.getCategoryStatistics()
        ]);
        setSentimentData(sentiment);
        setRatingData(ratings);
        setCategoryData(categories);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
  };

  // Sentiment chart
  const sentimentChartData = {
    labels: sentimentData.map(d => d.sentiment),
    datasets: [{
      data: sentimentData.map(d => d.count),
      backgroundColor: [
        'hsl(142.1 76.2% 36.3%)', // Positive - green
        'hsl(24.6 95% 53.1%)',    // Negative - orange
        'hsl(221.2 83.2% 53.3%)', // Neutral - blue
      ],
      borderWidth: 2,
      borderColor: 'hsl(var(--background))',
    }],
  };

  // Rating distribution chart
  const ratingChartData = {
    labels: ratingData.map(d => `${d.rating} Star`),
    datasets: [{
      label: 'Number of Reviews',
      data: ratingData.map(d => d.count),
      backgroundColor: [
        'hsl(0 84% 60%)',      // 1 star - red
        'hsl(24 84% 60%)',     // 2 stars - orange
        'hsl(45 84% 60%)',     // 3 stars - yellow
        'hsl(142 71% 45%)',    // 4 stars - light green
        'hsl(142 76% 36%)',    // 5 stars - dark green
      ],
    }],
  };

  // Category chart
  const categoryChartData = {
    labels: categoryData.slice(0, 6).map(d => d.category),
    datasets: [{
      label: 'Reviews by Category',
      data: categoryData.slice(0, 6).map(d => d.review_count),
      backgroundColor: [
        'hsl(221.2 83.2% 53.3%)',
        'hsl(142.1 76.2% 36.3%)',
        'hsl(24.6 95% 53.1%)',
        'hsl(280 80% 55%)',
        'hsl(38.7 92% 50%)',
        'hsl(200 80% 55%)',
      ],
    }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard title="Sentiment Distribution" isLoading={isLoading}>
        <Doughnut data={sentimentChartData} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Rating Distribution" isLoading={isLoading}>
        <Bar data={ratingChartData} options={commonOptions} />
      </ChartCard>

      <ChartCard title="Top Categories" isLoading={isLoading}>
        <Bar data={categoryChartData} options={commonOptions} />
      </ChartCard>
    </div>
  );
}