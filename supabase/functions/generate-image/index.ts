import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { prompt } = await req.json();
    console.log('Image generation request:', { prompt: prompt?.substring(0, 100) });

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Call Lovable AI Gateway with image generation model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Image error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit excedido. Aguarde alguns segundos e tente novamente.',
          loading: false
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Créditos insuficientes. Entre em contato com o suporte.',
          loading: false
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response structure:', JSON.stringify(data).substring(0, 200));
    
    // Extract image from response
    const message = data.choices?.[0]?.message;
    const images = message?.images;
    const textContent = message?.content;
    
    if (images && images.length > 0) {
      const imageUrl = images[0]?.image_url?.url;
      console.log('Image generated successfully, base64 length:', imageUrl?.length);
      
      return new Response(JSON.stringify({ 
        imageUrl,
        textContent,
        success: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.log('No image in response, text only:', textContent?.substring(0, 100));
      return new Response(JSON.stringify({ 
        error: 'A IA não conseguiu gerar uma imagem. Tente um prompt diferente.',
        textContent,
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
