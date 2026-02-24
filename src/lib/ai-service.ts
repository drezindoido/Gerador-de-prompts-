// src/lib/ai-service.ts

const API_KEYS = {
  GEMINI: import.meta.env.VITE_GEMINI_API_KEY || "",
  GROQ: import.meta.env.VITE_GROQ_API_KEY || "",
  OPENROUTER: import.meta.env.VITE_OPENROUTER_API_KEY || ""
};

/**
 * Usa o DeepSeek via OpenRouter para gerar legendas e histórias
 */
export const generateStory = async (sceneDescription: string) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEYS.OPENROUTER}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content: "Você é um narrador de lifestyle. Crie legendas curtas, reais e envolventes para redes sociais em português Brasil. Sem hashtags exageradas."
          },
          {
            role: "user",
            content: `Crie uma legenda de influenciadora para esta situação: ${sceneDescription}`
          }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro na API:", error);
    return "Um dia incrível por aqui! ✨";
  }
};

/**
 * Construtor de Prompt Mestre (Une Personagem + Luz + Expressão + Famoso)
 */
export const buildFinalImagePrompt = (
  name: string,
  details: string,
  location: string,
  outfit: string,
  lighting: string,
  expression: string,
  celebrity?: string
) => {
  const celebAction = celebrity ? `interacting and taking a selfie with ${celebrity},` : "standing";

  return `
    RAW photo, ultra-photorealistic, 8k, high fidelity.
    Subject: ${name}, ${details}.
    Action: ${celebAction} in ${location}.
    Outfit: ${outfit}.
    Expression: ${expression}.
    Lighting: ${lighting}.
    Technical: Front-camera smartphone selfie, natural skin texture, visible pores, no plastic skin, authentic lighting, sharp focus.
  `.trim();
};
