 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
 // Model groups by function
 const MODEL_GROUPS: Record<string, string[]> = {
   chat: [
     "z-ai/glm-4.5-air:free",
     "mistralai/mistral-small-3.1-24b-instruct:free"
   ],
   prompt: [
     "meta-llama/llama-4-scout:free",
     "nvidia/llama-3.1-nemotron-nano-8b-v1:free"
   ],
   ideas: [
     "moonshotai/kimi-vl-a3b-thinking:free",
     "mistralai/mixtral-8x7b-instruct:free"
   ],
   character: [
     "z-ai/glm-4.5-air:free",
     "mistralai/mistral-small-3.1-24b-instruct:free"
   ]
 };
 
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
           "X-Title": "KAIZEN PROMPTS CMS"
         },
         body: JSON.stringify({
           model,
           messages,
           max_tokens: 2000,
           temperature: 0.7
         })
       });
 
       if (!response.ok) {
         const errorText = await response.text();
         console.error(`Model ${model} failed:`, response.status, errorText);
         continue;
       }
 
       const data = await response.json();
       const content = data.choices?.[0]?.message?.content;
       
       if (content) {
         console.log(`Model ${model} succeeded, response length: ${content.length}`);
         return content;
       }
     } catch (error) {
       console.error(`Model ${model} error:`, error);
       continue;
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
 
     const { type, message, systemPrompt } = await req.json();
     console.log('OpenRouter AI request:', { type, messagePreview: message?.substring(0, 100) });
 
     if (!message) {
       throw new Error('Message is required');
     }
 
     const models = MODEL_GROUPS[type] || MODEL_GROUPS.chat;
     
     const messages = [
       ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
       { role: 'user', content: message }
     ];
 
     const reply = await tryModels(models, messages, OPENROUTER_API_KEY);
 
     return new Response(JSON.stringify({ reply, success: true }), {
       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
     });
 
   } catch (error) {
     console.error('OpenRouter AI error:', error);
     return new Response(JSON.stringify({ 
       error: error instanceof Error ? error.message : 'AI offline',
       success: false
     }), {
       status: 500,
       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
     });
   }
 });