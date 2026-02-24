// src/lib/ai-service.ts
// Sistema de failover com auto-teste dinâmico de modelos
// A chave fica APENAS no .env.local (local) e no painel do Vercel (produção)

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

// ============================================================
// LISTA COMPLETA DE MODELOS GRATUITOS DO OPENROUTER
// O sistema testa todos e usa apenas os que respondem
// ============================================================
const ALL_MODELS = [
  // --- DeepSeek ---
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "deepseek/deepseek-r1-0528:free",
  "deepseek/deepseek-prover-v2:free",

  // --- Google Gemma ---
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-1b-it:free",
  "google/gemma-2-9b-it:free",

  // --- Meta Llama ---
  "meta-llama/llama-4-maverick:free",
  "meta-llama/llama-4-scout:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "meta-llama/llama-3-8b-instruct:free",

  // --- Mistral ---
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/mistral-7b-instruct-v0.3:free",
  "mistralai/devstral-small:free",

  // --- Qwen ---
  "qwen/qwen3-235b-a22b:free",
  "qwen/qwen3-30b-a3b:free",
  "qwen/qwen3-14b:free",
  "qwen/qwen3-8b:free",
  "qwen/qwen3-4b:free",
  "qwen/qwen2.5-vl-72b-instruct:free",
  "qwen/qwen2.5-72b-instruct:free",
  "qwen/qwen2.5-7b-instruct:free",
  "qwen/qwq-32b:free",

  // --- NVIDIA (incluindo multimodal VL) ---
  "nvidia/nemotron-nano-12b-v2-vl:free",    // ✅ Multimodal — suporta imagem + texto
  "nvidia/nemotron-nano-9b-v2:free",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",

  // --- Microsoft ---
  "microsoft/phi-4-reasoning-plus:free",
  "microsoft/phi-4-multimodal-instruct:free",
  "microsoft/phi-4:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "microsoft/phi-3-medium-128k-instruct:free",

  // --- Z.AI ---
  "z-ai/glm-4.5-air:free",
  "z-ai/glm-4-32b:free",

  // --- Arcee ---
  "arcee-ai/trinity-large-preview:free",
  "arcee-ai/caller:free",
  "arcee-ai/spotlight:free",

  // --- Moonshot ---
  "moonshotai/kimi-k2:free",
  "moonshotai/kimi-vl-a3b-thinking:free",

  // --- Others ---
  "stepfun/step-3.5-flash:free",
  "upstage/solar-pro-3:free",
  "openchat/openchat-7b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "nousresearch/hermes-3-llama-3.1-70b:free",
  "sophosympatheia/rogue-rose-103b-v0.2:free",
  "sao10k/l3.3-euryale-70b:free",
  "huggingfaceh4/zephyr-7b-beta:free",
  "gryphe/mythomist-7b:free",
  "undi95/toppy-m-7b:free",
];

// ============================================================
// GERENCIADOR DE MODELOS — Auto-teste dinâmico
// ============================================================

interface ModelHealth {
  model: string;
  working: boolean;
  latency: number; // ms (-1 = falhou)
  lastChecked: number; // timestamp
}

class ModelManager {
  public health: Map<string, ModelHealth> = new Map();
  private testInterval: ReturnType<typeof setInterval> | null = null;
  private initialized = false;
  private testing = false;

  constructor() {
    // Inicializa todos como não testados
    ALL_MODELS.forEach((model) => {
      this.health.set(model, {
        model,
        working: false,
        latency: -1,
        lastChecked: 0,
      });
    });
  }

  /** Testa um modelo e registra o resultado */
  async testModel(model: string): Promise<ModelHealth> {
    if (!OPENROUTER_KEY) {
      return { model, working: false, latency: -1, lastChecked: Date.now() };
    }

    const start = Date.now();
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kaizen-prompts.vercel.app",
          "X-Title": "Kaizen Prompts",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Reply with only the word: OK" }],
          max_tokens: 60, // Modelos com reasoning (Nemotron VL) precisam de mais tokens
        }),
        signal: AbortSignal.timeout(15000), // 15s para modelos VL/reasoning
      });

      const data = await response.json();
      const latency = Date.now() - start;
      // Aceita tanto content direto quanto conteúdo gerado após reasoning (Nemotron VL)
      const hasContent = !!(data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning);
      const working = hasContent && !data.error;

      const result = { model, working, latency: working ? latency : -1, lastChecked: Date.now() };
      this.health.set(model, result);
      return result;
    } catch {
      const result = { model, working: false, latency: -1, lastChecked: Date.now() };
      this.health.set(model, result);
      return result;
    }
  }

  /** Testa todos os modelos em paralelo (em lotes para não sobrecarregar) */
  async runFullTest() {
    if (this.testing || !OPENROUTER_KEY) return;
    this.testing = true;

    console.log("[AI Manager] 🔍 Iniciando teste de todos os modelos...");
    const BATCH_SIZE = 5;

    for (let i = 0; i < ALL_MODELS.length; i += BATCH_SIZE) {
      const batch = ALL_MODELS.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(batch.map((m) => this.testModel(m)));
    }

    const working = this.getWorkingModels();
    console.log(`[AI Manager] ✅ Teste completo: ${working.length}/${ALL_MODELS.length} modelos ativos`);
    working.forEach((m) =>
      console.log(`  ✅ ${m.model} (${m.latency}ms)`)
    );

    this.testing = false;
    this.initialized = true;
  }

  /** Retorna modelos funcionando, ordenados por latência (mais rápido primeiro) */
  getWorkingModels(): ModelHealth[] {
    return Array.from(this.health.values())
      .filter((h) => h.working && h.latency > 0)
      .sort((a, b) => a.latency - b.latency);
  }

  /** Retorna modelos prontos para uso (IDs apenas) */
  getBestModelIds(limit = 5): string[] {
    const working = this.getWorkingModels().slice(0, limit).map((m) => m.model);

    // Se ainda não testou nada, usa os confirmados como fallback inicial
    if (working.length === 0) {
      return [
        "arcee-ai/trinity-large-preview:free",
        "google/gemma-3-4b-it:free",
        "google/gemma-3-12b-it:free",
        "z-ai/glm-4.5-air:free",
        "mistralai/mistral-small-3.1-24b-instruct:free",
      ];
    }

    return working;
  }

  /** Inicia auto-teste periódico (a cada 10 minutos) */
  startAutoTest() {
    if (this.testInterval) return;

    // Primeiro teste imediato (sem bloquear)
    this.runFullTest();

    // Re-testa a cada 10 minutos
    this.testInterval = setInterval(() => {
      this.runFullTest();
    }, 10 * 60 * 1000);
  }

  isReady() {
    return this.initialized;
  }
}

