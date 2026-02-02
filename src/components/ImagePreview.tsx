import { useState, useEffect, useRef } from "react";
import { Loader2, ImageIcon, Download, AlertCircle } from "lucide-react";
import { saveImage, getImage } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

interface ImagePreviewProps {
  promptId: string;
  promptText: string;
  autoGenerate?: boolean;
}

const ImagePreview = ({ promptId, promptText, autoGenerate = false }: ImagePreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    checkCache();
    return () => { isMounted.current = false; };
  }, [promptId]);

  const checkCache = async () => {
    const cached = await getImage(promptId);
    if (cached && isMounted.current) {
      setImageUrl(cached);
    }
  };

  const generateImage = async () => {
    if (!isMounted.current) return;
    
    const cached = await getImage(promptId);
    if (cached) {
      setImageUrl(cached);
      setQueued(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Use the AI prompt edge function for image generation
      const { data, error: functionError } = await supabase.functions.invoke("ai-prompt", {
        body: { action: "generate", prompt: promptText }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.content) {
        // For now, show a placeholder since we're not doing actual image generation
        if (isMounted.current) {
          setError("Geração de imagem indisponível no momento.");
        }
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (e: any) {
      console.error("Erro na geração:", e);
      if (isMounted.current) setError("Erro. Tente novamente.");
    } finally {
      if (isMounted.current) { setLoading(false); setQueued(false); }
    }
  };

  useEffect(() => {
    if (autoGenerate && !imageUrl && !loading && !queued && !error) {
      getImage(promptId).then(cached => {
        if (!cached && isMounted.current) {
          setQueued(true);
          generateImage();
        } else if (cached && isMounted.current) {
          setImageUrl(cached);
        }
      });
    }
  }, [autoGenerate, promptId]);

  if (imageUrl) {
    return (
      <div className="mt-4 relative group animate-in fade-in duration-700">
        <img src={imageUrl} alt="Generated Preview" className="w-full h-auto rounded-2xl shadow-lg border border-border" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href={imageUrl} download={`kaizen-${promptId}.png`} className="bg-foreground text-background px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:opacity-90">
            <Download size={12} /> Salvar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl mb-2 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0"/>
          <p className="text-red-400 text-[10px] leading-tight">{error}</p>
        </div>
      )}
      {queued || loading ? (
        <div className="w-full py-8 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-muted-foreground" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Renderizando...</span>
        </div>
      ) : (
        <button onClick={() => { setQueued(true); generateImage(); }} className="w-full py-2 bg-secondary border border-border text-primary rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-muted flex items-center justify-center gap-2">
          <ImageIcon size={12} /> Visualizar Imagem
        </button>
      )}
    </div>
  );
};

export default ImagePreview;
