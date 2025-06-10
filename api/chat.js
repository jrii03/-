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
        "HTTP-Referer": "https://six-lyart.vercel.app/"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
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
