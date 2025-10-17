import { useEffect, useState } from "react";
import axios from "axios";
import { useRoute, useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductData {
  product_name: string;
  avg_price: number;
  avg_rating: number;
  total_reviews: number;
  category?: string;
  brand?: string;
}

export default function ProductDetails() {
  // Match the route to /product/:productName
  const [match, params] = useRoute("/product/:productName");
  const productName = params?.productName
    ? decodeURIComponent(params.productName)
    : "";
  const [, setLocation] = useLocation();

  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!productName) {
      setError("No product specified.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<ProductData>(
          `http://localhost:8000/product/${encodeURIComponent(productName)}`
        );

        if (response.data && Object.keys(response.data).length > 0) {
          setData(response.data);
        } else {
          setError("No data found for this product.");
          setData(null);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError("Failed to fetch product details.");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No data available for this product.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-6">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm rounded-xl mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {data.product_name}
          </h2>
          <button
            onClick={() => setLocation("/categories")}
            className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Categories
          </button>
        </header>

        {/* Optional: category & brand */}
        <div className="mb-6 text-gray-700">
          {data.category && <p><strong>Category:</strong> {data.category}</p>}
          {data.brand && <p><strong>Brand:</strong> {data.brand}</p>}
        </div>

        {/* Product Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md border border-gray-200 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-gray-700">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                ₹{data.avg_price.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border border-gray-200 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-gray-700">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {data.avg_rating.toFixed(1)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border border-gray-200 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-gray-700">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                {data.total_reviews}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
