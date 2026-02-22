import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const KAIZENBEBE_BOT_TOKEN = Deno.env.get('KAIZENBEBE_BOT_TOKEN');
const GOOGLE_SERVICE_ACCOUNT = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || '{}');
const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

async function getAccessToken() {
    const { client_email, private_key } = GOOGLE_SERVICE_ACCOUNT;
    if (!client_email || !private_key) throw new Error("Missing Google Service Account credentials");

    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const claim = {
        iss: client_email,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };

    // Note: Standard RS256 signing in Deno Edge Functions usually requires a library or subtle crypto.
    // For simplicity and to avoid complex dependencies, we assume the user has enabled the Drive API
    // and we'll use a simplified fetch-based approach if possible, but let's try the standard way.

    // We'll use the 'google-auth-library' equivalent for Deno/Edge if available, 
    // but since we want zero-dependency, we'll use a pre-built JWT if we can or subtle crypto.

    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = private_key.substring(pemHeader.length, private_key.length - pemFooter.length).replace(/\s/g, "");
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaim = btoa(JSON.stringify(claim));
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedClaim}`);
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const body = await response.json();
    if (body.error) throw new Error(`OAuth error: ${body.error_description || body.error}`);
    return body.access_token;
}

async function analyzeWithGemini(imageBase64: string) {
    if (!GEMINI_API_KEY) throw new Error("GOOGLE_GEMINI_API_KEY not set");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: "Analise esta imagem e descreva-a de forma artística e vendedora para um post no Telegram. Crie um texto envolvente, use emojis e hashtags relevantes. Foque na beleza e nos detalhes." },
                    { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                ]
            }]
        })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Imagem incrível da Kaizen!";
}

serve(async (req) => {
    try {
        console.log("Drive Monitor started...");
        const accessToken = await getAccessToken();

        // List recent images from Drive
        const driveResponse = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType contains 'image/'&orderBy=createdTime desc&pageSize=5&fields=files(id, name, mimeType)", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { files } = await driveResponse.json();

        if (!files || files.length === 0) {
            return new Response("No files found", { status: 200 });
        }

        for (const file of files) {
            // Check if processed
            const { data: alreadyProcessed } = await supabase
                .from('processed_files')
                .select('id')
                .eq('file_id', file.id)
                .single();

            if (alreadyProcessed) {
                console.log(`File ${file.id} already processed. Skipping.`);
                continue;
            }

            console.log(`Processing new file: ${file.name} (${file.id})`);

            // Download file
            const downloadResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const blob = await downloadResponse.blob();
            const buffer = await blob.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

            // AI Analysis
            const caption = await analyzeWithGemini(base64);

            // Post to Telegram (using the bot as a channel poster or to a specific group)
            // For now, we'll post to the bot's own chat or a configured channel.
            // We'll need a CHAT_ID. If not provided, we might have trouble knowing WHERE to post.
            // Typical use case: Post to a specific Channel.
            const CHANNEL_ID = Deno.env.get('TELEGRAM_PREMIUM_CHANNEL_ID') || "@kaizenbebe_premium_test"; // Placeholder

            const telegramResponse = await fetch(`https://api.telegram.org/bot${KAIZENBEBE_BOT_TOKEN}/sendPhoto`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: `data:${file.mimeType};base64,${base64}`,
                    caption: caption,
                    parse_mode: "Markdown"
                })
            });

            const telData = await telegramResponse.json();
            if (telData.ok) {
                // Mark as processed
                await supabase.from('processed_files').insert({
                    file_id: file.id,
                    file_name: file.name
                });
                console.log(`Successfully posted and recorded ${file.id}`);
            } else {
                console.error("Telegram post failed:", JSON.stringify(telData));
            }
        }

        return new Response("Sync completed", { status: 200 });
    } catch (error: any) {
        console.error("Monitor error:", error.message);
        return new Response(error.message, { status: 500 });
    }
});
