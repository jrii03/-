export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  const systemPrompt = {
    role: "system",
    content: "Kamu adalah asisten AI yang hanya menjawab pertanyaan tentang pembelajaran bahasa Jepang. Jika pengguna bertanya tentang hal di luar topik itu, balas dengan 'Maaf, saya hanya menjawab pertanyaan seputar bahasa Jepang.'"
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [systemPrompt, ...messages],
        temperature: 0.7
      })
    });

    const result = await response.json();

    // Debugging (jika perlu lihat log di Vercel)
    // console.log("Response JSON:", result);

    if (!response.ok || !result.choices || !result.choices[0]) {
      return res.status(500).json({ error: "Gagal menerima respons dari AI." });
    }

    const reply = result.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghubungi AI." });
  }
}
