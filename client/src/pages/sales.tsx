import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingCart,
  Star,
  IndianRupee,
  BarChart3,
} from "lucide-react";

interface TrendingProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
}

export default function Sales() {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/top?table=products&n=20")
      .then((res) => {
        setProducts(res.data.data || res.data);
      })
      .catch(() => setError("Failed to fetch top products"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading top product data...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">Top Products</h2>
            <p className="text-sm text-muted-foreground">
              Discover your best-selling products and performance insights
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Top 20 Products</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A detailed look at your highest-performing products by rating, price, and customer engagement.
              </p>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Card
                  key={p.id}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/20 dark:to-gray-800/10 hover:shadow-lg transition-all duration-300 border border-border rounded-2xl"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="truncate text-lg font-semibold text-foreground">
                        {p.title}
                      </CardTitle>
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {p.category}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <IndianRupee className="h-4 w-4" />
                          {p.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                          <Star className="h-4 w-4" />
                          {p.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          {p.reviews.toLocaleString()} reviews
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Insight */}
            <Card className="bg-gradient-to-r from-primary/10 to-green-500/10 border-none">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">AI Insight</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your top-performing products show strong engagement with an
                  average rating above <strong>4.0</strong>. Focus on promoting
                  similar categories and optimize pricing near ₹
                  <strong>
                    {products.length
                      ? products
                          .reduce((sum, p) => sum + p.price, 0) /
                        products.length
                      : 0}
                  </strong>{" "}
                  for improved conversion rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
