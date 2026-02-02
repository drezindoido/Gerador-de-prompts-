import { useState } from "react";
import { Plus, Lock, Dices, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CHARACTERS, generateRandomCharacter } from "@/data/prompts";
import { Character } from "@/types";

const Characters = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();
  const isPremium = subscription?.subscribed;
  
  const [characters] = useState<Character[]>(CHARACTERS);
  const [newChar, setNewChar] = useState({ name: '', age: 24, country: '', hair: '', eyes: '', desc: '', style: 'UGC' });

  const handleRandomize = () => {
    const random = generateRandomCharacter();
    setNewChar({ ...random, desc: random.desc });
  };

  const handleSubmit = () => {
    if (!isPremium) return;
    if (!newChar.name || !newChar.desc) return;
    // In a real implementation, this would save to database
    navigate('/marketplace');
  };

  const handleSelectCharacter = (id: string) => {
    navigate(`/marketplace?char=${id}`);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 editorial-spacing">Character Lab</h1>
        <p className="text-muted-foreground mb-12">Crie, modifique e armazene personas digitais para seus prompts.</p>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Create New Character */}
          <div className="lg:col-span-1 bg-card border border-border p-8 rounded-3xl relative overflow-hidden">
            {!isPremium && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Lock size={32} className="text-primary mb-4" />
                <Link to="/premium" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px]">
                  Upgrade to Pro
                </Link>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                <Plus size={14}/> Criar Novo
              </h3>
              <button 
                onClick={handleRandomize} 
                className="text-foreground hover:text-primary p-2 rounded-lg border border-border hover:bg-muted transition-colors" 
                title="Gerar Aleatório"
              >
                <Dices size={16}/>
              </button>
            </div>
            
            <div className="space-y-4">
              <input 
                className="w-full p-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground" 
                placeholder="Nome (ex: Elara)" 
                value={newChar.name} 
                onChange={e => setNewChar({...newChar, name: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="p-3 bg-background border border-border rounded-xl text-sm text-foreground" 
                  placeholder="Idade" 
                  type="number" 
                  value={newChar.age} 
                  onChange={e => setNewChar({...newChar, age: parseInt(e.target.value)})} 
                />
                <input 
                  className="p-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground" 
                  placeholder="País" 
                  value={newChar.country} 
                  onChange={e => setNewChar({...newChar, country: e.target.value})} 
                />
              </div>
              <input 
                className="w-full p-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground" 
                placeholder="Cabelo" 
                value={newChar.hair} 
                onChange={e => setNewChar({...newChar, hair: e.target.value})} 
              />
              <input 
                className="w-full p-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground" 
                placeholder="Olhos" 
                value={newChar.eyes} 
                onChange={e => setNewChar({...newChar, eyes: e.target.value})} 
              />
              <textarea 
                className="w-full p-3 bg-background border border-border rounded-xl text-sm h-24 text-foreground placeholder-muted-foreground" 
                placeholder="Descrição detalhada do corpo e rosto..." 
                value={newChar.desc} 
                onChange={e => setNewChar({...newChar, desc: e.target.value})} 
              />
              <button 
                onClick={handleSubmit} 
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl uppercase tracking-widest text-xs hover:opacity-90"
              >
                Salvar & Gerar Prompts
              </button>
            </div>
          </div>

          {/* Character Grid */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {characters.map(char => (
              <div 
                key={char.id} 
                onClick={() => handleSelectCharacter(char.id)} 
                className="bg-background border border-border rounded-2xl p-6 hover:border-primary transition-all group cursor-pointer relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-primary" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-foreground">{char.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-card px-2 py-1 rounded">{char.country}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{char.desc}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{char.age} anos</span> • <span>{char.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;
