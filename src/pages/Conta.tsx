import { useState } from "react";
import { User, Crown, LogOut, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const Conta = () => {
  const { user, subscription, signOut, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da conta");
    navigate("/");
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

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    await checkSubscription();
    toast.success("Status atualizado!");
    setRefreshing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Faça login para acessar sua conta
          </p>
          <Link
            to="/login"
            className="btn-primary-glow px-6 py-3 rounded-lg inline-block"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>

        {/* Profile Card */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="text-primary" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.email}</h2>
              <p className="text-muted-foreground text-sm">
                Membro desde{" "}
                {new Date(user.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Crown
                className={subscription?.subscribed ? "text-amber-500" : "text-muted-foreground"}
                size={22}
              />
              Status da Assinatura
            </h3>
            <button
              onClick={handleRefreshSubscription}
              disabled={refreshing}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>

          {subscription?.subscribed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-sm font-medium">
                  Ativo
                </span>
                <span className="gold-gradient-text font-semibold">Premium</span>
              </div>
              
              {subscription.subscription_end && (
                <p className="text-muted-foreground text-sm">
                  Próxima renovação:{" "}
                  <strong className="text-foreground">
                    {new Date(subscription.subscription_end).toLocaleDateString("pt-BR")}
                  </strong>
                </p>
              )}

              <button
                onClick={handleManageSubscription}
                disabled={loading}
                className="w-full py-3 rounded-lg border border-border bg-card hover:bg-secondary flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Gerenciar Assinatura"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                  Inativo
                </span>
                <span className="text-muted-foreground">Plano Gratuito</span>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Assine o Premium para acessar todos os prompts exclusivos
              </p>

              <Link
                to="/premium"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Crown size={20} />
                Assinar Premium
              </Link>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-4 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default Conta;
