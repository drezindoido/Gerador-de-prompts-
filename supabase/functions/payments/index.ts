import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const KAIZENBEBE_BOT_TOKEN = Deno.env.get('KAIZENBEBE_BOT_TOKEN');

serve(async (req) => {
    try {
        const update = await req.json();
        console.log("Payment update received:", JSON.stringify(update));

        const preCheckoutQuery = update.pre_checkout_query;
        const successfulPayment = update.message?.successful_payment;

        if (preCheckoutQuery) {
            // Logic to answer pre-checkout query (validate and accept)
            await fetch(`https://api.telegram.org/bot${KAIZENBEBE_BOT_TOKEN}/answerPreCheckoutQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pre_checkout_query_id: preCheckoutQuery.id,
                    ok: true
                })
            });
        }

        if (successfulPayment) {
            // Logic to update user status in DB
            const userId = update.message.from.id;
            console.log(`Payment confirmed for user ${userId}`);
            // TODO: Update Supabase 'profiles' or 'subscriptions' table
        }

        return new Response("OK", { status: 200 });
    } catch (error: any) {
        console.error("Payment handler error:", error.message);
        return new Response(error.message, { status: 200 }); // Retorna 200 para evitar loops no Telegram
    }
});
