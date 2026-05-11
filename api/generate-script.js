export const config = {
  runtime: 'edge',
};

// Helper function untuk delay (compatible dengan Edge Runtime)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  let prompt;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    prompt = body?.prompt;
  } catch (error) {
    console.error("Parse error:", error.message);
    return res.status(400).json({ error: "Bad request: Invalid JSON" });
  }
  
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "No prompt provided" });
  }
  
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "API key tidak ada di Vercel" });
  }

  // Model dengan prioritas dan fallback
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
  const lastError = [];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const maxRetries = 2;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Tambahkan delay exponential backoff untuk retry
        if (attempt > 0) {
          await delay(Math.pow(2, attempt) * 1000);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "User-Agent": "Kaya-Property-CRM/1.0"
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { 
                temperature: 0.7,
                maxOutputTokens: 2000,
                topP: 0.8,
                topK: 40
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            }),
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        // Handle API errors
        if (!response.ok) {
          const errorMsg = data?.error?.message || `HTTP ${response.status}`;
          console.log(`Model ${model} (attempt ${attempt + 1}) failed:`, errorMsg);
          lastError.push(`${model}: ${errorMsg}`);
          
          // Jangan retry untuk error tertentu
          if (response.status === 400 || response.status === 403) {
            break;
          }
          continue;
        }
        
        // Validate response structure
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text || text.trim().length === 0) {
          console.log(`Model ${model} returned empty response`);
          lastError.push(`${model}: Empty response`);
          continue;
        }
        
        // Success!
        return res.status(200).json({ 
          text,
          model,
          usage: {
            candidates: data.candidates?.length || 0
          }
        });
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(`Model ${model} timeout after 25s`);
          lastError.push(`${model}: Timeout`);
        } else {
          console.log(`Model ${model} (attempt ${attempt + 1}) error:`, error.message);
          lastError.push(`${model}: ${error.message}`);
        }
        
        // Continue to next retry or next model
        if (attempt < maxRetries - 1) {
          continue;
        }
      }
    }
  }
  
  // All models failed
  console.error("All models failed:", lastError);
  return res.status(500).json({ 
    error: "Semua model Gemini gagal. Cek API key di Vercel.",
    details: lastError.length > 0 ? lastError : "Unknown error"
  });
}