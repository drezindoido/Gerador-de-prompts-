import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CharactersView from "@/components/CharactersView";
import GeneratorView from "@/components/GeneratorView";
import PromptsView from "@/components/PromptsView";
import PremiumView from "@/components/PremiumView";
import type { Character } from "@/data/characters";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("characters");
  const [isPremium, setIsPremium] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setActiveTab("generator");
    toast.success(`${character.name} selecionada!`);
  };

  const handleActivatePremium = () => {
    setIsPremium(true);
    toast.success("🎉 Premium ativado com sucesso!", {
      description: "Todos os personagens estão desbloqueados!",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "characters":
        return (
          <CharactersView
            isPremiumUser={isPremium}
            onSelectCharacter={handleSelectCharacter}
          />
        );
      case "generator":
        return (
          <GeneratorView
            isPremiumUser={isPremium}
            selectedCharacter={selectedCharacter}
          />
        );
      case "prompts":
        return <PromptsView />;
      case "premium":
        return (
          <PremiumView
            isPremiumUser={isPremium}
            onActivate={handleActivatePremium}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPremium={isPremium}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
