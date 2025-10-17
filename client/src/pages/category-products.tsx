import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, ChevronsUpDown } from "lucide-react";
import { useRoute, useLocation } from "wouter";

interface Product {
  product_id: number;
  product_name: string;
  avg_price: number;
  total_reviews: number;
  avg_rating: number;
}

export default function CategoryProducts() {
  const [match, params] = useRoute("/category-products/:category");
  const category = params?.category ? decodeURIComponent(params.category) : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!category) return;

    axios
      .get(`http://localhost:8000/analytics/category/${encodeURIComponent(category)}`)
      .then((res) => setProducts(res.data.products))
      .catch(() => setError("Failed to fetch products"))
      .finally(() => setLoading(false));
  }, [category]);

  const handleSort = () => {
    const sorted = [...products].sort((a, b) => {
      return sortAsc
        ? a.product_name.localeCompare(b.product_name)
        : b.product_name.localeCompare(a.product_name);
    });
    setProducts(sorted);
    setSortAsc(!sortAsc);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 min-h-screen p-6">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm rounded-xl mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products in {category}</h2>
            <p className="text-sm text-gray-500">
              View all products with price, reviews, and rating in this category
            </p>
          </div>
          <button
            onClick={() => setLocation("/categories")}
            className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Categories
          </button>
        </header>

        {/* Products Table */}
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl">
              <BarChart2 className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 text-center">
              {category} Products
            </h1>
            <p className="text-gray-500 text-center max-w-2xl">
              Detailed overview of products in this category.
            </p>
          </div>

          <Card className="shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg font-semibold text-gray-800">Products Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-gray-700">
                    <thead className="bg-blue-50 sticky top-0 z-10">
                      <tr>
                        <th
                          className="px-4 py-3 text-left cursor-pointer flex items-center space-x-1 hover:text-blue-600 transition"
                          onClick={handleSort}
                        >
                          <span>Product Name</span>
                          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        </th>
                        <th className="px-4 py-3 text-left">Avg. Price (₹)</th>
                        <th className="px-4 py-3 text-left">Total Reviews</th>
                        <th className="px-4 py-3 text-left">Avg. Rating</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((p) => (
                        <tr
                          key={p.product_id}
                          className="hover:bg-blue-50 transition cursor-pointer"
                          onClick={() => setLocation(`/product/${p.product_id}`)}
                        >
                          <td className="px-4 py-3 font-medium">{p.product_name}</td>
                          <td className="px-4 py-3">₹{p.avg_price.toFixed(2)}</td>
                          <td className="px-4 py-3">{p.total_reviews}</td>
                          <td className="px-4 py-3">{p.avg_rating.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No products found in this category.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
