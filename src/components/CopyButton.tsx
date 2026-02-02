import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton = ({ text, label = "Copiar" }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all w-full shadow-sm border
        ${copied 
          ? 'bg-green-900/50 border-green-800 text-green-200' 
          : 'bg-card border-border text-foreground hover:border-primary'}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copiado' : label}
    </button>
  );
};

export default CopyButton;
