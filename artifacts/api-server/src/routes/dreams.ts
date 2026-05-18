import { Router } from "express";

const router = Router();

router.post("/dreams", async (req, res) => {
  const { dream_text, analysis, user_id, category } = req.body ?? {};

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
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
