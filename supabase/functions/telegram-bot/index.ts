import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { IMAGE_AGENTS, VIDEO_AGENTS } from "../ai-prompt/agents.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');

async function tryGroq(messages: any[]): Promise<string> {
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not set");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7
        })
    });
    if (!response.ok) throw new Error(`Groq error: ${response.statusText}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

async function tryGemini(messages: any[]): Promise<string> {
    if (!GOOGLE_GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY not set");
    const system = messages.find(m => m.role === 'system')?.content || "";
    const user = messages.find(m => m.role === 'user')?.content || "";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${system}\n\nUser: ${user}` }] }]
        })
    });
    if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function tryOpenRouter(messages: any[]): Promise<string> {
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not set");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash:free",
            messages,
            temperature: 0.7
        })
    });
    if (!response.ok) throw new Error(`OpenRouter error: ${response.statusText}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}

async function callAI(messages: any[]): Promise<string> {
    try {
        console.log("Trying Groq...");
        return await tryGroq(messages);
    } catch (e: any) {
        console.error("Groq failed:", e.message);
        try {
            console.log("Trying Gemini...");
            return await tryGemini(messages);
        } catch (e2: any) {
            console.error("Gemini failed:", e2.message);
            try {
                console.log("Trying OpenRouter...");
                return await tryOpenRouter(messages);
            } catch (e3: any) {
                console.error("OpenRouter failed:", e3.message);
                throw new Error("All AI providers failed.");
            }
        }
    }
}

async function sendTelegramMessage(chatId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        })
    });
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });

    try {
        if (!TELEGRAM_BOT_TOKEN || !OPENROUTER_API_KEY) {
            throw new Error("Tokens do Telegram ou OpenRouter não configurados no Supabase.");
        }

        const update = await req.json();
        console.log('Update received:', JSON.stringify(update));
        const message = update.message;

        if (!message || !message.text) {
            console.log('No message text found');
            return new Response("No message", { status: 200 }); // Retorna 200 pro Telegram não tentar de novo
        }

        const chatId = message.chat.id;
        const text = message.text.trim();
        console.log(`Message from ${chatId}: ${text}`);

        let systemPrompt = "";
        let userMessage = "";
        let isProcessing = false;

        if (text.startsWith('/imagem')) {
            isProcessing = true;
            const userPrompt = text.replace('/imagem', '').trim();
            systemPrompt = `Você é o KAIZEN_OMNI_HUB_V31 especializado em criação visual ULTRA-REALISTA.\n${IMAGE_AGENTS}\nGere APENAS o prompt em texto bruto e markdown sem texto conversacional.`;
            userMessage = `Crie o prompt de imagem para: ${userPrompt || 'Surpreenda-me'}`;
        } else if (text.startsWith('/video')) {
            isProcessing = true;
            const userPrompt = text.replace('/video', '').trim();
            systemPrompt = `Você é o KAIZEN_MASTER_ULTIMATE_OS focado em VÍDEOS.\n${VIDEO_AGENTS}\nGere APENAS as sequências/scripts de movimento, sem texto conversacional.`;
            userMessage = `Crie o script de vídeo para: ${userPrompt || 'Surpreenda-me com algo dinâmico'}`;
        } else if (text === '/start' || text === '/ajuda') {
            await sendTelegramMessage(chatId, "👋 **Bem-vindo ao Kaizen Bot!**\n\nSou a sua central direta para chamar os Agentes.\n\nComandos:\n📸 `/imagem [sua ideia]` - Aciona o cluster de imagem\n🎬 `/video [sua ideia]` - Aciona o cluster de vídeo\n\nExperimente enviar: `/imagem Mulher tomando café na varanda`");
            return new Response("OK", { status: 200 });
        } else {
            await sendTelegramMessage(chatId, "⚠️ Comando não reconhecido. Use `/imagem` ou `/video` antes do seu texto!");
            return new Response("OK", { status: 200 });
        }

        if (isProcessing) {
            console.log('Processing prompt with AI...');
            // Mandar uma mensagem "Digitando..." ou "Processando..."
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, action: 'typing' })
            });

            try {
                // Roda a IA
                const generatedPrompt = await callAI([
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ]);

                console.log('AI Response generated');
                // Devolve para o usuário
                await sendTelegramMessage(chatId, generatedPrompt);
            } catch (aiError: any) {
                console.error('AI Error:', aiError);
                await sendTelegramMessage(chatId, `❌ Erro na IA: ${aiError.message}`);
            }
        }

        return new Response("OK", { status: 200 });

    } catch (error: any) {
        console.error('Erro no Bot do Telegram:', error);
        // Tenta avisar o usuário do erro fatal se possível
        try {
            // Clone the request to safely read its body again for error reporting
            const clonedReq = req.clone();
            const update = await clonedReq.json();
            if (update?.message?.chat?.id) {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: update.message.chat.id,
                        text: `🔥 Erro Fatal: ${error.message}`
                    })
                });
            }
        } catch (e) {
            console.error('Failed to send error message to user:', e);
        }
        return new Response(JSON.stringify({ error: error.message }), { status: 200 }); // Retorna 200 para evitar loops
    }
});
