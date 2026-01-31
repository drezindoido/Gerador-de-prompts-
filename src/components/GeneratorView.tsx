import { useState } from "react";
import { Copy, Check, Sparkles, Bot } from "lucide-react";
import { 
  characters, 
  locations, 
  outfits, 
  cameraStyles, 
  emotions, 
  artStyles,
  type Character 
} from "@/data/characters";
import { toast } from "sonner";
import AIPromptGenerator from "./AIPromptGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeneratorViewProps {
  isPremiumUser: boolean;
  selectedCharacter: Character | null;
}

const GeneratorView = ({ isPremiumUser, selectedCharacter }: GeneratorViewProps) => {
  const availableCharacters = characters.filter(
    (c) => !c.isPremium || isPremiumUser
  );

  const [character, setCharacter] = useState(
    selectedCharacter?.id || availableCharacters[0]?.id || ""
  );
  const [location, setLocation] = useState(locations[0]);
  const [outfit, setOutfit] = useState(outfits[0]);
  const [camera, setCamera] = useState(cameraStyles[0]);
  const [emotion, setEmotion] = useState(emotions[0]);
  const [style, setStyle] = useState(artStyles[0]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const selectedChar = characters.find((c) => c.id === character);
    console.log("Generate clicked - character:", character, "selectedChar:", selectedChar);
    
    if (!selectedChar) {
      toast.error("Selecione um personagem primeiro!");
      return;
    }

    const prompt = `${style} image of ${selectedChar.name}, ${selectedChar.age} years old, ${selectedChar.country}, in a ${location.toLowerCase()}, ${camera.toLowerCase()} style, ${emotion.toLowerCase()} expression, wearing ${outfit}, natural skin texture, detailed lighting, professional quality, 8K resolution.`;
    
    setGeneratedPrompt(prompt);
    toast.success("Prompt gerado com sucesso!");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Gerador de Prompt
        </h1>
        <p className="text-muted-foreground">
          Customize e gere prompts perfeitos para suas imagens
        </p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot size={16} />
            Gerar com IA
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Sparkles size={16} />
            Personalizar Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <AIPromptGenerator />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Personagem
          </label>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="select-dark w-full"
          >
            {availableCharacters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.age}, {c.country})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Local
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="select-dark w-full"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Roupa
          </label>
          <select
            value={outfit}
            onChange={(e) => setOutfit(e.target.value)}
            className="select-dark w-full"
          >
            {outfits.map((out) => (
              <option key={out} value={out}>
                {out}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Estilo de Câmera
          </label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="select-dark w-full"
          >
            {cameraStyles.map((cam) => (
              <option key={cam} value={cam}>
                {cam}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Emoção
          </label>
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="select-dark w-full"
          >
            {emotions.map((emo) => (
              <option key={emo} value={emo}>
                {emo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Estilo Artístico
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="select-dark w-full"
          >
            {artStyles.map((sty) => (
              <option key={sty} value={sty}>
                {sty}
              </option>
            ))}
          </select>
        </div>
          </div>

          <button
            onClick={generatePrompt}
            className="btn-primary-glow w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={20} />
            Gerar Prompt
          </button>

          {generatedPrompt && (
            <div className="card-elevated p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Prompt Gerado
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                {generatedPrompt}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneratorView;
