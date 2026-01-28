import { ExternalLink, Copy, Check, Sparkles, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ComoUsar = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyExample = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Exemplo copiado!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const grokSteps = [
    {
      step: 1,
      title: "Acesse o GROK",
      description: "Vá para x.com/i/grok ou acesse diretamente pelo X (Twitter)",
      link: "https://x.com/i/grok"
    },
    {
      step: 2,
      title: "Ative o modo de geração de imagens",
      description: "No chat, clique no ícone de imagem ou digite 'gerar imagem de'"
    },
    {
      step: 3,
      title: "Cole seu prompt",
      description: "Copie um prompt da nossa biblioteca e cole diretamente no chat"
    },
    {
      step: 4,
      title: "Aguarde a geração",
      description: "O GROK irá processar e gerar sua imagem em segundos"
    }
  ];

  const metaSteps = [
    {
      step: 1,
      title: "Acesse o Meta AI",
      description: "Vá para meta.ai ou use através do WhatsApp/Instagram/Messenger",
      link: "https://meta.ai"
    },
    {
      step: 2,
      title: "Inicie a conversa",
      description: "Digite 'imagine' ou 'criar imagem de' para ativar o modo de geração"
    },
    {
      step: 3,
      title: "Cole seu prompt",
      description: "Use um prompt da nossa biblioteca para melhores resultados"
    },
    {
      step: 4,
      title: "Refine se necessário",
      description: "Você pode pedir ajustes na imagem gerada"
    }
  ];

  const examplePrompts = [
    {
      title: "Retrato Profissional",
      prompt: "Professional headshot portrait, studio lighting, neutral background, sharp focus, high resolution"
    },
    {
      title: "Paisagem Épica",
      prompt: "Cinematic landscape photography, golden hour lighting, dramatic clouds, vibrant colors"
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Como <span className="purple-gradient-text">Usar</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprenda a usar nossos prompts nas principais ferramentas de IA para criar imagens incríveis
          </p>
        </div>

        {/* GROK Tutorial */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">X</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tutorial GROK</h2>
              <p className="text-muted-foreground">Geração de imagens com IA do X</p>
            </div>
          </div>

          <div className="grid gap-4">
            {grokSteps.map((item, index) => (
              <div key={index} className="card-elevated p-6 flex gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                    >
                      Acessar <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* META AI Tutorial */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
              <MessageSquare className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tutorial META AI</h2>
              <p className="text-muted-foreground">Use no WhatsApp, Instagram e Messenger</p>
            </div>
          </div>

          <div className="grid gap-4">
            {metaSteps.map((item, index) => (
              <div key={index} className="card-elevated p-6 flex gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                    >
                      Acessar <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example Prompts */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="text-primary" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Exemplos Rápidos</h2>
              <p className="text-muted-foreground">Copie e teste agora mesmo</p>
            </div>
          </div>

          <div className="grid gap-4">
            {examplePrompts.map((item, index) => (
              <div key={index} className="card-elevated p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <button
                    onClick={() => copyExample(item.prompt, index)}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={16} />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mt-16">
          <div className="card-elevated p-8 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="text-primary" size={24} />
              Dicas para Melhores Resultados
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Check className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>Use prompts em inglês para resultados mais precisos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>Adicione detalhes específicos como iluminação e estilo</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>Experimente diferentes variações do mesmo prompt</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>Combine elementos de diferentes prompts para resultados únicos</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComoUsar;
