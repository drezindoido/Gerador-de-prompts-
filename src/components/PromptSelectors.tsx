import { EXPRESSIONS_DATABASE, LIGHTING_DATABASE, CELEBRITY_ENCOUNTERS } from "@/data/prompts";

interface Props {
  onSelect: (value: string) => void;
}

export const PromptSelectors = ({ onSelect }: Props) => {
  return (
    <div className="space-y-4 my-4">
      {/* Seleção de Expressão */}
      <div>
        <label className="text-xs font-bold text-primary uppercase">Expressão Facial</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXPRESSIONS_DATABASE.map((exp) => (
            <button
              key={exp}
              onClick={() => onSelect(exp.split(':')[0])}
              className="px-3 py-1 text-xs bg-muted border border-border rounded-full hover:border-primary transition-colors"
            >
              {exp.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Seleção de Iluminação */}
      <div>
        <label className="text-xs font-bold text-primary uppercase">Iluminação</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {LIGHTING_DATABASE.map((light) => (
            <button
              key={light}
              onClick={() => onSelect(light.split(':')[0])}
              className="px-3 py-1 text-xs bg-muted border border-border rounded-full hover:border-primary transition-colors"
            >
              {light.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Seleção de Famosos */}
      <div>
        <label className="text-xs font-bold text-primary uppercase">Encontro com Famosos</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {CELEBRITY_ENCOUNTERS.map((celeb) => (
            <button
              key={celeb}
              onClick={() => onSelect(celeb)}
              className="px-3 py-1 text-xs bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 text-primary transition-all"
            >
              📸 {celeb.split('with ')[1]?.split(' on')[0] || celeb}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

