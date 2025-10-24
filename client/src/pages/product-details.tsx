

// import { useEffect, useState } from "react";
// import { useLocation, useRoute } from "wouter";
// import axios from "axios";
// import Sidebar from "@/components/layout/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface ProductData {
//   product_name: string;
//   avg_price: number;
//   avg_rating: number;
//   total_reviews: number;
// }

// export default function ProductDetails() {
//   const [match, params] = useRoute("/product/:productName");
//   const productName = params?.productName ? decodeURIComponent(params.productName) : "";
//   const [, setLocation] = useLocation();

//   const urlParams = new URLSearchParams(window.location.search);
//   const fromCategory = urlParams.get("category") || "";
//   const fromPage = parseInt(urlParams.get("page") || "1");

//   const [data, setData] = useState<ProductData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!productName) return;

//     setLoading(true);
//     setError("");

//     axios
//       .get(`http://localhost:8000/product/${encodeURIComponent(productName)}`)
//       .then((res) => setData(res.data))
//       .catch(() => setError("Failed to fetch product details"))
//       .finally(() => setLoading(false));
//   }, [productName]);

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center text-slate-400 bg-gray-50">
//         Loading product details...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex h-screen items-center justify-center text-red-600 bg-gray-50">{error}</div>
//     );

//   if (!data)
//     return (
//       <div className="flex h-screen items-center justify-center text-gray-500 bg-gray-50">
//         No data available for this product.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="ml-64 p-6">
//         <header className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm rounded-xl mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">{data.product_name}</h2>
//           <button
//             onClick={() =>
//               fromCategory
//                 ? setLocation(`/category-products/${encodeURIComponent(fromCategory)}?page=${fromPage}`)
//                 : setLocation("/categories")
//             }
//             className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             ← Back
//           </button>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition">
//             <CardHeader>
//               <CardTitle className="text-gray-900 font-semibold">Average Price</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-blue-600">₹{data.avg_price.toFixed(2)}</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition">
//             <CardHeader>
//               <CardTitle className="text-gray-900 font-semibold">Average Rating</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-emerald-500">{data.avg_rating.toFixed(1)}</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition">
//             <CardHeader>
//               <CardTitle className="text-gray-900 font-semibold">Total Reviews</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-orange-500">{data.total_reviews}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductData {
  product_name: string;
  avg_price: number;
  avg_rating: number;
  total_reviews: number;
}

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:productName");
  const productName = params?.productName ? decodeURIComponent(params.productName) : "";
  const [, setLocation] = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const fromCategory = urlParams.get("category") || "";
  const fromPage = parseInt(urlParams.get("page") || "1");

  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productName) return;

    setLoading(true);
    setError("");

    axios
      .get(`http://localhost:8000/product/${encodeURIComponent(productName)}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to fetch product details"))
      .finally(() => setLoading(false));
  }, [productName]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-sky-600 bg-gradient-to-br from-sky-50 via-white to-sky-100">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-600 bg-gradient-to-br from-sky-50 via-white to-sky-100">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 bg-gradient-to-br from-sky-50 via-white to-sky-100">
        No data available for this product.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-gray-900 transition-all">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/70 border border-sky-100 shadow-lg rounded-2xl px-8 py-5 mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-sky-900">
            {data.product_name}
          </h2>
          <button
            onClick={() =>
              fromCategory
                ? setLocation(
                    `/category-products/${encodeURIComponent(
                      fromCategory
                    )}?page=${fromPage}`
                  )
                : setLocation("/categories")
            }
            className="text-sm font-medium bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            ← Back
          </button>
        </header>

        {/* Product Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="backdrop-blur-xl bg-white/80 border border-sky-100 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-[1.01] transition-all">
            <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white rounded-t-3xl">
              <CardTitle className="text-sky-900 font-semibold">
                Average Price
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-sky-600">
                ₹{data.avg_price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Based on market data</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border border-sky-100 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-[1.01] transition-all">
            <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white rounded-t-3xl">
              <CardTitle className="text-sky-900 font-semibold">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-emerald-500">
                {data.avg_rating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Customer satisfaction</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/80 border border-sky-100 shadow-xl rounded-3xl hover:shadow-2xl hover:scale-[1.01] transition-all">
            <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white rounded-t-3xl">
              <CardTitle className="text-sky-900 font-semibold">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-orange-500">
                {data.total_reviews}
              </p>
              <p className="text-sm text-gray-500 mt-1">Across all platforms</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
