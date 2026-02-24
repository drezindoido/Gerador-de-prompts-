
import { GoogleGenAI } from "@google/genai";

const KAIZEN_SYSTEM_INSTRUCTION = `
# MISSION: KAIZEN UNIVERSAL GENERATOR
Você é o motor central da "Kaizen Engine". Sua tarefa é processar inputs para gerar prompts de imagem ultra-realistas (UGC).

## 1. IDENTITY BLOCK (IMUTÁVEL)
- NOME: Kaizen (Influenciadora Brasileira, 24 anos).
- CABELO: Lilás claro / Roxo pastel.
- PELE: Textura real, poros visíveis, sem filtros.
- DNA BASE: "Raw photo, 8k, realistic skin texture, visible pores, handheld smartphone shot, unedited."

## 2. REGRAS DE SAÍDA
- IDIOMA: Sempre em INGLÊS.
`;

export class GeminiService {
  // Always create a new instance right before making an API call to ensure the latest API key is used
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async analyzeImage(base64Image: string, userRequest: string = "") {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: `Analyze and reconstruct this scene for Kaizen Identity. Focus on facial structure, hair color, and exact outfit details. Extra request: ${userRequest}` },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        },
        config: {
          systemInstruction: KAIZEN_SYSTEM_INSTRUCTION,
          temperature: 0.2
        }
      });
      return response.text;
    } catch (error: any) {
      console.error("Erro na análise visual:", error);
      throw error;
    }
  }

  static async generateKaizenImage(prompt: string, settings: { size: string, aspectRatio: string }, referenceImage?: string | null) {
    let modelName = 'gemini-2.5-flash-image';
    
    // Switch to Pro model for high resolution as per guidelines
    if (settings.size === '2K' || settings.size === '4K') {
      modelName = "gemini-3-pro-image-preview";
    }

    const ai = this.getClient();
    try {
      const imageConfig: any = {
        aspectRatio: settings.aspectRatio
      };
      
      if (modelName === "gemini-3-pro-image-preview") {
        imageConfig.imageSize = settings.size;
      }

      const parts: any[] = [{ text: prompt }];

      // Se houver uma imagem de referência, ela é enviada junto para manter a identidade exata (rosto/cabelo)
      if (referenceImage) {
        const base64Data = referenceImage.includes(',') ? referenceImage.split(',')[1] : referenceImage;
        parts.unshift({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        });
        // Adiciona comando de preservação de identidade ao prompt
        parts[1].text = `Maintaining the EXACT face and lilac hair from the reference image: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          imageConfig: imageConfig
        }
      });

      const candidates = response.candidates || [];
      const outParts = candidates[0]?.content?.parts || [];
      // Iterate through all parts to find the image part correctly
      for (const part of outParts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      console.error(`Erro no modelo ${modelName}:`, error);
      // Let the caller handle specific errors like "Requested entity was not found" to prompt for API key selection
      throw error;
    }
  }
}
