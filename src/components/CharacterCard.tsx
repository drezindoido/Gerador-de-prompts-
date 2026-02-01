import { Lock } from "lucide-react";
import type { Character } from "@/data/characters";

interface CharacterCardProps {
  character: Character;
  isPremiumUser: boolean;
  onSelect: (character: Character) => void;
}

const CharacterCard = ({ character, isPremiumUser, onSelect }: CharacterCardProps) => {
  const isLocked = character.isPremium && !isPremiumUser;

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getGradient = (id: string) => {
    const gradients = [
      "from-rose-500 to-pink-600",
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-red-500 to-rose-600",
      "from-indigo-500 to-blue-600",
      "from-fuchsia-500 to-pink-600",
    ];
    const index = parseInt(id) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      onClick={() => !isLocked && onSelect(character)}
      className={`card-elevated p-4 relative group ${
        isLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {character.isPremium && (
        <div className="absolute top-3 right-3">
          <span className="premium-badge">VIP</span>
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Premium Only</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradient(character.id)} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
        >
          <span className="text-lg font-bold text-white">
            {getInitials(character.name)}
          </span>
        </div>

        <h3 className="font-display font-semibold text-foreground mb-1">
          {character.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          {character.age} anos • {character.country}
        </p>
        
        <p className="text-xs text-muted-foreground/80 line-clamp-2">
          {character.desc}
        </p>
      </div>
    </div>
  );
};

export default CharacterCard;
