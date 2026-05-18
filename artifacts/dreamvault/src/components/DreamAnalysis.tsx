import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function DreamAnalysis() {
  const [dream, setDream] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  const generateMockAnalysis = (text: string) => {
    // Simple deterministic mock: extract words and emotions
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const themes = new Set<string>();
    if (words.some((w) => ["water", "sea", "ocean"].includes(w))) themes.add("Water / Emotions");
    if (words.some((w) => ["fire", "burn", "flame"].includes(w))) themes.add("Transformation / Anger");
    if (words.some((w) => ["bird", "fly", "sky"].includes(w))) themes.add("Freedom / Aspiration");
    if (words.some((w) => ["dark", "shadow", "monster"].includes(w))) themes.add("Fear / Unknown");

    const emotion = themes.size ? Array.from(themes).slice(0, 2).join(", ") : "Calm / Neutral";

    return `Summary: A dream about ${words.slice(0,6).join(" ")}${words.length>6?"...":""}.\nIdentified themes: ${emotion}.\nAdvice: Reflect on what these symbols mean to you; try journaling and returning to the scene with curiosity.`;
  };

  const handleAnalyze = async () => {
    setError(null);
    setAnalysis(null);
    setLoading(true);

    try {
      // animated delay to feel premium
      await new Promise((r) => setTimeout(r, 900));

      const result = generateMockAnalysis(dream);
      setAnalysis(result);

      // try save to Supabase (best-effort)
      if (isSupabaseConfigured && supabase) {
        const { error: insertErr } = await supabase.from("dreams").insert({
          dream_text: dream,
          analysis: result,
          created_at: new Date().toISOString(),
        });

        if (insertErr) {
          // fallback to localStorage
          console.warn("Supabase insert failed:", insertErr.message);
          const history = JSON.parse(localStorage.getItem("dream_history" ) || "[]");
          history.unshift({ dream, analysis: result, created_at: new Date().toISOString() });
          localStorage.setItem("dream_history", JSON.stringify(history));
        } else {
          // invalidate queries if any
          qc.invalidateQueries({ queryKey: ["dream_history"] });
        }
      } else {
        const history = JSON.parse(localStorage.getItem("dream_history" ) || "[]");
        history.unshift({ dream, analysis: result, created_at: new Date().toISOString() });
        localStorage.setItem("dream_history", JSON.stringify(history));
      }
    } catch (e: any) {
      setError(e?.message ?? "Erro ao analisar sonho");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 glass rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">AI Dream Analysis</h2>

      <textarea
        className="w-full p-4 rounded-lg bg-black/30 text-sm min-h-[120px]"
        placeholder="Describe your dream in as much detail as you can..."
        value={dream}
        onChange={(e) => setDream(e.target.value)}
      />

      <div className="flex gap-3 mt-4">
        <button
          className="px-5 py-3 rounded-xl bg-primary/80 hover:bg-primary"
          disabled={loading || !dream.trim()}
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing…" : "Analyze Dream"}
        </button>
        <button
          className="px-5 py-3 rounded-xl bg-muted-foreground/10"
          onClick={() => { setDream(""); setAnalysis(null); setError(null); }}
        >
          Clear
        </button>
      </div>

      <div className="mt-6">
        {error && <div className="text-red-400">{error}</div>}
        {analysis && (
          <div className="mt-3 p-4 rounded-lg bg-black/20">
            <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
