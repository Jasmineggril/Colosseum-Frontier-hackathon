import { Router } from "express";

type DreamAnalysis = {
  analysis: string;
  themes: string[];
  advice: string;
};

function buildFallbackAnalysis(dreamText: string): DreamAnalysis {
  const words = dreamText.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const themes = new Set<string>();

  if (words.some((w) => ["water", "sea", "ocean", "rain"].includes(w))) themes.add("Water / Emotion");
  if (words.some((w) => ["fire", "burn", "flame", "ash"].includes(w))) themes.add("Transformation / Intensity");
  if (words.some((w) => ["bird", "fly", "sky", "wind"].includes(w))) themes.add("Freedom / Aspiration");
  if (words.some((w) => ["dark", "shadow", "monster", "night"].includes(w))) themes.add("Fear / Unknown");
  if (words.some((w) => ["gold", "temple", "god", "altar"].includes(w))) themes.add("Myth / Sacred");

  const themeList = Array.from(themes);
  const summary = words.slice(0, 12).join(" ") || "a quiet, symbolic dream";

  return {
    analysis: `Your dream centers on ${summary}. The imagery suggests ${themeList.join(", ") || "a reflective, neutral state"}.`,
    themes: themeList,
    advice: "Write down the strongest symbol and revisit it tomorrow; the meaning usually sharpens with reflection.",
  };
}

function normalizeOpenAIResult(content: string | null): DreamAnalysis {
  if (!content) return buildFallbackAnalysis("");

  try {
    const parsed = JSON.parse(content) as Partial<DreamAnalysis> & Record<string, unknown>;
    const analysis = typeof parsed.analysis === "string" ? parsed.analysis : content;
    const themes = Array.isArray(parsed.themes) ? parsed.themes.filter((item): item is string => typeof item === "string") : [];
    const advice = typeof parsed.advice === "string" ? parsed.advice : "Reflect on the strongest symbols and emotions.";
    return { analysis, themes, advice };
  } catch {
    return {
      analysis: content,
      themes: [],
      advice: "Reflect on the strongest symbols and emotions.",
    };
  }
}

const router = Router();

router.post("/dreams", async (req, res) => {
  const { dream_text, analysis: clientAnalysis, user_id, category } = req.body ?? {};

  if (!dream_text || typeof dream_text !== "string") {
    res.status(400).json({ error: "dream_text is required" });
    return;
  }

  const supabaseUrl = process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"];

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Server not configured with Supabase service role key" });
    return;
  }

  try {
    // If server has an OpenAI key, generate analysis server-side for consistency
    let analysis: DreamAnalysis | string | null = clientAnalysis ?? null;
    const openaiKey = process.env["OPENAI_API_KEY"] || process.env["OPENAI_KEY"];

    if (!analysis && openaiKey) {
      try {
        const prompt = `You are an expert dream analyst. Given the user's dream text, produce a concise analysis (3-6 sentences), list themes as a JSON array, and give short advice. Respond only as JSON with keys: analysis (string), themes (array of strings), advice (string).\n\nDream:\n${dream_text}`;

        const oa = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
            max_tokens: 400,
            temperature: 0.8,
          }),
        });

        if (oa.ok) {
          const j = (await oa.json()) as any;
          const text = j.choices?.[0]?.message?.content ?? null;
          analysis = normalizeOpenAIResult(text);
        }
      } catch (e) {
        console.warn("OpenAI call failed", e);
      }
    }

    if (!analysis) {
      analysis = buildFallbackAnalysis(dream_text);
    }

    // Insert into Supabase via REST using service role key
    const resp = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/dreams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          dream_text,
          analysis,
          user_id: user_id ?? null,
          category: category ?? null,
          created_at: new Date().toISOString(),
        },
      ]),
    });

    if (!resp.ok) {
      const text = await resp.text();
      res.status(502).json({ error: "Supabase insert failed", detail: text });
      return;
    }

    const data = await resp.json();
    res.status(201).json({ data, analysis });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
