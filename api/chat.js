
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing in Vercel."
    });
  }

  try {
    let body = req.body || {};

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const message = body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const aiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions:
            "You are PRIME AI, created by GP Intelligence. You are a helpful, intelligent assistant. Answer questions clearly, accurately and naturally. Help with education, science, technology, business, mathematics and everyday conversations.",
          input: message
        })
      }
    );

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OpenAI error:", data);

      return res.status(aiResponse.status).json({
        error: data.error?.message || "OpenAI request failed."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I could not generate a response."
    });

  } catch (error) {
    console.error("PRIME AI server error:", error);

    return res.status(500).json({
      error: "Server error: " + error.message
    });
  }
};
