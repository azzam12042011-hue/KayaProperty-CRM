export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  let prompt;
  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    prompt = b?.prompt;
  } catch { return res.status(400).json({ error: "Bad request" }); }
  
  if (!prompt) return res.status(400).json({ error: "No prompt" });
  
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "API key tidak ada di Vercel" });

  // Coba 3 model berbeda sebagai fallback
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
  
  for (const model of models) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 1500 }
          })
        }
      );
      const data = await r.json();
      if (!r.ok) { console.log(`Model ${model} gagal:`, data?.error?.message); continue; }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return res.status(200).json({ text });
    } catch (e) { console.log(`Model ${model} error:`, e.message); }
  }
  
  return res.status(500).json({ error: "Semua model Gemini gagal. Cek API key di Vercel." });
}