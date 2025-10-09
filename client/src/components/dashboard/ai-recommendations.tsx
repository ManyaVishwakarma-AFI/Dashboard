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
  Lightbulb, 
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AIRecommendationsProps {
  userLocation: string;
}

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  gradient: string;
}

interface OllamaRecommendationResponse {
  answer: string; // AI output text
}

function RecommendationCard({ icon, title, description, action, gradient }: RecommendationCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-4 text-white`}>
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="font-semibold ml-2">{title}</h4>
      </div>
      <p className="text-sm mb-2 text-white/90">{description}</p>
      {action && (
        <p className="text-xs font-medium text-white/95 bg-white/20 px-2 py-1 rounded">
          {action}
        </p>
      )}
    </div>
  );
}

export default function AIRecommendations({ userLocation }: AIRecommendationsProps) {
  const { data: recommendations, isLoading, refetch } = useQuery<OllamaRecommendationResponse>({
    queryKey: ["/ai/query", userLocation],
    queryFn: async () => {
      const response = await apiRequest("POST", "/ai/query", {
        question: `Provide business insights and recommendations for the ${userLocation} market.`,
        source: "products",
        limit: 50
      });
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Parse AI text response into array of recommendations
  const recsArray = recommendations?.answer
    ? recommendations.answer.split("\n").filter(line => line.trim() !== "")
    : [
        "Check top-selling products",
        "Optimize pricing strategy",
        "Consider geographic expansion"
      ];

  const defaultCards = [
    { icon: <Target className="h-5 w-5" />, title: "Top Opportunity", gradient: "from-green-500 to-emerald-600" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "Price Optimization", gradient: "from-blue-500 to-cyan-600" },
    { icon: <MapPin className="h-5 w-5" />, title: "Geographic Expansion", gradient: "from-purple-500 to-violet-600" },
  ];

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border">
      <CardHeader className="flex flex-row items-center justify-between mb-4 p-0">
        <div className="flex items-center">
          <div className="p-3 bg-primary rounded-xl mr-4">
            <Bot className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              AI Recommendations for You
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Personalized insights based on {userLocation} market trends
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">AI Powered</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            data-testid="button-refresh-recommendations"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            : recsArray.slice(0, 3).map((rec, index) => (
                <RecommendationCard
                  key={index}
                  icon={defaultCards[index].icon}
                  title={defaultCards[index].title}
                  description={rec}
                  gradient={defaultCards[index].gradient}
                />
              ))
          }
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/20">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Schedule Consultation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
