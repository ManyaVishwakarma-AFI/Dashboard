// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "@/components/layout/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRoute, useLocation } from "wouter";

// interface Product {
//   product_name: string;
//   avg_price: number;
//   total_reviews: number;
//   avg_rating: number;
// }

// export default function CategoryProducts() {
//   const [match, params] = useRoute("/category-products/:category");
//   const category = params?.category ? decodeURIComponent(params.category) : "";
//   const [, setLocation] = useLocation();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);
//   const [totalCount, setTotalCount] = useState(0);
//   const [sortKey, setSortKey] = useState<keyof Product | "serial">("serial");
//   const [sortAsc, setSortAsc] = useState(true);

//   useEffect(() => {
//     if (!category) return;

//     setLoading(true);
//     axios
//       .get(
//         `http://localhost:8000/analytics/category/${encodeURIComponent(
//           category
//         )}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
//       )
//       .then((res) => {
//         setProducts(res.data.products);
//         setTotalCount(res.data.total_count);
//       })
//       .catch(() => setError("Failed to fetch products"))
//       .finally(() => setLoading(false));
//   }, [category, currentPage, itemsPerPage]);

//   const handleSort = (key: keyof Product | "serial") => {
//     const sorted = [...products].sort((a, b) => {
//       let aVal: number | string = a[key as keyof Product];
//       let bVal: number | string = b[key as keyof Product];

//       if (key === "serial") {
//         aVal = products.indexOf(a) + 1 + (currentPage - 1) * itemsPerPage;
//         bVal = products.indexOf(b) + 1 + (currentPage - 1) * itemsPerPage;
//       }

//       if (typeof aVal === "string") return sortAsc ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
//       return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
//     });
//     setProducts(sorted);
//     setSortKey(key);
//     setSortAsc(!sortAsc);
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center text-muted-foreground">
//         Loading products...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex h-screen items-center justify-center text-red-500">
//         {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="ml-64 min-h-screen p-6">
//         <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm rounded-xl mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Products in {category}</h2>
//           <button
//             onClick={() => setLocation("/categories")}
//             className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             ← Back
//           </button>
//         </header>

