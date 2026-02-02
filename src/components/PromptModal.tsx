import { X, Code, Crown, ImageIcon, Hash } from "lucide-react";
import CopyButton from "./CopyButton";
import ImagePreview from "./ImagePreview";
import { Prompt } from "@/types";

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
}

const PromptModal = ({ prompt, onClose }: PromptModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border w-full max-w-3xl rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-card rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-muted text-[10px] uppercase font-bold text-primary border border-border">{prompt.category}</span>
            {prompt.isPremium && <span className="px-3 py-1 rounded-full bg-primary text-[10px] uppercase font-bold text-primary-foreground flex items-center gap-1"><Crown size={10} /> Pro</span>}
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-2">{prompt.title}</h2>
          <p className="text-muted-foreground text-sm mb-8">{prompt.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3 text-foreground">
                <Code size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Prompt Completo</span>
              </div>
              <div className="bg-card/50 p-4 rounded-2xl border border-border mb-4">
                <p className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{prompt.fullPrompt}</p>
              </div>
              <CopyButton text={prompt.fullPrompt} label="Copiar Prompt" />
              
              <div className="mt-6 flex flex-wrap gap-2">
                {prompt.tags.map(t => <span key={t} className="px-2 py-1 bg-card rounded text-[9px] text-muted-foreground uppercase font-bold tracking-widest">#{t}</span>)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-foreground">
                <ImageIcon size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Preview & Render</span>
              </div>
              <div className="bg-card p-4 rounded-2xl border border-border">
                <ImagePreview promptId={prompt.id} promptText={prompt.fullPrompt} autoGenerate={false} />
              </div>
              <div className="mt-4 p-4 bg-card rounded-xl border border-border">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Modelo Recomendado</h4>
                <p className="text-xs text-muted-foreground">{prompt.modelRecommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
