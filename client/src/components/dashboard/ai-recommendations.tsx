// ============================================
// FILE 2: src/components/ai/ai-recommendations.tsx
// ============================================
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Target, 
  TrendingUp, 
  MapPin, 
  RefreshCw,
  ExternalLink,
  Lightbulb,
  Sparkles
} from "lucide-react";

interface AIRecommendationsProps {
  userLocation: string;
}

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function RecommendationCard({ icon, title, description, gradient }: RecommendationCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="font-semibold ml-2 text-sm">{title}</h4>
      </div>
      <p className="text-sm text-white/90 leading-relaxed">{description}</p>
    </div>
  );
}

export default function AIRecommendations({ userLocation }: AIRecommendationsProps) {
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["/ai/recommendations", userLocation],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Based on ${userLocation} e-commerce market data, provide exactly 3 specific, actionable business recommendations. Format each as: [Title]: [Brief action in 10-15 words]. Focus on: 1) Product opportunities, 2) Pricing strategy, 3) Market expansion.`,
          source: "products",
          limit: 50,
        }),
      });
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Parse AI response into array
  const recsArray = recommendations?.answer
    ?.split(/\d+\.|\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 10)
    .slice(0, 3) || [
      "Focus on Electronics and Home categories - highest demand and profit margins",
      "Implement dynamic pricing - adjust prices based on competitor analysis and demand",
      "Expand to tier-2 cities - untapped market with growing online shopping trends",
    ];

  const defaultCards = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Top Opportunity",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Growth Strategy",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Market Expansion",
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center">
          <div className="p-3 bg-primary rounded-xl mr-3">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              AI Business Recommendations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalized insights for {userLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))
            : recsArray.slice(0, 3).map((rec: string, index: number) => (
                <RecommendationCard
                  key={index}
                  icon={defaultCards[index].icon}
                  title={defaultCards[index].title}
                  description={rec}
                  gradient={defaultCards[index].gradient}
                />
              ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Lightbulb className="h-4 w-4 mr-2" />
            Get More Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}