//         <Card className="shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
//           <CardHeader className="bg-blue-50">
//             <CardTitle className="text-lg font-semibold text-gray-800">Products Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto rounded-lg">
//               <table className="min-w-full divide-y divide-gray-200 text-gray-700">
//                 <thead className="bg-blue-50 sticky top-0 z-10">
//                   <tr>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("serial")}
//                     >
//                       #
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("product_name")}
//                     >
//                       Product Name
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_price")}
//                     >
//                       Avg. Price (₹)
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("total_reviews")}
//                     >
//                       Total Reviews
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_rating")}
//                     >
//                       Avg. Rating
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {products.map((p, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-blue-50 transition cursor-pointer"
//                       onClick={() => setLocation(`/product/${encodeURIComponent(p.product_name)}`)}
//                     >
//                       <td className="px-4 py-3 font-medium">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
//                       <td className="px-4 py-3">{p.product_name}</td>
//                       <td className="px-4 py-3">₹{p.avg_price.toFixed(2)}</td>
//                       <td className="px-4 py-3">{p.total_reviews}</td>
//                       <td className="px-4 py-3">{p.avg_rating.toFixed(1)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-4 gap-2">
//               <button
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`px-3 py-1 rounded hover:bg-gray-300 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "@/components/layout/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRoute, useLocation } from "wouter";

// interface Product {
//   product_name: string;
//   avg_price: number;
//   total_reviews: number;
//   avg_rating: number;
// }

// export default function CategoryProducts() {
//   const [match, params] = useRoute("/category-products/:category");
//   const category = params?.category ? decodeURIComponent(params.category) : "";
//   const [, setLocation] = useLocation();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);
//   const [totalCount, setTotalCount] = useState(0);
//   const [sortKey, setSortKey] = useState<keyof Product | "serial">("serial");
//   const [sortAsc, setSortAsc] = useState(true);

//   useEffect(() => {
//     if (!category) return;

//     setLoading(true);
//     axios
//       .get(
//         `http://localhost:8000/analytics/category/${encodeURIComponent(
//           category
//         )}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
//       )
//       .then((res) => {
//         setProducts(res.data.products);
//         setTotalCount(res.data.total_count);
//       })
//       .catch(() => setError("Failed to fetch products"))
//       .finally(() => setLoading(false));
//   }, [category, currentPage, itemsPerPage]);

//   const handleSort = (key: keyof Product | "serial") => {
//     const sorted = [...products].sort((a, b) => {
//       let aVal: number | string = a[key as keyof Product];
//       let bVal: number | string = b[key as keyof Product];

//       if (key === "serial") {
//         aVal = products.indexOf(a) + 1 + (currentPage - 1) * itemsPerPage;
//         bVal = products.indexOf(b) + 1 + (currentPage - 1) * itemsPerPage;
//       }

//       if (typeof aVal === "string") return sortAsc ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
//       return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
//     });
//     setProducts(sorted);
//     setSortKey(key);
//     setSortAsc(!sortAsc);
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center text-slate-400 bg-gray-50">
//         Loading products...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex h-screen items-center justify-center text-red-600 bg-gray-50">
//         {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="ml-64 min-h-screen p-6">
//         <header className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm rounded-xl mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Products in {category}</h2>
//           <button
//             onClick={() => setLocation("/categories")}
//             className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             ← Back
//           </button>
//         </header>

//         <Card className="shadow-lg border border-gray-200 rounded-2xl overflow-hidden bg-white">
//           <CardHeader className="bg-blue-50">
//             <CardTitle className="text-lg font-semibold text-gray-900">Products Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto rounded-lg">
//               <table className="min-w-full divide-y divide-gray-200 text-gray-800">
//                 <thead className="bg-gray-100 sticky top-0 z-10">
//                   <tr>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("serial")}
//                     >
//                       #
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("product_name")}
//                     >
//                       Product Name
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_price")}
//                     >
//                       Avg. Price (₹)
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("total_reviews")}
//                     >
//                       Total Reviews
//                     </th>
//                     <th
//                       className="px-4 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_rating")}
//                     >
//                       Avg. Rating
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {products.map((p, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-blue-50 transition cursor-pointer"
//                       onClick={() => setLocation(`/product/${encodeURIComponent(p.product_name)}`)}
//                     >
//                       <td className="px-4 py-3 font-medium">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
//                       <td className="px-4 py-3">{p.product_name}</td>
//                       <td className="px-4 py-3 text-gray-900 font-medium">₹{p.avg_price.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-gray-700">{p.total_reviews}</td>
//                       <td className="px-4 py-3 text-gray-700">{p.avg_rating.toFixed(1)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-4 gap-2">
//               <button
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`px-3 py-1 rounded transition ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "@/components/layout/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRoute, useLocation } from "wouter";

// interface Product {
//   product_name: string;
//   avg_price: number;
//   total_reviews: number;
//   avg_rating: number;
// }

// export default function CategoryProducts() {
//   const [match, params] = useRoute("/category-products/:category");
//   const category = params?.category ? decodeURIComponent(params.category) : "";
//   const [, setLocation] = useLocation();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);
//   const [totalCount, setTotalCount] = useState(0);
//   const [sortKey, setSortKey] = useState<keyof Product | "serial">("serial");
//   const [sortAsc, setSortAsc] = useState(true);

//   useEffect(() => {
//     if (!category) return;

//     setLoading(true);
//     axios
//       .get(
//         `http://localhost:8000/analytics/category/${encodeURIComponent(
//           category
//         )}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
//       )
//       .then((res) => {
//         setProducts(res.data.products);
//         setTotalCount(res.data.total_count);
//       })
//       .catch(() => setError("Failed to fetch products"))
//       .finally(() => setLoading(false));
//   }, [category, currentPage, itemsPerPage]);

//   const handleSort = (key: keyof Product | "serial") => {
//     const sorted = [...products].sort((a, b) => {
//       let aVal: number | string = a[key as keyof Product];
//       let bVal: number | string = b[key as keyof Product];

//       if (key === "serial") {
//         aVal = products.indexOf(a) + 1 + (currentPage - 1) * itemsPerPage;
//         bVal = products.indexOf(b) + 1 + (currentPage - 1) * itemsPerPage;
//       }

//       if (typeof aVal === "string")
//         return sortAsc
//           ? aVal.localeCompare(bVal as string)
//           : (bVal as string).localeCompare(aVal);
//       return sortAsc
//         ? (aVal as number) - (bVal as number)
//         : (bVal as number) - (aVal as number);
//     });
//     setProducts(sorted);
//     setSortKey(key);
//     setSortAsc(!sortAsc);
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center text-slate-400 bg-gradient-to-br from-sky-50 to-white">
//         Loading products...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex h-screen items-center justify-center text-red-600 bg-gradient-to-br from-sky-50 to-white">
//         {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-gray-900 transition-all">
//       <Sidebar />
//       <div className="ml-64 min-h-screen p-8">
//         {/* Header */}
//         <header className="backdrop-blur-xl bg-white/70 border border-sky-100 shadow-lg rounded-2xl px-8 py-5 mb-8 flex items-center justify-between">
//           <h2 className="text-3xl font-semibold text-sky-900">
//             Products in <span className="text-sky-600">{category}</span>
//           </h2>
//           <button
//             onClick={() => setLocation("/categories")}
//             className="text-sm font-medium bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
//           >
//             ← Back
//           </button>
//         </header>

//         {/* Product Table */}
//         <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80">
//           <CardHeader className="bg-gradient-to-r from-sky-100 to-white border-b border-sky-200">
//             <CardTitle className="text-xl font-semibold text-sky-900">
//               Products Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-100">
//                 <thead className="bg-gradient-to-r from-sky-50 to-white text-sky-800 text-sm font-medium">
//                   <tr>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("serial")}
//                     >
//                       #
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("product_name")}
//                     >
//                       Product Name
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_price")}
//                     >
//                       Avg. Price (₹)
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("total_reviews")}
//                     >
//                       Total Reviews
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_rating")}
//                     >
//                       Avg. Rating
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-sky-100 text-gray-700">
//                   {products.map((p, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-sky-50/60 transition-all cursor-pointer"
//                       onClick={() =>
//                         setLocation(`/product/${encodeURIComponent(p.product_name)}`)
//                       }
//                     >
//                       <td className="px-6 py-4 font-medium text-sky-900">
//                         {(currentPage - 1) * itemsPerPage + idx + 1}
//                       </td>
//                       <td className="px-6 py-4 font-medium">{p.product_name}</td>
//                       <td className="px-6 py-4 text-sky-700 font-semibold">
//                         ₹{p.avg_price.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4">{p.total_reviews}</td>
//                       <td className="px-6 py-4">{p.avg_rating.toFixed(1)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-2 p-6 bg-gradient-to-r from-white to-sky-50 border-t border-sky-100">
//               <button
//                 className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
//                     currentPage === i + 1
//                       ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow"
//                       : "bg-sky-100 text-sky-800 hover:bg-sky-200"
//                   }`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "@/components/layout/sidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRoute, useLocation } from "wouter";

// interface Product {
//   product_name: string;
//   avg_price: number;
//   total_reviews: number;
//   avg_rating: number;
// }

// export default function CategoryProducts() {
//   const [match, params] = useRoute("/category-products/:category");
//   const category = params?.category ? decodeURIComponent(params.category) : "";
//   const [, setLocation] = useLocation();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);
//   const [totalCount, setTotalCount] = useState(0);
//   const [sortKey, setSortKey] = useState<keyof Product | "serial">("serial");
//   const [sortAsc, setSortAsc] = useState(true);

//   useEffect(() => {
//     if (!category) return;

//     setLoading(true);
//     axios
//       .get(
//         `http://localhost:8000/analytics/category/${encodeURIComponent(
//           category
//         )}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
//       )
//       .then((res) => {
//         setProducts(res.data.products);
//         setTotalCount(res.data.total_count);
//       })
//       .catch(() => setError("Failed to fetch products"))
//       .finally(() => setLoading(false));
//   }, [category, currentPage, itemsPerPage]);

//   const handleSort = (key: keyof Product | "serial") => {
//     const sorted = [...products].sort((a, b) => {
//       let aVal: number | string = a[key as keyof Product];
//       let bVal: number | string = b[key as keyof Product];

//       if (key === "serial") {
//         aVal = products.indexOf(a) + 1 + (currentPage - 1) * itemsPerPage;
//         bVal = products.indexOf(b) + 1 + (currentPage - 1) * itemsPerPage;
//       }

//       if (typeof aVal === "string")
//         return sortAsc
//           ? aVal.localeCompare(bVal as string)
//           : (bVal as string).localeCompare(aVal);
//       return sortAsc
//         ? (aVal as number) - (bVal as number)
//         : (bVal as number) - (aVal as number);
//     });
//     setProducts(sorted);
//     setSortKey(key);
//     setSortAsc(!sortAsc);
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center text-slate-400 bg-gradient-to-br from-sky-50 to-white">
//         Loading products...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex h-screen items-center justify-center text-red-600 bg-gradient-to-br from-sky-50 to-white">
//         {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-gray-900 transition-all">
//       <Sidebar />
//       <div className="ml-64 min-h-screen p-8">
//         {/* Header */}
//         <header className="backdrop-blur-xl bg-white/70 border border-sky-100 shadow-lg rounded-2xl px-8 py-5 mb-8 flex items-center justify-between">
//           <h2 className="text-3xl font-semibold text-sky-900">
//             Products in <span className="text-sky-600">{category}</span>
//           </h2>
//           <button
//             onClick={() => setLocation("/categories")}
//             className="text-sm font-medium bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
//           >
//             ← Back
//           </button>
//         </header>

//         {/* Product Table */}
//         <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80">
//           <CardHeader className="bg-gradient-to-r from-sky-100 to-white border-b border-sky-200">
//             <CardTitle className="text-xl font-semibold text-sky-900">
//               Products Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-100">
//                 <thead className="bg-gradient-to-r from-sky-50 to-white text-sky-800 text-sm font-medium">
//                   <tr>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("serial")}
//                     >
//                       #
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("product_name")}
//                     >
//                       Product Name
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_price")}
//                     >
//                       Avg. Price (₹)
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("total_reviews")}
//                     >
//                       Total Reviews
//                     </th>
//                     <th
//                       className="px-6 py-3 text-left cursor-pointer"
//                       onClick={() => handleSort("avg_rating")}
//                     >
//                       Avg. Rating
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-sky-100 text-gray-700">
//                   {products.map((p, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-sky-50/60 transition-all cursor-pointer"
//                       onClick={() =>
//                         setLocation(
//                           `/product/${encodeURIComponent(p.product_name)}?category=${encodeURIComponent(
//                             category
//                           )}&page=${currentPage}`
//                         )
//                       }
//                     >
//                       <td className="px-6 py-4 font-medium text-sky-900">
//                         {(currentPage - 1) * itemsPerPage + idx + 1}
//                       </td>
//                       <td className="px-6 py-4 font-medium">{p.product_name}</td>
//                       <td className="px-6 py-4 text-sky-700 font-semibold">
//                         ₹{p.avg_price.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4">{p.total_reviews}</td>
//                       <td className="px-6 py-4">{p.avg_rating.toFixed(1)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-2 p-6 bg-gradient-to-r from-white to-sky-50 border-t border-sky-100">
//               <button
//                 className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
//                     currentPage === i + 1
//                       ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow"
//                       : "bg-sky-100 text-sky-800 hover:bg-sky-200"
//                   }`}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoute, useLocation } from "wouter";
import { ArrowUpDown } from "lucide-react";

