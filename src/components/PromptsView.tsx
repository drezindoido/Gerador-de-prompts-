import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { readyPrompts } from "@/data/characters";
import { toast } from "sonner";

const PromptsView = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (prompt: string, index: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Prompt copiado!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Prompts Prontos</h1>
        <p className="text-muted-foreground">
          Prompts otimizados prontos para usar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {readyPrompts.map((item, index) => (
          <div key={index} className="card-elevated p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">
                {item.title}
              </h3>
              <button
                onClick={() => copyToClipboard(item.prompt, index)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {copiedIndex === index ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedIndex === index ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
              {item.prompt}
            </p>
          </div>
        ))}
      </div>

      <div className="card-elevated p-6 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-2">
              Dica de Uso
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estes prompts foram otimizados para ferramentas como Midjourney, 
              DALL-E e Stable Diffusion. Copie e cole diretamente, ou use como 
              base para personalizar ainda mais suas criações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptsView;