// Instância global — começa a testar assim que o app carrega
export const modelManager = new ModelManager();
modelManager.startAutoTest();

// ============================================================
// FUNÇÃO CORE: Failover automático
// ============================================================

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callWithFailover(
  messages: Message[],
  preferredModels?: string[]
): Promise<string | null> {
  if (!OPENROUTER_KEY) {
    console.error("[AI] VITE_OPENROUTER_API_KEY não configurada!");
    return null;
  }

  // Usa modelos preferidos ou os melhores disponíveis
  const models = preferredModels || modelManager.getBestModelIds(6);

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kaizen-prompts.vercel.app",
          "X-Title": "Kaizen Prompts",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(12000),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();

      if (text && text.length > 3) {
        console.log(`[AI] ✅ Respondeu: ${model}`);
        return text;
      }

      // Se o modelo falhou, marca como indisponível
      if (data.error) {
        modelManager.health?.set?.(model, {
          model,
          working: false,
          latency: -1,
          lastChecked: Date.now(),
        });
      }
    } catch {
      console.warn(`[AI] ⏱️ Timeout: ${model}`);
    }
  }

  return null;
}

// ============================================================
// FUNÇÕES PÚBLICAS
// ============================================================

const KAIZEN_SYSTEM = `You are a professional AI image prompt engineer specializing in ultra-realistic photographic prompts. 
Always respond in technical English prompt engineering style. Be concise and precise.`;

/** Gera/melhora prompt de imagem usando o melhor modelo disponível */
export const generateImagePrompt = async (rawPrompt: string): Promise<string> => {
  const result = await callWithFailover([
    { role: "system", content: KAIZEN_SYSTEM },
    {
      role: "user",
      content: `Transform this into an ultra-realistic AI image prompt. Keep it under 200 words:\n\n${rawPrompt}`,
    },
  ]);
  return result || rawPrompt;
};

/** Gera legenda/história em português para redes sociais */
export const generateStory = async (description: string): Promise<string> => {
  const result = await callWithFailover([
    {
      role: "system",
      content:
        "Você é um criador de conteúdo especialista em Instagram Brasil. Crie legendas curtas e envolventes. Sem hashtags excessivas.",
    },
    { role: "user", content: description },
  ]);
  return result || "Conteúdo incrível! ✨";
};

/** Chat geral com o assistente Kaizen */
export const chatWithKaizen = async (
  messages: { role: string; content: string }[],
  systemPrompt?: string
): Promise<string> => {
  const fullMessages: Message[] = [
    {
      role: "system",
      content: systemPrompt || "Você é o assistente Kaizen, especializado em criação de conteúdo e prompts de IA.",
    },
    ...(messages as Message[]),
  ];

  const result = await callWithFailover(fullMessages);
  return result || "Todos os modelos estão temporariamente indisponíveis. Tente novamente em instantes.";
};

/** Construtor de prompt de imagem final */
export const buildFinalImagePrompt = (
  name: string,
  details: string,
  location: string,
  outfit: string,
  lighting: string,
  expression: string,
  celebrity?: string
): string => {
  const celebAction = celebrity ? `interacting and taking a selfie with ${celebrity},` : "standing";
  return `RAW photo, ultra-photorealistic, 8k, high fidelity. Subject: ${name}, ${details}. Action: ${celebAction} in ${location}. Outfit: ${outfit}. Expression: ${expression}. Lighting: ${lighting}. Technical: Front-camera smartphone selfie, natural skin texture, visible pores, authentic lighting, sharp focus.`.trim();
};
