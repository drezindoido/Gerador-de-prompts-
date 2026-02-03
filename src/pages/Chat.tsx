import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Trash2, Sparkles, ArrowLeft, Image, Lightbulb, Instagram, Video, Package, RefreshCw, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface IdeaCard {
  icon: React.ReactNode;
  title: string;
  prompt: string;
  color: string;
}

const ideaCards: IdeaCard[] = [
  {
    icon: <Image size={24} />,
    title: "Gerar prompt de imagem",
    prompt: "Crie um prompt detalhado para gerar uma imagem com IA. Quero algo criativo e único.",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: <Users size={24} />,
    title: "Criar influenciador IA",
    prompt: "Me ajude a criar um perfil completo de influenciador virtual IA, incluindo nome, personalidade, nicho e estilo visual.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <Instagram size={24} />,
    title: "Legenda para Instagram",
    prompt: "Crie uma legenda criativa e envolvente para um post no Instagram sobre meu conteúdo.",
    color: "from-pink-500/20 to-orange-500/20"
  },
  {
    icon: <Video size={24} />,
    title: "Prompt para vídeo",
    prompt: "Gere um prompt detalhado para criar um vídeo com IA, incluindo cenas, transições e estilo.",
    color: "from-red-500/20 to-yellow-500/20"
  },
  {
    icon: <Package size={24} />,
    title: "Prompt de produto",
    prompt: "Crie um prompt profissional para fotografar um produto com IA, focando em iluminação e composição.",
    color: "from-green-500/20 to-teal-500/20"
  },
  {
    icon: <RefreshCw size={24} />,
    title: "Reescrever prompt",
    prompt: "Preciso que você melhore e reescreva um prompt que já tenho. Vou te enviar o prompt original.",
    color: "from-indigo-500/20 to-purple-500/20"
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Perfil de personagem",
    prompt: "Me ajude a criar um perfil completo de personagem para geração de imagens consistentes com IA.",
    color: "from-amber-500/20 to-orange-500/20"
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setShowHome(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt', {
        body: { 
          action: 'chat',
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          context: 'Assistente de prompts especializado em geração de conteúdo criativo'
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setShowHome(true);
    toast.success("Conversa limpa!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <Bot size={22} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">KAIZEN AI</h1>
                <p className="text-xs text-muted-foreground">Assistente de Prompts</p>
              </div>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {showHome && messages.length === 0 ? (
          /* Home with Idea Cards */
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-xs font-bold tracking-widest text-primary uppercase mb-4">
                <Sparkles size={14} />
                Powered by AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Como posso ajudar?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Escolha uma ideia abaixo ou digite sua própria mensagem para começar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideaCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleIdeaClick(card.prompt)}
                  className={`group p-6 rounded-2xl bg-gradient-to-br ${card.color} border border-border hover:border-primary/50 transition-all text-left hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10`}
                >
                  <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{card.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-to-br from-primary to-purple-600 text-primary-foreground'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-md' 
                      : 'bg-card border border-border rounded-tl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Bot size={20} className="text-primary-foreground" />
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-0 p-4 border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Digite sua mensagem..."
                className="w-full bg-card border border-border rounded-xl px-5 py-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            KAIZEN AI pode cometer erros. Verifique as informações importantes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Chat;
