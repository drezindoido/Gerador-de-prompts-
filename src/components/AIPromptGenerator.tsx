import { useState } from "react";
import { Sparkles, Wand2, Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AIPromptGenerator = () => {
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePrompt = async () => {
    if (!description.trim()) {
      toast.error("Digite uma descrição primeiro!");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt', {
        body: { action: 'generate', prompt: description }
      });

      if (error) throw error;

      setGeneratedPrompt(data.content);
      toast.success("Prompt gerado com IA!");
    } catch (error) {
      console.error('Generate error:', error);
      toast.error("Erro ao gerar prompt. Tente novamente.");
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
      const { data, error } = await supabase.functions.invoke('ai-prompt', {
        body: { action: 'improve', prompt: generatedPrompt }
      });

      if (error) throw error;

      setGeneratedPrompt(data.content);
      toast.success("Prompt melhorado!");
    } catch (error) {
      console.error('Improve error:', error);
      toast.error("Erro ao melhorar prompt. Tente novamente.");
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
          Descreva sua imagem
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Uma mulher elegante em um café parisiense ao pôr do sol..."
          className="w-full h-24 bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <button
        onClick={generatePrompt}
        disabled={isGenerating}
        className="btn-primary-glow w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Gerando com IA...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Gerar Prompt com IA
          </>
        )}
      </button>

      {generatedPrompt && (
        <div className="card-elevated p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Prompt Gerado
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={improvePrompt}
                disabled={isImproving}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                {isImproving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Wand2 size={14} />
                )}
                Melhorar
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
          <p className="text-foreground leading-relaxed bg-muted/50 p-4 rounded-lg text-sm">
            {generatedPrompt}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPromptGenerator;
