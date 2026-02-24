import { useState } from "react";
import { Sparkles, Wand2, Copy, Check, Loader2 } from "lucide-center";
import { toast } from "sonner";
import { generateStory } from "@/lib/ai-service"; 
// 1. Importando os seletores que você criou
import { PromptSelectors } from "./PromptSelectors";

const AIPromptGenerator = () => {
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [copied, setCopied] = useState(false);

  // 2. Função para adicionar as opções no texto da descrição
  const handleSelectOption = (option: string) => {
    setDescription((prev) => {
      const base = prev.trim();
      if (!base) return option;
      if (base.toLowerCase().includes(option.toLowerCase())) return prev; // Evita repetir
      return `${base}, ${option}`;
    });
  };

  const generatePrompt = async () => {
    if (!description.trim()) {
      toast.error("Escolha as opções ou descreva a cena primeiro!");
      return;
    }

    setIsGenerating(true);
    try {
      // Usando DeepSeek para processar a Kaizen com as novas opções
      const result = await generateStory(`Transforme esta ideia em um prompt técnico ultra-realista 8k. Foque na personagem Kaizen (cabelo lilás): ${description}`);

      if (!result) throw new Error("Sem resposta da IA");

      setGeneratedPrompt(result);
      toast.success("Prompt gerado com DeepSeek!");
    } catch (error) {
      console.error('Generate error:', error);
      toast.error("Erro na API. Verifique o arquivo ai-service.ts");
    } finally {
      setIsGenerating(false);
    }
  };

  const improvePrompt = async () => {
    if (!generatedPrompt.trim()) {
      toast.error("Gere um prompt primeiro!");
      return;
    }

    setIsImproving(true);
    try {
      const result = await generateStory(`Melhore este prompt adicionando detalhes de pele real, iluminação profissional e profundidade de campo: ${generatedPrompt}`);
      setGeneratedPrompt(result);
      toast.success("Prompt refinado!");
    } catch (error) {
      toast.error("Erro ao melhorar o prompt.");
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          Estúdio de Criação Kaizen
        </label>
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Toque nos botões abaixo ou descreva a cena..."
          className="w-full h-24 bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
        />

        {/* 3. Inserindo os botões de Expressão, Luz e Famosos aqui */}
        <PromptSelectors onSelect={handleSelectOption} />
      </div>

      <button
        onClick={generatePrompt}
        disabled={isGenerating}
        className="btn-primary-glow w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 font-bold"
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processando com DeepSeek...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            GERAR PROMPT MESTRE
          </>
        )}
      </button>

      {generatedPrompt && (
        <div className="card-elevated p-4 border border-primary/20 bg-primary/5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Prompt Pronto para IA
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={improvePrompt}
                disabled={isImproving}
                className="flex items-center gap-1 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {isImproving ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Refinar
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-primary font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                Copiar
              </button>
            </div>
          </div>
          <p className="text-foreground text-sm leading-relaxed bg-background/50 p-4 rounded-lg border border-border/50 shadow-inner">
            {generatedPrompt}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPromptGenerator;
