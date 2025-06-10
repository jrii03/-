// File: /api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://fajri03s-projects.vercel.app/", // Ganti domain sesuai kamu
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
      })
    });

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || "Maaf, saya tidak bisa menjawab sekarang.";
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
