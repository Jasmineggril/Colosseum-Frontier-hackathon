#!/usr/bin/env node

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const samples = [
  { dream_text: "I was flying over a neon galaxy while constellations whispered my name.", category: "Cosmic" },
  { dream_text: "A dark corridor kept changing shape and shadows followed me like smoke.", category: "Horror" },
  { dream_text: "I walked through an emerald forest where water floated upward into the sky.", category: "Fantasy" },
  { dream_text: "I was inside a glass AI core, translating my thoughts into light.", category: "Sci-Fi" },
  { dream_text: "A hallway of mirrors opened impossible doors inside my mind.", category: "Abstract" },
  { dream_text: "Ancient gods descended from golden temples to bless the storm.", category: "Mythological" },
];

async function seed() {
  console.log(`Seeding dreams via ${BASE_URL}/api/dreams ...`);

  for (const item of samples) {
    const resp = await fetch(`${BASE_URL}/api/dreams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error("Failed:", item.category, text);
      continue;
    }

    console.log("Seeded:", item.category, text.slice(0, 180));
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
