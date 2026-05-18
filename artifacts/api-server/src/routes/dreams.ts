import { Router } from "express";

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
    let analysis = clientAnalysis ?? null;
    const openaiKey = process.env["OPENAI_API_KEY"] || process.env["OPENAI_KEY"];

    if (!analysis && openaiKey) {
      try {
        const prompt = `You are an expert dream analyst. Given the user's dream text, produce a concise analysis (3-6 sentences), list themes as a JSON array, and give short advice. Respond as JSON with keys: analysis (string), themes (array of strings), advice (string).\n\nDream:\n${dream_text}`;

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
          const j = await oa.json();
          const text = j.choices?.[0]?.message?.content ?? null;
          // try parse JSON
          try {
            const parsed = JSON.parse(text);
            analysis = parsed;
          } catch {
            // fallback to raw text
            analysis = { text };
          }
        }
      } catch (e) {
        console.warn("OpenAI call failed", e);
      }
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
          analysis: analysis ?? null,
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
