import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface TrendingProduct {
  product_title: string;
  avg_rating: number;
  review_count: number;
}
 
function ProductCard({ product, index }: { product: TrendingProduct; index: number }) {
  const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500'];
  const gradients = [
    'from-green-50 to-green-100',
    'from-blue-50 to-blue-100',
    'from-purple-50 to-purple-100'
  ];
 
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg bg-gradient-to-r",
        gradients[index % gradients.length]
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
          colors[index % colors.length]
        )}>
          {index + 1}
        </div>
        <div>
          <p className="font-medium text-sm">{product.product_title.replace(/"/g, '')}</p>
          <p className="text-xs text-muted-foreground">
            {product.review_count} reviews
          </p>
        </div>
      </div>
      <TrendingUp className="h-5 w-5 text-green-600" />
    </div>
  );
}
 
export default function ProductRankings() {
  const BASE_URL = "http://122.176.108.253:9002"; // Remote server IP
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/top?table=amazon_reviews&n=10`);
        const json = await res.json();
        if (json && json.data) {
          setTrending(json.data);
        }
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchTrendingProducts();
  }, []);
 
  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <Card className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between mb-4 p-0">
          <CardTitle className="text-lg font-semibold">Top Trending Products</CardTitle>
          <Badge variant="secondary" className="text-xs">Live Data</Badge>
        </CardHeader>
 
        <CardContent className="p-0">
          {/* AI Summary */}
          {summaryLoading ? (
            <p className="text-sm text-muted-foreground mb-3">Generating AI summary...</p>
          ) : summary ? (
            <p className="text-sm font-medium mb-3">{summary}</p>
          ) : null}

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : trending.length > 0 ? (
              trending.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No trending products available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 
 
