import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";
// Importamos as APIs do seu novo serviço
import { generateStory } from "@/lib/ai-service"; 

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o KAIZEN, seu assistente de prompts. Como posso ajudar você a criar imagens incríveis com o Groq e DeepSeek hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Chamamos a função do ai-service que usa as suas chaves sk-or... e gsk_...
      // Aqui passamos o histórico para a IA ter contexto
      const chatContext = messages.map(m => `${m.role}: ${m.content}`).join("\n");
      const response = await generateStory(`Histórico do chat:\n${chatContext}\nUsuário: ${input}\nResponda como o assistente especializado KAIZEN.`);

      if (!response) throw new Error("Sem resposta da API");

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Erro ao conectar com Groq/OpenRouter. Verifique o ai-service.ts");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 shadow-primary/20"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">KAIZEN AI</h3>
            <p className="text-xs text-muted-foreground">Powered by Groq & DeepSeek</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full shrink-0 h-fit ${
              msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-md' 
                : 'bg-muted text-foreground rounded-bl-md'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="p-2 rounded-full bg-muted text-muted-foreground">
              <Bot size={16} />
            </div>
            <div className="bg-muted p-4 rounded-2xl rounded-bl-md">
              <Loader2 size={16} className="animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Peça um prompt ou tire dúvidas..."
            className="flex-1 bg-muted border-0 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
