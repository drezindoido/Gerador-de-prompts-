import { Lightbulb, MessageSquare, Wand2, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "1. Escolha o Tipo",
    description: "Selecione entre personagens, prompts de imagem ou histórias"
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "2. Personalize",
    description: "Ajuste estilo, câmera, iluminação e detalhes do seu prompt"
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "3. Gere com IA",
    description: "Nossa IA cria prompts otimizados para máxima qualidade"
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "4. Use e Crie",
    description: "Copie e use no DALL-E, Midjourney, FLUX ou seu gerador favorito"
  }
];

const HomeHowToUse = () => {
  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Como Usar
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Em 4 passos simples, você cria prompts profissionais para qualquer gerador de imagens
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="relative bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border group-hover:bg-primary/50 transition-colors" />
            )}
            
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {step.icon}
            </div>
            <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link 
          to="/como-usar"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Ver tutorial completo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default HomeHowToUse;
