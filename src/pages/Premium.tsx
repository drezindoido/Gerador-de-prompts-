import { useState } from "react";
import { Crown, Check, Sparkles, Zap, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Premium = () => {
  const { user, subscription, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, text: "Acesso a todos os prompts premium" },
    { icon: Sparkles, text: "Novos prompts toda semana" },
    { icon: Zap, text: "Atualizações prioritárias" },
    { icon: Crown, text: "Suporte VIP" },
  ];

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Faça login para assinar");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Erro ao iniciar checkout");
    }

    setLoading(false);
  };

  const handleManageSubscription = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Erro ao abrir portal de gerenciamento");
    }

    setLoading(false);
  };

  // Show success state for subscribers
  if (subscription?.subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-8 animate-glow">
            <Crown className="w-12 h-12 text-amber-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Você é <span className="gold-gradient-text">Premium!</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8">
            Aproveite todos os prompts exclusivos desbloqueados.
          </p>

          <div className="card-elevated p-6 text-left mb-8">
            <h3 className="font-semibold mb-4">Seus benefícios ativos:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <span>{feature.text}</span>
                    <Check size={18} className="text-emerald-500 ml-auto" />
                  </li>
                );
              })}
            </ul>
          </div>

          {subscription.subscription_end && (
            <p className="text-sm text-muted-foreground mb-6">
              Próxima renovação:{" "}
              <strong>
                {new Date(subscription.subscription_end).toLocaleDateString("pt-BR")}
              </strong>
            </p>
          )}

          <div className="flex flex-col gap-4">
            <Link
              to="/prompts"
              className="btn-primary-glow py-4 rounded-xl flex items-center justify-center gap-2 font-semibold"
            >
              <Sparkles size={20} />
              Ver Prompts Premium
            </Link>
            
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="py-3 rounded-xl border border-border bg-card hover:bg-secondary flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Gerenciar Assinatura"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription offer for non-subscribers
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-lg">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 animate-float">
            <Crown className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Desbloqueie o <span className="gold-gradient-text">Premium</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Acesso ilimitado aos melhores prompts
          </p>
        </div>

        <div className="card-elevated p-6 mb-6">
          <ul className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                  <Check size={22} className="text-emerald-500 ml-auto" />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card-elevated p-8 border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5">
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm mb-2">Assinatura mensal</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-bold gold-gradient-text">R$ 19,50</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Cancele quando quiser
            </p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Crown size={24} />
                Assinar Premium Agora
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🔒 Pagamento seguro via Stripe
          </p>
        </div>

        {!user && (
          <p className="text-center text-muted-foreground mt-6">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Faça login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Premium;
