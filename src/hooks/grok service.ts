
export class GroqService {
  private static getApiKey() {
    return localStorage.getItem('kaizen_block_key') || "";
  }

  static async refinePrompt(rawDetails: string, isReconstruction: boolean = false, lighting: string = "") {
    const apiKey = this.getApiKey();
    if (!apiKey) return rawDetails;

    // Enhanced instructions to handle gender-appropriate clothing adaptation
    const systemInstruction = isReconstruction 
      ? `You are the KAIZEN MASTER ARCHITECT. 
         STRICT RULE 1: Output ONLY the final image generation prompt in English. No chat.
         STRICT RULE 2: GENDER ADAPTATION. Detect the subject's gender from context or DNA. 
         If the subject is MALE but a feminine outfit is selected (like a dress or Skims), 
         ADAPT it to a high-end masculine equivalent (e.g., silk shirt, masculine loungewear) 
         maintaining the brand/style essence.
         INSTRUCTIONS: Reconstruct based on reference features. Apply lighting: ${lighting}.`
      : `You are the KAIZEN PROMPT GENERATOR. 
         STRICT RULE 1: Output ONLY the final image generation prompt in English. No chat.
         STRICT RULE 2: GENDER ADAPTATION. If the DNA character is MALE, translate any feminine 
         clothing selections into luxury masculine equivalents.
         SCENE: Build a high-end UGC 8k realistic scene. DNA: Respect the face/hair provided.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Generate a clean technical prompt for: ${rawDetails}. Current lighting: ${lighting}. Ensure gender-appropriate clothing interpretation.` }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || rawDetails;
      
      content = content.replace(/^["']|["']$/g, '');
      content = content.replace(/^(Prompt: |Output: |Final Prompt: )/i, '');
      
      return content.trim();
    } catch (error) {
      console.error("Groq Engine Error:", error);
      return rawDetails;
    }
  }
}
