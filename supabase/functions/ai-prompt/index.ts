import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// 🎯 Modelos por tipo de ação (com fallback)
const MODEL_GROUPS: Record<string, string[]> = {
  generate: [
    "meta-llama/llama-4-scout:free",
    "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
    "z-ai/glm-4.5-air:free"
  ],
  improve: [
    "meta-llama/llama-4-scout:free",
    "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
    "z-ai/glm-4.5-air:free"
  ],
  chat: [
    "z-ai/glm-4.5-air:free",
    "mistralai/mistral-small-3.1-24b-instruct:free"
  ]
};

// 🔁 Função de tentativa com fallback
async function tryModels(
  models: string[],
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kaizenprompts.lovable.app",
          "X-Title": "KAIZEN PROMPTS"
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} failed:`, response.status, errorText);
        continue; // Tenta próximo modelo
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        console.log(`✅ Model ${model} succeeded, response length: ${content.length}`);
        return content;
      }
    } catch (error) {
      console.error(`❌ Model ${model} error:`, error);
      continue; // Tenta próximo modelo
    }
  }

  throw new Error("All models failed to respond");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const { action, prompt, messages, context } = await req.json();
    console.log('AI Prompt request:', { action, prompt: prompt?.substring(0, 100) });

    let systemPrompt = '';
    let userMessage = '';

    switch (action) {
      case 'generate':
        systemPrompt = `Você é um especialista em criar prompts para geração de imagens com IA. 
Crie prompts detalhados, profissionais e em inglês baseados na descrição do usuário.
O prompt deve incluir: estilo artístico, iluminação, ângulo de câmera, detalhes técnicos, qualidade.
Responda APENAS com o prompt gerado, sem explicações adicionais.`;
        userMessage = `Crie um prompt de imagem IA baseado nesta descrição: ${prompt}`;
        break;

      case 'improve':
        systemPrompt = `Você é um especialista em otimizar prompts para geração de imagens com IA.
Melhore o prompt fornecido adicionando mais detalhes, técnicas de iluminação, estilos artísticos e qualidade.
Mantenha a essência original mas torne-o mais profissional e detalhado.
Responda APENAS com o prompt melhorado em inglês, sem explicações.`;
        userMessage = `Melhore este prompt: ${prompt}`;
        break;

      case 'chat':
        systemPrompt = `Você é o KAIZEN, um assistente especializado em criar prompts para geração de imagens com IA.
Você ajuda usuários a:
- Criar prompts personalizados para diferentes estilos
- Explicar técnicas de prompt engineering
- Sugerir melhorias em prompts existentes
- Dar dicas sobre iluminação, composição e estilos artísticos

Seja amigável, profissional e responda em português.
Contexto do usuário: ${context || 'Nenhum contexto adicional'}`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const requestMessages = action === 'chat'
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

    // 🔁 Usa sistema de fallback
    const models = MODEL_GROUPS[action] || MODEL_GROUPS.chat;
    const content = await tryModels(models, requestMessages, OPENROUTER_API_KEY);

    console.log('AI response received, length:', content?.length);

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Prompt error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
