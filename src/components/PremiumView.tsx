import { Crown, Check, Sparkles, Users, Zap } from "lucide-react";

interface PremiumViewProps {
  isPremiumUser: boolean;
  onActivate: () => void;
}

const PremiumView = ({ isPremiumUser, onActivate }: PremiumViewProps) => {
  const features = [
    { icon: Users, text: "Acesso a todos os 15 personagens" },
    { icon: Sparkles, text: "Prompts exclusivos premium" },
    { icon: Zap, text: "Atualizações prioritárias" },
    { icon: Crown, text: "Suporte VIP" },
  ];

  if (isPremiumUser) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-glow">
          <Crown className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">
          <span className="gold-gradient-text">Você é Premium!</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Aproveite todos os personagens e recursos exclusivos desbloqueados.
        </p>
        <div className="card-elevated p-6 text-left">
          <h3 className="font-semibold mb-4">Seus benefícios ativos:</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-float">
          <Crown className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-4">
          Desbloqueie o <span className="gold-gradient-text">Premium</span>
        </h1>
        <p className="text-muted-foreground">
          Acesse todos os personagens e recursos exclusivos
        </p>
      </div>

      <div className="card-elevated p-6 mb-6">
        <ul className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-foreground">{feature.text}</span>
                <Check size={18} className="text-emerald-500 ml-auto" />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card-elevated p-6 border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm mb-2">Acesso vitalício</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-muted-foreground line-through">R$ 49,90</span>
            <span className="font-display text-4xl font-bold gold-gradient-text">
              R$ 19,90
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Pagamento único • Sem mensalidades
          </p>
        </div>

        <button
          onClick={onActivate}
          className="btn-primary-glow w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Crown size={20} />
          Ativar Premium Agora
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          🔒 Pagamento seguro • Satisfação garantida
        </p>
      </div>
    </div>
  );
};

export default PremiumView;
