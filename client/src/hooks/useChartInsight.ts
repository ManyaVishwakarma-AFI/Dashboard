import { useState, useEffect } from "react";

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[];
}

export function useChartInsight(chartType: string, chartData: ChartData) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const prompt = `
You are an AI analyst. Here is a chart of type ${chartType}:
${JSON.stringify(chartData, null, 2)}

Provide a short, human-readable summary and key insights about this chart.
        `;
        const res = await fetch("/ai/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: prompt,
            source: "products",
            limit: 50
          }),
        });
        const data = await res.json();
        setInsight(data.answer || "No insight generated.");
      } catch (error) {
        console.error("Error fetching AI insight:", error);
        setInsight("Failed to generate insight.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [chartType, chartData]);

  return { insight, loading };
}
