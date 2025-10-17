import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tag, BarChart2, Star, ChevronRight } from "lucide-react";

interface Category {
  category: string;
  total_products: number;
  avg_price: number;
  avg_rating: number;
  total_reviews: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8000/analytics/category")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setError("Failed to fetch category data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading categories...</div>;

  if (error)
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold">Category Analytics</h2>
          <p className="text-sm text-muted-foreground">Insights for all product categories in your store</p>
        </header>

        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
                <Tag className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Product Categories</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Click the arrow to explore all products of a category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/20 dark:to-gray-800/10 hover:shadow-lg transition-all duration-300 border border-border rounded-2xl"
                >
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                      <BarChart2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-center">{cat.category}</CardTitle>
                    <CardDescription className="text-muted-foreground text-center">
                      {cat.total_products.toLocaleString()} products
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between text-green-600 font-semibold">
                      <span>₹{cat.avg_price.toFixed(2)} avg. price</span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4" /> {cat.avg_rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      Total Reviews: {cat.total_reviews.toLocaleString()}
                    </div>

                    <button
                      onClick={() => setLocation(`/category-products/${encodeURIComponent(cat.category)}`)}
                      className="flex items-center justify-center mt-3 bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition"
                    >
                      View Products <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
