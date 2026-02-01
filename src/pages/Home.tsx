import { ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, subscription } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="warm-gradient-text">KAIZEN</span>
              <span className="text-foreground"> PROMPTS</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Prompts profissionais para criação de <strong className="text-foreground">imagens</strong> e{" "}
            <strong className="text-foreground">vídeos</strong> com IA
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/prompts"
              className="btn-primary-glow px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all hover:scale-105"
            >
              <Zap size={24} />
              Ver Prompts
              <ArrowRight size={20} />
            </Link>

            {!user && (
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl border border-border bg-card hover:bg-secondary flex items-center justify-center gap-3 text-lg font-semibold transition-all"
              >
                Entrar
              </Link>
            )}

            {user && !subscription?.subscribed && (
              <Link
                to="/premium"
                className="px-8 py-4 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 flex items-center justify-center gap-3 text-lg font-semibold transition-all"
              >
                <Crown size={24} className="text-amber-500" />
                <span className="gold-gradient-text">Assinar Premium</span>
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="card-elevated p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Prompts Otimizados</h3>
              <p className="text-muted-foreground text-sm">
                Prompts testados e otimizados para melhores resultados
              </p>
            </div>

            <div className="card-elevated p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fácil de Usar</h3>
              <p className="text-muted-foreground text-sm">
                Copie e cole direto nas suas ferramentas de IA favoritas
              </p>
            </div>

            <div className="card-elevated p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Crown className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Biblioteca Premium</h3>
              <p className="text-muted-foreground text-sm">
                Acesso exclusivo aos melhores prompts do mercado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 Kaizen Prompts. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;
