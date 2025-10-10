// ============================================
// FILE 2: src/components/ai/ai-summary-display.tsx (CREATE THIS)
// ============================================
import { useAISummary } from "@/hooks/useAISummary";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AISummaryDisplayProps {
  chartData: any[];
  chartType: string;
  source?: string;
}

export function AISummaryDisplay({ 
  chartData, 
  chartType, 
  source = "amazon_reviews" 
}: AISummaryDisplayProps) {
  const { summary, loading } = useAISummary(
    `Analyze this ${chartType} chart and provide 2-3 key actionable insights in brief bullet points (maximum 2 lines total).`,
    source,
    chartData,
    50
  );

  if (loading) {
    return (
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200">
      <div className="flex items-start space-x-2">
        <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
            AI Insights
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}