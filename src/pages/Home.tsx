import { ArrowRight, Sparkles, Settings2, User, Camera, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, subscription } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-[10px] font-bold tracking-widest text-primary uppercase mb-8 shadow-xl shadow-black/20 border border-border">
            <Sparkles size={14} />
            O Motor de Realismo IA
          </div>
          <h1 className="text-6xl md:text-[8rem] font-bold text-foreground mb-8 editorial-spacing tracking-tighter leading-none">
            Cru. Real. <br />
            <span className="text-muted-foreground">DNA UGC.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-12 leading-relaxed font-light">
            Consistência projetada para a próxima geração de conteúdo IA. Crie saídas de personagens 100% consistentes com nosso gerador de ponta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/gerador" 
              className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-2"
            >
              <Settings2 size={18} /> Abrir Gerador
            </Link>
            <Link 
              to="/marketplace" 
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-border text-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:border-primary hover:bg-card transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Explorar Biblioteca <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 py-20 border-t border-border">
        {[
          { icon: <User />, title: "Personagens Custom", desc: "Crie e salve seus próprios modelos digitais no Character Lab (Pro)." },
          { icon: <Camera />, title: "100+ Câmeras", desc: "Banco de dados massivo com estilos reais, de Arri Alexa a Polaroid." },
          { icon: <Monitor />, title: "Multi-Motor", desc: "Otimizado para DALL-E 3, Midjourney v6 e FLUX." }
        ].map((item, i) => (
          <div key={i} className="p-10 bg-card rounded-[2.5rem] border border-border hover:shadow-xl hover:shadow-black/20 transition-all group hover:border-primary">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 Kaizen Prompts. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;
