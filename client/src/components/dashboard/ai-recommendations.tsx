import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, RefreshCw, Target, TrendingUp } from "lucide-react";

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function RecommendationCard({ icon, title, description, gradient }: RecommendationCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-4 text-white`}>
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="font-semibold ml-2">{title}</h4>
      </div>
      <p className="text-sm text-white/90">{description}</p>
    </div>
  );
}

interface AIRecommendationsProps {}

export default function AIRecommendations({}: AIRecommendationsProps) {
  const [summary, setSummary] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [table, setTable] = useState<"both" | "products" | "amazon_reviews">("both");

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      // Set table-specific prompts
      const prompts: Record<string, string> = {
        products: `Provide a concise summary and 2 actionable recommendations for the Products table based on sales, ratings, and price trends. Format the first line as summary and next two lines as separate recommendations.`,
        amazon_reviews: `Provide a concise summary and 2 actionable recommendations for the Amazon_Reviews table based on review content, ratings, and helpful votes. Format the first line as summary and next two lines as separate recommendations.`,
      };

      const sources = table === "both" ? ["products", "amazon_reviews"] : [table];

      const aiAnswers = await Promise.all(
        sources.map(async (source) => {
          const res = await fetch("http://localhost:8000/ai/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompts[source], source, limit: 5 }),
          });
          const json = await res.json();
          return json.answer || "";
        })
      );

      const allText = aiAnswers.filter(Boolean).join("\n");
      const lines = allText.split("\n").filter((line: string) => line.trim() !== "");

      setSummary(lines[0] || "");
      setRecommendations(lines.slice(1, 3)); // Only 2 actionable recommendations
    } catch (err) {
      console.error("AI recommendation error:", err);
      setSummary("Unable to generate summary.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();
  }, [table]);

  const cardStyles = [
    { icon: <Target className="h-5 w-5" />, gradient: "from-green-500 to-emerald-600", title: "Top Opportunity" },
    { icon: <TrendingUp className="h-5 w-5" />, gradient: "from-blue-500 to-cyan-600", title: "Price Optimization" },
  ];

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border">
      <CardHeader className="flex flex-row items-center justify-between mb-4 p-0">
        <div className="flex items-center">
          <div className="p-3 bg-primary rounded-xl mr-4">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalized insights based on selected table
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="ai-badge">
            AI Powered
          </Badge>

          {/* Table Dropdown */}
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-transparent"
            value={table}
            onChange={(e) => setTable(e.target.value as any)}
          >
            <option value="both">Both Tables</option>
            <option value="products">Products Only</option>
            <option value="amazon_reviews">Amazon Reviews Only</option>
          </select>

          <Button variant="ghost" size="sm" onClick={fetchAIRecommendations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Summary */}
        <div className="mb-6 p-4 bg-white/70 dark:bg-black/20 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
            Business Health Summary
          </h3>
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p className="text-sm text-muted-foreground">{summary}</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white/70 rounded-lg p-4">
                  <Skeleton className="h-5 w-5 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            : recommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  icon={cardStyles[index]?.icon || <Target className="h-5 w-5" />}
                  title={cardStyles[index]?.title || `Recommendation ${index + 1}`}
                  description={rec}
                  gradient={cardStyles[index]?.gradient || "from-gray-400 to-gray-500"}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );
}
