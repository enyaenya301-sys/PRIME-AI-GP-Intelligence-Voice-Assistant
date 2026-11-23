
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "AI connection is not configured yet."
    });
  }

  try {
    const { message } = req.body || {};

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
            "You are PRIME AI, the intelligent personal assistant created by GP Intelligence. Be professional, helpful, respectful and clear. Your voice and personality are serious, calm and confident.",
          input: message
        })
      }
    );

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        error: data.error?.message || "AI service error."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I could not generate a response."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong connecting to PRIME AI."
    });
  }
};
  
