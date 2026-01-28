import { useState, useEffect } from "react";
import { Copy, Check, Lock, Crown, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Prompt {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prompt_text: string;
  is_premium: boolean;
  category: string | null;
}

const Prompts = () => {
  const { user, subscription } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const isPremiumUser = subscription?.subscribed;

  useEffect(() => {
    fetchPrompts();
  }, [user, isPremiumUser]);

  const fetchPrompts = async () => {
    setLoading(true);
    
    // Fetch free prompts (always available)
    const { data: freePrompts, error: freeError } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_premium", false)
      .order("created_at", { ascending: false });

    if (freeError) {
      console.error("Error fetching free prompts:", freeError);
      toast.error("Erro ao carregar prompts");
      setLoading(false);
      return;
    }

    let allPrompts: Prompt[] = freePrompts || [];

    // If user is premium, also fetch premium prompts
    if (isPremiumUser) {
      const { data: premiumPrompts, error: premiumError } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_premium", true)
        .order("created_at", { ascending: false });

      if (!premiumError && premiumPrompts) {
        allPrompts = [...allPrompts, ...premiumPrompts];
      }
    } else {
      // For non-premium users, show premium prompts as locked (without prompt_text)
      const { data: premiumPrompts } = await supabase
        .from("prompts")
        .select("id, title, description, image_url, is_premium, category")
        .eq("is_premium", true);

      if (premiumPrompts) {
        const lockedPrompts = premiumPrompts.map(p => ({
          ...p,
          prompt_text: "🔒 Conteúdo Premium - Assine para desbloquear"
        }));
        allPrompts = [...allPrompts, ...lockedPrompts];
      }
    }

    setPrompts(allPrompts);
    setLoading(false);
  };

  const copyToClipboard = async (prompt: Prompt) => {
    if (prompt.is_premium && !isPremiumUser) {
      toast.error("Conteúdo Premium", {
        description: "Assine para acessar este prompt",
      });
      return;
    }

    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopiedId(prompt.id);
    toast.success("Prompt copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ["todos", ...new Set(prompts.map(p => p.category).filter(Boolean))];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const freePrompts = filteredPrompts.filter(p => !p.is_premium);
  const premiumPrompts = filteredPrompts.filter(p => p.is_premium);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Biblioteca de <span className="purple-gradient-text">Prompts</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Encontre o prompt perfeito para suas criações
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar prompts..."
              className="input-dark w-full pl-12"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-dark min-w-[180px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "todos" ? "Todas categorias" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Free Prompts Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            Prompts Gratuitos
            <span className="text-sm font-normal text-muted-foreground">
              ({freePrompts.length} disponíveis)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freePrompts.map((prompt) => (
              <div key={prompt.id} className="prompt-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{prompt.title}</h3>
                </div>
                {prompt.description && (
                  <p className="text-muted-foreground text-sm mb-4">{prompt.description}</p>
                )}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-foreground line-clamp-3">{prompt.prompt_text}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(prompt)}
                  className="w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check size={18} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copiar Prompt
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Prompts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Crown className="text-amber-500" size={28} />
              <span className="gold-gradient-text">Prompts Premium</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({premiumPrompts.length} disponíveis)
              </span>
            </h2>
            
            {!isPremiumUser && (
              <Link
                to="/premium"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Assinar Premium
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumPrompts.map((prompt) => (
              <div 
                key={prompt.id} 
                className={`prompt-card relative ${!isPremiumUser ? 'opacity-80' : ''}`}
              >
                {!isPremiumUser && (
                  <div className="absolute top-3 right-3">
                    <Lock className="text-amber-500" size={20} />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{prompt.title}</h3>
                  <span className="premium-badge">Premium</span>
                </div>
                {prompt.description && (
                  <p className="text-muted-foreground text-sm mb-4">{prompt.description}</p>
                )}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className={`text-sm ${isPremiumUser ? 'text-foreground' : 'text-muted-foreground italic'} line-clamp-3`}>
                    {isPremiumUser ? prompt.prompt_text : "🔒 Assine para ver este prompt"}
                  </p>
                </div>
                {isPremiumUser ? (
                  <button
                    onClick={() => copyToClipboard(prompt)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-500 flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check size={18} />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copiar Prompt
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/premium"
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Crown size={18} />
                    Desbloquear
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Prompts;
