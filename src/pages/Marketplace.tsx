import { useState, useMemo } from "react";
import { Crown, X, Maximize2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import PromptModal from "@/components/PromptModal";
import { PROMPTS, generatePromptsForCharacter, CHARACTERS } from "@/data/prompts";
import { Prompt } from "@/types";

const Marketplace = () => {
  const { subscription } = useAuth();
  const isPremium = subscription?.subscribed;
  
  const [filterCharId, setFilterCharId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate all prompts including character-specific ones
  const allPrompts = useMemo(() => {
    let prompts = [...PROMPTS];
    CHARACTERS.forEach((char, idx) => {
      const charPrompts = generatePromptsForCharacter(char, prompts.length + idx * 8);
      prompts = [...prompts, ...charPrompts];
    });
    return prompts;
  }, []);

  // Filter logic
  let displayPrompts = allPrompts;

  if (filterCharId) {
    displayPrompts = displayPrompts.filter(p => p.tags.includes(filterCharId));
  }

  if (searchTerm) {
    displayPrompts = displayPrompts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Limit for free users
  if (!isPremium) {
    displayPrompts = displayPrompts.slice(0, 12);
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 editorial-spacing">Marketplace</h2>
          <p className="text-muted-foreground">Prompts gerados automaticamente com nosso motor de câmeras aleatórias.</p>
          
          {/* Search */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar prompts..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Character Filter */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setFilterCharId(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${!filterCharId ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:border-primary'}`}
            >
              Todos
            </button>
            {CHARACTERS.map(char => (
              <button 
                key={char.id}
                onClick={() => setFilterCharId(char.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filterCharId === char.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:border-primary'}`}
              >
                {char.name}
              </button>
            ))}
          </div>

          {filterCharId && (
            <button onClick={() => setFilterCharId(null)} className="mt-4 px-4 py-2 bg-card text-primary rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto border border-border">
              Filtrando: {filterCharId} <X size={14}/>
            </button>
          )}
        </div>
        
        {!isPremium && (
          <div className="mb-8 p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl text-center">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Modo Gratuito: Visualização Limitada</p>
            <Link to="/premium" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-background rounded-lg font-bold text-xs">
              <Crown size={14} /> Upgrade para Premium
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {displayPrompts.map((p: Prompt) => (
            <div key={p.id} className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 rounded bg-muted text-[10px] uppercase font-bold text-primary">{p.category}</span>
                {p.isPremium && <Crown size={14} className="text-primary" />}
              </div>
              <h3 className="font-bold mb-2 text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {p.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-[9px] bg-background px-2 py-1 rounded text-muted-foreground whitespace-nowrap">#{t}</span>
                ))}
              </div>
              
              <button 
                onClick={() => setSelectedPrompt(p)} 
                className="w-full py-2 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center justify-center gap-2"
              >
                <Maximize2 size={12}/> Ver Prompt
              </button>
            </div>
          ))}
        </div>
        
        {displayPrompts.length === 0 && (
          <div className="text-center text-muted-foreground py-20">Nenhum prompt encontrado.</div>
        )}
      </div>

      {selectedPrompt && (
        <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </div>
  );
};

export default Marketplace;
