// ============================================
// FILE 1: src/hooks/useAISummary.ts (UPDATED FOR OLLAMA)
// ============================================
import { useEffect, useState } from "react";

export function useAISummary(question: string, source: string, data: any[], limit: number) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!data || data.length === 0) {
      setSummary("");
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const prompt = `Analyze this ${source} data and provide 2-3 key actionable insights in brief bullet points (maximum 2 lines total):\n\nData: ${JSON.stringify(
          data.slice(0, 10)
        )}\n\nQuestion: ${question}`;

        const res = await fetch("http://localhost:8000/ai/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt, source, limit }),
        });

        const json = await res.json();
        setSummary(json.answer || "");
      } catch (err) {
        console.error("AI summary error:", err);
        setSummary("Unable to generate summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [question, source, data, limit]);

  return { summary, loading };
}