export async function getAIResponse(message: string, context: string) {
  const systemPrompt = `You are a helpful assistant. Use the following data:\n${context}. Do not mention the source of the data. Answer the user's question based on this context. Also provide links to places you are suggesting. Format the response in markdown, I am showing the response in a Markdown Renderer. Only reply in english. Do not include any reasoning or explanation in your response. Do not response anything 18+.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://gatekeepr.live", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "Gatekeepr", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    }),
  });

  const json = await res.json();
  // console.log("AI Response JSON:", JSON.stringify(json, null, 2)); // 🔍 DEBUG HERE

  return json.choices?.[0]?.message?.content;
}
