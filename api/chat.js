// /api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  const systemPrompt = {
    role: "system",
    content:
      "Kamu adalah guru bahasa Jepang yang hanya menjawab seputar belajar bahasa Jepang. Tolak semua pertanyaan di luar topik tersebut."
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://six-lyart.vercel.app"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [systemPrompt, ...messages],
        temperature: 0.7
      })
    });

    const result = await response.json();

    console.log("DEBUG result:", JSON.stringify(result));

    if (!response.ok || !result.choices || !result.choices[0]) {
      return res.status(500).json({ error: "Gagal menerima respons dari AI." });
    }

    res.status(200).json({ reply: result.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
}
