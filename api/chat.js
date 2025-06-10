export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fajri03s-projects.vercel.app',
        'X-Title': 'AI Chatbot Bahasa Jepang'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          { role: "system", content: "Kamu adalah guru bahasa Jepang yang membantu pengguna memahami bahasa Jepang." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return res.status(500).json({ error: 'API error', details: data });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
