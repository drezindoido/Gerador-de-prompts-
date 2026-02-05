import { useState } from "react";
import {
  MapPin, Camera, Shirt, MessageSquarePlus, Settings2, Wand2,
  Loader2, Lock, Code, MinusCircle, Hash, Sparkles, Bot,
  BookOpen, Share2, Video, Ghost, Palette, Monitor, Tv, PenTool, X, Scroll, ImageIcon, Download
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import CopyButton from "@/components/CopyButton";
import { CHARACTERS, LOCATIONS, CAMERA_DATABASE, OUTFITS, generateDynamicPrompt } from "@/data/prompts";
import { Character } from "@/types";
import { toast } from "sonner";

const DEFAULT_NEGATIVE_PROMPT = "ugly, deformed, disfigured, low quality, blurry, pixelated, grain, text, watermark, signature, out of frame, bad anatomy, bad proportions, cloned face, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers";

const Generator = () => {
  const { subscription } = useAuth();
  const isPremium = subscription?.subscribed;

  const [character, setCharacter] = useState<Character>(CHARACTERS[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [camera, setCamera] = useState("Random");
  const [outfit, setOutfit] = useState(OUTFITS[0]);
  const [customContext, setCustomContext] = useState("");
  const [generated, setGenerated] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [extraResult, setExtraResult] = useState<{ type: string, content: string } | null>(null);
  const [isExtraLoading, setIsExtraLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);

  const canUseStatic = isPremium;
  const canUseAI = isPremium;

  const handleStaticGenerate = () => {
    if (!canUseStatic) return;
    const prompt = generateDynamicPrompt(character, location, camera, outfit);
    setGenerated(prompt);
    setNegativePrompt(DEFAULT_NEGATIVE_PROMPT);
    setTags([]);
    setExtraResult(null);
  };

  const handleAIGenerate = async () => {
    if (!canUseAI) return;
    setIsGenerating(true);
    try {
      const basePrompt = generateDynamicPrompt(character, location, camera, outfit);
      const userAddition = customContext ? `, ${customContext}` : "";

      const { data, error } = await supabase.functions.invoke("ai-prompt", {
        body: {
          action: "improve",
          prompt: basePrompt + userAddition
        }
      });

      if (error) throw error;

      if (data?.content) {
        setGenerated(data.content);
        setNegativePrompt(DEFAULT_NEGATIVE_PROMPT);
        setTags([]);
        setExtraResult(null);
      }
    } catch (e) {
      console.error("AI Generation error:", e);
      toast.error("Erro na geração IA. Tentando modo offline...");
      // Fallback local
      handleStaticGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!generated || !canUseAI || (negativePrompt && negativePrompt !== DEFAULT_NEGATIVE_PROMPT)) return;
    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-prompt", {
        body: {
          action: "chat",
          messages: [
            { role: "user", content: `Analise este prompt e gere um negative prompt adequado (substituindo o padrão) e 5 tags relevantes em formato JSON: {"negative": "...", "tags": [...]}. Prompt: ${generated}` }
          ],
          context: "Geração de negative prompt e tags"
        }
      });

      if (error) throw error;

      if (data?.content) {
        try {
          const parsed = JSON.parse(data.content);
          setNegativePrompt(parsed.negative || DEFAULT_NEGATIVE_PROMPT);
          setTags(parsed.tags || []);
        } catch {
          setNegativePrompt(data.content);
        }
      }
    } catch (e) {
      console.error("Enhance error:", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExtraAction = async (type: string, systemPrompt: string) => {
    if (!generated || !canUseAI) return;
    setIsExtraLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-prompt", {
        body: {
          action: "chat",
          messages: [{ role: "user", content: systemPrompt }],
          context: `Prompt base: ${generated}`
        }
      });

      if (error) throw error;

      if (data?.content) {
        setExtraResult({ type, content: data.content });
      }
    } catch (e) {
      console.error("Extra action error:", e);
      toast.error("Erro ao processar ação extra.");
    } finally {
      setIsExtraLoading(false);
    }
  };

  const handleLore = () => handleExtraAction("Lore", `Crie um backstory detalhado para esta cena/personagem baseado no prompt.`);
  const handleSocial = () => handleExtraAction("Caption", `Crie uma legenda de Instagram envolvente em português para esta imagem.`);
  const handleTechSpecs = () => handleExtraAction("Tech Specs", `Liste as especificações técnicas de câmera, iluminação e pós-produção ideais para recriar esta cena.`);
  const handleRemix = (style: string) => handleExtraAction(`Remix: ${style}`, `Reescreva este prompt no estilo visual "${style}", mantendo a essência mas adaptando completamente a estética.`);

  const handleStoryGenerate = () => {
    const storyPrompt = `Crie uma história curta do dia a dia do personagem "${character.name}" (${character.age} anos, ${character.country}).
A história deve:
- Ser em português e ter 3-4 parágrafos
- Descrever uma cena cotidiana interessante
- Manter a personalidade e estilo do personagem: ${character.style}
- Terminar com um gancho que permita continuação futura
- Cada história deve poder se conectar com histórias anteriores do mesmo personagem

Esta é uma versão teste, então inclua ao final uma sugestão de prompt de imagem que ilustre a cena principal da história.`;
    handleExtraAction("História", storyPrompt);
  };

  const handleImageGenerate = async () => {
    if (!generated || !canUseAI) return;
    setIsImageGenerating(true);
    setGeneratedImage(null);

    try {
      toast.info("Gerando imagem com IA...", { duration: 3000 });

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: generated }
      });

      if (error) throw error;

      if (data?.success && data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Imagem gerada com sucesso!");
      } else {
        toast.error(data?.error || "Erro ao gerar imagem");
      }
    } catch (e) {
      console.error("Image generation error:", e);
      toast.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `kaizen-${character.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado!");
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 editorial-spacing">Prompt Generator</h1>
          <p className="text-muted-foreground">Monte prompts profissionais com nosso motor de consistência.</p>
        </div>

        {!isPremium && (
          <div className="mb-8 p-6 bg-card border border-primary/30 rounded-2xl text-center">
            <Lock size={24} className="mx-auto mb-3 text-primary" />
            <h3 className="font-bold text-lg mb-2">Recurso Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">Assine para acessar o gerador de prompts completo.</p>
            <Link to="/premium" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm">
              Desbloquear Agora
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className={`lg:col-span-5 space-y-6 ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Character Selection */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Personagem
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CHARACTERS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCharacter(c)}
                    className={`p-4 rounded-2xl text-left border transition-all ${character.id === c.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'}`}
                  >
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className={`text-[10px] ${character.id === c.id ? 'opacity-70' : 'text-muted-foreground'}`}>{c.country}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <MapPin size={14} /> Localização
              </label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 rounded-2xl bg-card border border-border text-foreground text-sm font-medium">
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Camera */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Camera size={14} /> Câmera & Estilo
              </label>
              <select value={camera} onChange={(e) => setCamera(e.target.value)} className="w-full p-4 rounded-2xl bg-card border border-border text-foreground text-sm font-medium">
                <option value="Random">✨ Aleatório (Surpreenda-me)</option>
                {CAMERA_DATABASE.map((cat, idx) => (
                  <optgroup key={idx} label={cat.category}>
                    {cat.items.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Outfit */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Shirt size={14} /> Roupa
              </label>
              <select value={outfit} onChange={(e) => setOutfit(e.target.value)} className="w-full p-4 rounded-2xl bg-card border border-border text-foreground text-sm font-medium">
                {OUTFITS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Context */}
            <div className="space-y-4 pt-4 border-t border-border">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <MessageSquarePlus size={14} /> Contexto (Opcional)
              </label>
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Ex: Comendo um hambúrguer, lutando..."
                className="w-full p-4 rounded-2xl bg-card border border-border text-sm font-medium h-24 resize-none text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Generate Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleStaticGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-card border border-border text-foreground rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-muted flex items-center justify-center gap-2"
              >
                <Settings2 size={14} /> Montagem Estática
              </button>

              <button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Remix IA
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border rounded-[3rem] p-10 h-full flex flex-col shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-foreground">Saída</h3>
                <span className="px-3 py-1 bg-background text-muted-foreground text-[9px] font-bold uppercase tracking-widest rounded-full border border-border">
                  {camera === 'Random' ? 'Câmera Auto' : 'Câmera Fixa'}
                </span>
              </div>

              {generated ? (
                <div className="flex-grow space-y-8 animate-in fade-in duration-500">
                  <div className="bg-background rounded-3xl p-8 border border-border relative min-h-[150px] flex flex-col justify-center">
                    <pre className="text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{generated}</pre>
                  </div>

                  {negativePrompt && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-secondary rounded-3xl p-6 border border-border mb-4">
                        <div className="flex items-center gap-2 mb-3 text-red-300">
                          <MinusCircle size={14} /> <span className="text-[9px] font-bold uppercase tracking-widest">Negative Prompt</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono leading-relaxed">{negativePrompt}</p>
                        <div className="mt-2 flex justify-end"><CopyButton text={negativePrompt} label="Copiar" /></div>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full border border-border bg-background text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                              <Hash size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <div className="flex-grow"><CopyButton text={generated} label="Copiar Prompt" /></div>
                      <button
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || (negativePrompt && negativePrompt !== DEFAULT_NEGATIVE_PROMPT)}
                        className="px-6 bg-muted text-primary rounded-xl font-bold uppercase tracking-widest text-[9px] hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {negativePrompt && negativePrompt !== DEFAULT_NEGATIVE_PROMPT ? "Analisado" : "Gerar Negativos"}
                      </button>
                    </div>

                    {/* Creative Suite Integrated Here */}
                    <div className="mt-8 pt-8 border-t border-border/50">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary"><Bot size={16} /></div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">Creative Suite</h3>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ferramentas de Criação</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onClick={handleImageGenerate} disabled={isImageGenerating} className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl hover:bg-green-500/20 text-left group transition-colors">
                          {isImageGenerating ? <Loader2 size={16} className="text-green-500 animate-spin mb-2" /> : <ImageIcon size={16} className="text-green-500 mb-2" />}
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-foreground">Gerar Imagem</span>
                        </button>

                        <button onClick={handleStoryGenerate} disabled={isExtraLoading} className="p-3 bg-background border border-border rounded-xl hover:border-primary text-left group transition-colors">
                          <Scroll size={16} className="text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-foreground">História</span>
                        </button>

                        <button onClick={handleLore} disabled={isExtraLoading} className="p-3 bg-background border border-border rounded-xl hover:border-primary text-left group transition-colors">
                          <BookOpen size={16} className="text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-foreground">Lore</span>
                        </button>

                        <button onClick={handleSocial} disabled={isExtraLoading} className="p-3 bg-background border border-border rounded-xl hover:border-primary text-left group transition-colors">
                          <Share2 size={16} className="text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-foreground">Legenda</span>
                        </button>
                      </div>

                      {/* Display Extra Results or Image */}
                      {(isExtraLoading || isImageGenerating) && (
                        <div className="mt-4 text-center p-4 bg-muted/20 rounded-xl">
                          <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Processando...</p>
                        </div>
                      )}

                      {extraResult && (
                        <div className="mt-4 bg-background border border-border p-4 rounded-xl animate-in fade-in relative">
                          <button onClick={() => setExtraResult(null)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{extraResult.type}</h4>
                          <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">{extraResult.content}</pre>
                          <div className="mt-2 flex justify-end"><CopyButton text={extraResult.content} /></div>
                        </div>
                      )}

                      {generatedImage && (
                        <div className="mt-4 bg-background border border-green-500/30 p-4 rounded-xl animate-in fade-in relative">
                          <button onClick={() => setGeneratedImage(null)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-2 flex items-center gap-2"><ImageIcon size={12} /> Resultado</h4>
                          <img src={generatedImage} alt="Gerado" className="w-full rounded-lg bg-black/50 object-contain mb-2" />
                          <button onClick={handleDownloadImage} className="w-full py-2 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-500/20">Download</button>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-20">
                  {isGenerating ? <Loader2 size={80} className="mb-6 animate-spin text-muted-foreground" /> : <Code size={80} strokeWidth={1} className="mb-6 text-muted-foreground" />}
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">{isGenerating ? "Sintetizando Dados..." : "Pronto para Geração"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
