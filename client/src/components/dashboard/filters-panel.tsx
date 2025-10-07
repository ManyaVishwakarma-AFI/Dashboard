import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, X, RotateCcw } from "lucide-react";

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  dateRange: string;
  showTrendingOnly: boolean;
  sortBy: string;
}

const DATE_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

const SORT_OPTIONS = [
  { value: "sales_desc", label: "Sales (High to Low)" },
  { value: "sales_asc", label: "Sales (Low to High)" },
  { value: "profit_desc", label: "Profit Margin (High to Low)" },
  { value: "profit_asc", label: "Profit Margin (Low to High)" },
  { value: "rating_desc", label: "Rating (High to Low)" },
  { value: "price_desc", label: "Price (High to Low)" },
  { value: "price_asc", label: "Price (Low to High)" },
  { value: "trending", label: "Trending" },
];

export default function FiltersPanel() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All Categories",
    priceRange: [0, 100000],
    rating: 0,
    dateRange: "30d",
    showTrendingOnly: false,
    sortBy: "sales_desc",
  });

  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  // Dynamic options from FastAPI
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [ratings, setRatings] = useState<number[]>([0]);

  // Fetch filter options from backend
  useEffect(() => {
    fetch("http://localhost:8000/Amazon_Reviews/filters")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(["All Categories", ...data.categories]);
        if (data.ratings) setRatings([0, ...data.ratings]);
      })
      .catch((err) => console.error("Failed to load filters:", err));
  }, []);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) return `₹${(price / 1000).toFixed(0)}K`;
    return `₹${price.toLocaleString()}`;
  };

  const resetFilters = () => {
    setFilters({
      category: "All Categories",
      priceRange: [0, 100000],
      rating: 0,
      dateRange: "30d",
      showTrendingOnly: false,
      sortBy: "sales_desc",
    });
    setAppliedFilters([]);
  };

  const applyFilters = () => {
    const applied: string[] = [];
    if (filters.category !== "All Categories") applied.push(`Category: ${filters.category}`);
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000)
      applied.push(`Price: ${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`);
    if (filters.rating > 0) applied.push(`Rating: ${filters.rating}+ stars`);
    if (filters.showTrendingOnly) applied.push("Trending Only");
    setAppliedFilters(applied);
  };

  const removeFilter = (filterToRemove: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f !== filterToRemove));
    if (filterToRemove.startsWith("Category:")) updateFilter("category", "All Categories");
    else if (filterToRemove.startsWith("Price:")) updateFilter("priceRange", [0, 100000]);
    else if (filterToRemove.startsWith("Rating:")) updateFilter("rating", 0);
    else if (filterToRemove === "Trending Only") updateFilter("showTrendingOnly", false);
  };

  return (
    <Card className="bg-card rounded-lg border mb-6" data-testid="filters-panel">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters & Settings
        </CardTitle>
        <Button variant="outline" size="sm" onClick={resetFilters} data-testid="button-reset-filters">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Applied Filters */}
        {appliedFilters.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Applied Filters</Label>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeFilter(filter)}
                >
                  {filter} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Separator className="mt-4" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Select value={filters.rating.toString()} onValueChange={(v) => updateFilter("rating", parseFloat(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                {ratings.filter(r => r !== 0).map((r) => (
                  <SelectItem key={r} value={r.toString()}>{r}+ Stars</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Slider */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(v) => updateFilter("priceRange", v as [number, number])}
              min={0}
              max={100000}
              step={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>

          {/* Trending Switch */}
          <div className="space-y-2">
            <Label>Trending Only</Label>
            <Switch
              checked={filters.showTrendingOnly}
              onCheckedChange={(checked) => updateFilter("showTrendingOnly", checked)}
            />
          </div>
        </div>

        {/* Apply & Clear Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Clear All</Button>
        </div>
      </CardContent>
    </Card>
  );
}





// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Filter, X, RotateCcw } from "lucide-react";
 
// interface FilterState {
//   category: string;
//   priceRange: [number, number];
//   rating: number;
//   dateRange: string;
//   showTrendingOnly: boolean;
//   sortBy: string;
// }
 
// const CATEGORIES = [
//   "All Categories",
//   "Electronics",
//   "Fashion",
//   "Home & Kitchen",
//   "Books",
//   "Sports & Fitness",
//   "Beauty & Personal Care",
//   "Automotive",
//   "Health & Wellness",
//   "Toys & Games",
//   "Office Supplies",
//   "Garden & Outdoor",
//   "Pet Supplies"
// ];
 
// const DATE_RANGES = [
//   { value: "7d", label: "Last 7 days" },
//   { value: "30d", label: "Last 30 days" },
//   { value: "90d", label: "Last 3 months" },
//   { value: "1y", label: "Last year" },
//   { value: "all", label: "All time" },
// ];
 
// const SORT_OPTIONS = [
//   { value: "sales_desc", label: "Sales (High to Low)" },
//   { value: "sales_asc", label: "Sales (Low to High)" },
//   { value: "profit_desc", label: "Profit Margin (High to Low)" },
//   { value: "profit_asc", label: "Profit Margin (Low to High)" },
//   { value: "rating_desc", label: "Rating (High to Low)" },
//   { value: "price_desc", label: "Price (High to Low)" },
//   { value: "price_asc", label: "Price (Low to High)" },
//   { value: "trending", label: "Trending" },
// ];
 
// export default function FiltersPanel() {
//   const [filters, setFilters] = useState<FilterState>({
//     category: "All Categories",
//     priceRange: [0, 100000],
//     rating: 0,
//     dateRange: "30d",
//     showTrendingOnly: false,
//     sortBy: "sales_desc"
//   });
 
//   const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
 
//   const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };
 
//   const formatPrice = (price: number) => {
//     if (price >= 10000) return `₹${(price / 1000).toFixed(0)}K`;
//     return `₹${price.toLocaleString()}`;
//   };
 
//   const resetFilters = () => {
//     setFilters({
//       category: "All Categories",
//       priceRange: [0, 100000],
//       rating: 0,
//       dateRange: "30d",
//       showTrendingOnly: false,
//       sortBy: "sales_desc"
//     });
//     setAppliedFilters([]);
//   };
 
//   const applyFilters = () => {
//     const applied: string[] = [];
 
//     if (filters.category !== "All Categories") applied.push(`Category: ${filters.category}`);
//     if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000)
//       applied.push(`Price: ${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`);
//     if (filters.rating > 0) applied.push(`Rating: ${filters.rating}+ stars`);
//     if (filters.showTrendingOnly) applied.push("Trending Only");
 
//     setAppliedFilters(applied);
//   };
 
//   const removeFilter = (filterToRemove: string) => {
//     setAppliedFilters(prev => prev.filter(f => f !== filterToRemove));
 
//     if (filterToRemove.startsWith("Category:")) updateFilter("category", "All Categories");
//     else if (filterToRemove.startsWith("Price:")) updateFilter("priceRange", [0, 100000]);
//     else if (filterToRemove.startsWith("Rating:")) updateFilter("rating", 0);
//     else if (filterToRemove === "Trending Only") updateFilter("showTrendingOnly", false);
//   };
 
//   return (
//     <Card className="bg-card rounded-lg border mb-6" data-testid="filters-panel">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="flex items-center">
//           <Filter className="h-5 w-5 mr-2" />
//           Filters & Settings
//         </CardTitle>
//         <Button variant="outline" size="sm" onClick={resetFilters} data-testid="button-reset-filters">
//           <RotateCcw className="h-4 w-4 mr-2" /> Reset
//         </Button>
//       </CardHeader>
 
//       <CardContent className="space-y-6">
//         {/* Applied Filters */}
//         {appliedFilters.length > 0 && (
//           <div>
//             <Label className="text-sm font-medium mb-2 block">Applied Filters</Label>
//             <div className="flex flex-wrap gap-2">
//               {appliedFilters.map((filter, index) => (
//                 <Badge
//                   key={index}
//                   variant="secondary"
//                   className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
//                   onClick={() => removeFilter(filter)}
//                 >
//                   {filter} <X className="h-3 w-3 ml-1" />
//                 </Badge>
//               ))}
//             </div>
//             <Separator className="mt-4" />
//           </div>
//         )}
 
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
//           {/* Category */}
//           <div className="space-y-2">
//             <Label htmlFor="category">Category</Label>
//             <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {CATEGORIES.map((c) => (
//                   <SelectItem key={c} value={c}>{c}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
 
//           {/* Price Range */}
//           <div className="space-y-2">
//             <Label>Price Range</Label>
//             <div className="px-2">
//               <Slider
//                 value={filters.priceRange}
//                 onValueChange={(v) => updateFilter("priceRange", v as [number, number])}
//                 min={0}
//                 max={100000}
//                 step={1000}
//                 className="w-full"
//               />
//               <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                 <span>{formatPrice(filters.priceRange[0])}</span>
//                 <span>{formatPrice(filters.priceRange[1])}</span>
//               </div>
//             </div>
//           </div>
 
//           {/* Rating */}
//           <div className="space-y-2">
//             <Label>Minimum Rating</Label>
//             <Select value={filters.rating.toString()} onValueChange={(v) => updateFilter("rating", parseFloat(v))}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="All Ratings" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="0">All Ratings</SelectItem>
//                 <SelectItem value="1">1+ Stars</SelectItem>
//                 <SelectItem value="2">2+ Stars</SelectItem>
//                 <SelectItem value="3">3+ Stars</SelectItem>
//                 <SelectItem value="4">4+ Stars</SelectItem>
//                 <SelectItem value="4.5">4.5+ Stars</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
 
//           {/* Date Range */}
//           <div className="space-y-2">
//             <Label>Date Range</Label>
//             <Select value={filters.dateRange} onValueChange={(v) => updateFilter("dateRange", v)}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select date range" />
//               </SelectTrigger>
//               <SelectContent>
//                 {DATE_RANGES.map((range) => (
//                   <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
 
//           {/* Sort By */}
//           <div className="space-y-2">
//             <Label>Sort By</Label>
//             <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 {SORT_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
 
//         {/* Advanced Options */}
//         <Separator />
//         <div className="space-y-4">
//           <Label className="text-sm font-medium">Advanced Options</Label>
//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <Label className="text-sm">Show Trending Products Only</Label>
//               <p className="text-xs text-muted-foreground">
//                 Filter to display only products that are currently trending
//               </p>
//             </div>
//             <Switch
//               checked={filters.showTrendingOnly}
//               onCheckedChange={(checked) => updateFilter("showTrendingOnly", checked)}
//             />
//           </div>
//         </div>
 
//         {/* Apply & Clear Buttons */}
//         <div className="flex gap-2 pt-4">
//           <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
//           <Button variant="outline" onClick={resetFilters}>Clear All</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
 
 
 