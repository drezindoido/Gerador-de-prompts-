import { useState, useEffect } from "react";
import { MessageCircle, Sparkles, Crown, ArrowRight, Zap, Star, Users, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const proDicas = [
  {
    icon: <Crown className="w-4 h-4" />,
    title: "Personagens Exclusivos",
    description: "Desbloqueie 50+ personagens premium com estilos únicos",
    highlight: "PRO"
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Histórias Ilimitadas",
    description: "Gere quantas histórias quiser sem limites diários",
    highlight: "PRO"
  },
  {
    icon: <Star className="w-4 h-4" />,
    title: "Suporte Prioritário",
    description: "Acesso ao chat com IA premium e respostas mais rápidas",
    highlight: "PRO"
  },
  {
    icon: <Image className="w-4 h-4" />,
    title: "Geração de Imagens",
    description: "Crie imagens únicas dos seus personagens com IA",
    highlight: "PRO"
  },
  {
    icon: <Users className="w-4 h-4" />,
    title: "Character Lab",
    description: "Crie e salve seus próprios modelos digitais personalizados",
    highlight: "PRO"
  }
];

const dicasGerais = [
  "💡 Dica: Use descrições detalhadas para melhores resultados",
  "🎨 Experimente diferentes estilos de câmera para variar",
  "✨ Combine iluminação natural com poses dinâmicas",
  "📸 Especifique a qualidade: 8K, ultra-realista, cinematográfico",
  "🌅 Horário do dia muda completamente o mood da imagem"
];

const HomeChatPreview = () => {
  const { user, subscription } = useAuth();
  const isPro = subscription?.subscribed;
  const [currentDicaIndex, setCurrentDicaIndex] = useState(0);
  const [currentProIndex, setCurrentProIndex] = useState(0);

  // Rotate general tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDicaIndex((prev) => (prev + 1) % dicasGerais.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Rotate PRO tips every 5 seconds
  useEffect(() => {
    if (!isPro) {
      const interval = setInterval(() => {
        setCurrentProIndex((prev) => (prev + 1) % proDicas.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPro]);

  const currentProDica = proDicas[currentProIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Preview Card */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 shadow-2xl shadow-primary/5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">KAIZEN Assistant</h3>
              <p className="text-xs text-muted-foreground">Seu assistente de prompts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Rotating Tip */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-4 min-h-[60px] flex items-center transition-all duration-500">
          <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
            {dicasGerais[currentDicaIndex]}
          </p>
        </div>

        {/* PRO Merchandising for free users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 mb-4 transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                {currentProDica.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {currentProDica.highlight}
                  </span>
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {currentProDica.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {currentProDica.description}
                </p>
              </div>
            </div>
            <Link 
              to="/premium"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <Crown className="w-3 h-3" />
              Ativar PRO
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* CTA Button */}
        <Link 
          to="/chat"
          className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
        >
          <MessageCircle className="w-5 h-5" />
          Abrir Chat com IA
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HomeChatPreview;
