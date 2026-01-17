import { characters, type Character } from "@/data/characters";
import CharacterCard from "./CharacterCard";

interface CharactersViewProps {
  isPremiumUser: boolean;
  onSelectCharacter: (character: Character) => void;
}

const CharactersView = ({ isPremiumUser, onSelectCharacter }: CharactersViewProps) => {
  const freeCharacters = characters.filter((c) => !c.isPremium);
  const premiumCharacters = characters.filter((c) => c.isPremium);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Personagens</h1>
        <p className="text-muted-foreground">
          Escolha um personagem para gerar prompts personalizados
        </p>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Gratuitos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {freeCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isPremiumUser={isPremiumUser}
              onSelect={onSelectCharacter}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Premium
          {!isPremiumUser && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Desbloqueie para acessar)
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {premiumCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isPremiumUser={isPremiumUser}
              onSelect={onSelectCharacter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharactersView;