interface Product {
  product_name: string;
  avg_price: number;
  total_reviews: number;
  avg_rating: number;
}

export default function CategoryProducts() {
  const [match, params] = useRoute("/category-products/:category");
  const category = params?.category ? decodeURIComponent(params.category) : "";
  const [, setLocation] = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [sortKey, setSortKey] = useState<keyof Product | "serial">("serial");
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch products
  useEffect(() => {
    if (!category) return;

    setLoading(true);
    axios
      .get(
        `http://localhost:8000/analytics/category/${encodeURIComponent(
          category
        )}?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`
      )
      .then((res) => {
        setProducts(res.data.products);
        setTotalCount(res.data.total_count);
      })
      .catch(() => setError("Failed to fetch products"))
      .finally(() => setLoading(false));
  }, [category, currentPage, itemsPerPage]);

  // Sorting logic
  const handleSort = (key: keyof Product | "serial") => {
    const sorted = [...products].sort((a, b) => {
      let aVal: number | string = a[key as keyof Product];
      let bVal: number | string = b[key as keyof Product];

      if (key === "serial") {
        aVal = products.indexOf(a) + 1 + (currentPage - 1) * itemsPerPage;
        bVal = products.indexOf(b) + 1 + (currentPage - 1) * itemsPerPage;
      }

      if (typeof aVal === "string")
        return sortAsc
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    setProducts(sorted);
    setSortKey(key);
    setSortAsc(!sortAsc);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 bg-gradient-to-br from-sky-50 to-white">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-600 bg-gradient-to-br from-sky-50 to-white">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-gray-900 transition-all">
      <Sidebar />
      <div className="ml-64 min-h-screen p-8">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/70 border border-sky-100 shadow-lg rounded-2xl px-8 py-5 mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-sky-900">
            Products in <span className="text-sky-600">{category}</span>
          </h2>
          <button
            onClick={() => setLocation("/categories")}
            className="text-sm font-medium bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            ← Back
          </button>
        </header>

        {/* Sorting Buttons */}
        <div className="flex gap-3 mb-4">
          {[
            { label: "Avg. Price (₹)", key: "avg_price" },
            { label: "Total Reviews", key: "total_reviews" },
            { label: "Avg. Rating", key: "avg_rating" },
          ].map((item) => (
            <Button
              key={item.key}
              variant={sortKey === item.key ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => handleSort(item.key as keyof Product)}
            >
              {item.label} {sortKey === item.key ? (sortAsc ? "↑" : "↓") : <ArrowUpDown className="w-4 h-4" />}
            </Button>
          ))}
        </div>

        {/* Product Table */}
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80">
          <CardHeader className="bg-gradient-to-r from-sky-100 to-white border-b border-sky-200">
            <CardTitle className="text-xl font-semibold text-sky-900">
              Products Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-gradient-to-r from-sky-50 to-white text-sky-800 text-sm font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Product Name</th>
                    <th className="px-6 py-3 text-left">Avg. Price (₹)</th>
                    <th className="px-6 py-3 text-left">Total Reviews</th>
                    <th className="px-6 py-3 text-left">Avg. Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 text-gray-700">
                  {products.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-sky-50/60 transition-all cursor-pointer"
                      onClick={() =>
                        setLocation(
                          `/product/${encodeURIComponent(p.product_name)}?category=${encodeURIComponent(
                            category
                          )}&page=${currentPage}`
                        )
                      }
                    >
                      <td className="px-6 py-4 font-medium text-sky-900">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-4 font-medium">{p.product_name}</td>
                      <td className="px-6 py-4 text-sky-700 font-semibold">
                        ₹{p.avg_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{p.total_reviews}</td>
                      <td className="px-6 py-4">{p.avg_rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 p-6 bg-gradient-to-r from-white to-sky-50 border-t border-sky-100">
              <button
                className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow"
                      : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
