 import { useState, useEffect } from "react";
 import { Plus, Edit2, Trash2, Save, X, Loader2, Crown, Sparkles } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 interface Character {
   id: string;
   name: string;
   age: number | null;
   country: string | null;
   hair: string | null;
   eyes: string | null;
   style: string | null;
   description: string | null;
   prompt_base: string | null;
   image_url: string | null;
   is_premium: boolean | null;
   rules: string[] | null;
 }
 
 const AdminCharacters = () => {
   const [characters, setCharacters] = useState<Character[]>([]);
   const [loading, setLoading] = useState(true);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [showNewForm, setShowNewForm] = useState(false);
   const [saving, setSaving] = useState(false);
   const [generating, setGenerating] = useState(false);
 
   const [formData, setFormData] = useState({
     name: "",
     age: "",
     country: "",
     hair: "",
     eyes: "",
     style: "",
     description: "",
     prompt_base: "",
     image_url: "",
     is_premium: false,
     rules: "",
   });
 
   useEffect(() => {
     fetchCharacters();
   }, []);
 
   const fetchCharacters = async () => {
     const { data, error } = await supabase
       .from("characters")
       .select("*")
       .order("created_at", { ascending: false });
 
     if (error) {
       toast.error("Erro ao carregar personagens");
       console.error(error);
     } else {
       setCharacters(data || []);
     }
     setLoading(false);
   };
 
   const handleGenerateWithAI = async () => {
     if (!formData.name) {
       toast.error("Digite pelo menos o nome do personagem");
       return;
     }
 
     setGenerating(true);
     try {
       const systemPrompt = `Você é um especialista em criar personagens detalhados para geração de imagens com IA.
 Crie um personagem completo baseado nas informações fornecidas.
 Responda em JSON com os campos: age (number), country, hair, eyes, style, description, prompt_base, rules (array de strings).
 O prompt_base deve ser em inglês e detalhado para geração de imagens.
 As rules devem ser regras de consistência para manter o personagem igual em diferentes gerações.`;
 
       const { data, error } = await supabase.functions.invoke('openrouter-ai', {
         body: { 
           type: 'character',
           message: `Crie um personagem chamado "${formData.name}". ${formData.description || ''}`,
           systemPrompt
         }
       });
 
       if (error) throw error;
 
       try {
         const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
           const generated = JSON.parse(jsonMatch[0]);
           setFormData(prev => ({
             ...prev,
             age: generated.age?.toString() || prev.age,
             country: generated.country || prev.country,
             hair: generated.hair || prev.hair,
             eyes: generated.eyes || prev.eyes,
             style: generated.style || prev.style,
             description: generated.description || prev.description,
             prompt_base: generated.prompt_base || prev.prompt_base,
             rules: Array.isArray(generated.rules) ? generated.rules.join('\n') : prev.rules,
           }));
           toast.success("Personagem gerado com IA!");
         }
       } catch {
         toast.error("Erro ao processar resposta da IA");
       }
     } catch (error) {
       console.error('AI generation error:', error);
       toast.error("Erro ao gerar com IA");
     } finally {
       setGenerating(false);
     }
   };
 
   const handleCreate = async () => {
     if (!formData.name) {
       toast.error("Nome é obrigatório");
       return;
     }
 
     setSaving(true);
     const { data, error } = await supabase
       .from("characters")
       .insert([{
         name: formData.name,
         age: formData.age ? parseInt(formData.age) : null,
         country: formData.country || null,
         hair: formData.hair || null,
         eyes: formData.eyes || null,
         style: formData.style || null,
         description: formData.description || null,
         prompt_base: formData.prompt_base || null,
         image_url: formData.image_url || null,
         is_premium: formData.is_premium,
         rules: formData.rules ? formData.rules.split('\n').filter(r => r.trim()) : null,
       }])
       .select()
       .single();
 
     if (error) {
       toast.error("Erro ao criar personagem");
       console.error(error);
     } else {
       toast.success("Personagem criado!");
       setCharacters([data, ...characters]);
       setShowNewForm(false);
       resetForm();
     }
     setSaving(false);
   };
 
   const handleUpdate = async (id: string) => {
     setSaving(true);
     const { error } = await supabase
       .from("characters")
       .update({
         name: formData.name,
         age: formData.age ? parseInt(formData.age) : null,
         country: formData.country || null,
         hair: formData.hair || null,
         eyes: formData.eyes || null,
         style: formData.style || null,
         description: formData.description || null,
         prompt_base: formData.prompt_base || null,
         image_url: formData.image_url || null,
         is_premium: formData.is_premium,
         rules: formData.rules ? formData.rules.split('\n').filter(r => r.trim()) : null,
       })
       .eq("id", id);
 
     if (error) {
       toast.error("Erro ao atualizar personagem");
       console.error(error);
     } else {
       toast.success("Personagem atualizado!");
       fetchCharacters();
       setEditingId(null);
       resetForm();
     }
     setSaving(false);
   };
 
   const handleDelete = async (id: string) => {
     if (!confirm("Tem certeza que deseja excluir este personagem?")) return;
 
     const { error } = await supabase.from("characters").delete().eq("id", id);
 
     if (error) {
       toast.error("Erro ao excluir personagem");
     } else {
       toast.success("Personagem excluído!");
       setCharacters(characters.filter(c => c.id !== id));
     }
   };
 
   const startEdit = (character: Character) => {
     setEditingId(character.id);
     setFormData({
       name: character.name,
       age: character.age?.toString() || "",
       country: character.country || "",
       hair: character.hair || "",
       eyes: character.eyes || "",
       style: character.style || "",
       description: character.description || "",
       prompt_base: character.prompt_base || "",
       image_url: character.image_url || "",
       is_premium: character.is_premium || false,
       rules: character.rules?.join('\n') || "",
     });
   };
 
   const resetForm = () => {
     setFormData({
       name: "", age: "", country: "", hair: "", eyes: "",
       style: "", description: "", prompt_base: "", image_url: "",
       is_premium: false, rules: "",
     });
   };
 
   const CharacterForm = ({ isNew = false, characterId = "" }) => (
     <div className="card-elevated p-6 space-y-4">
       <div className="flex items-center justify-between">
         <h3 className="font-semibold text-lg">
           {isNew ? "Novo Personagem" : "Editar Personagem"}
         </h3>
         <button
           onClick={handleGenerateWithAI}
           disabled={generating}
           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-50"
         >
           {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
           Gerar com IA
         </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <input
           type="text"
           value={formData.name}
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
           placeholder="Nome"
           className="input-dark"
         />
         <input
           type="number"
           value={formData.age}
           onChange={(e) => setFormData({ ...formData, age: e.target.value })}
           placeholder="Idade"
           className="input-dark"
         />
         <input
           type="text"
           value={formData.country}
           onChange={(e) => setFormData({ ...formData, country: e.target.value })}
           placeholder="País"
           className="input-dark"
         />
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <input
           type="text"
           value={formData.hair}
           onChange={(e) => setFormData({ ...formData, hair: e.target.value })}
           placeholder="Cabelo"
           className="input-dark"
         />
         <input
           type="text"
           value={formData.eyes}
           onChange={(e) => setFormData({ ...formData, eyes: e.target.value })}
           placeholder="Olhos"
           className="input-dark"
         />
         <input
           type="text"
           value={formData.style}
           onChange={(e) => setFormData({ ...formData, style: e.target.value })}
           placeholder="Estilo"
           className="input-dark"
         />
       </div>
 
       <textarea
         value={formData.description}
         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
         placeholder="Descrição"
         className="input-dark w-full min-h-[80px]"
       />
 
       <textarea
         value={formData.prompt_base}
         onChange={(e) => setFormData({ ...formData, prompt_base: e.target.value })}
         placeholder="Prompt Base (em inglês para geração de imagens)"
         className="input-dark w-full min-h-[100px]"
       />
 
       <input
         type="url"
         value={formData.image_url}
         onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
         placeholder="URL da Imagem"
         className="input-dark w-full"
       />
 
       <textarea
         value={formData.rules}
         onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
         placeholder="Regras de consistência (uma por linha)"
         className="input-dark w-full min-h-[80px]"
       />
 
       <div className="flex items-center gap-3">
         <input
           type="checkbox"
           id={`premium-${characterId || 'new'}`}
           checked={formData.is_premium}
           onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
           className="w-5 h-5 rounded border-border bg-input accent-primary"
         />
         <label htmlFor={`premium-${characterId || 'new'}`} className="flex items-center gap-2">
           <Crown size={18} className="text-amber-500" />
           Personagem Premium
         </label>
       </div>
 
       <div className="flex gap-3">
         <button
           onClick={isNew ? handleCreate : () => handleUpdate(characterId)}
           disabled={saving}
           className="btn-primary-glow px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
         >
           {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
           Salvar
         </button>
         <button
           onClick={() => { setEditingId(null); setShowNewForm(false); resetForm(); }}
           className="px-6 py-2 rounded-lg border border-border hover:bg-secondary flex items-center gap-2"
         >
           <X size={18} />
           Cancelar
         </button>
       </div>
     </div>
   );
 
   if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <Loader2 className="animate-spin" size={40} />
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-bold">Personagens</h1>
           <p className="text-muted-foreground">Gerenciar personas para geração de imagens</p>
         </div>
         
         {!showNewForm && (
           <button
             onClick={() => setShowNewForm(true)}
             className="btn-primary-glow px-4 py-2 rounded-lg flex items-center gap-2"
           >
             <Plus size={20} />
             Novo Personagem
           </button>
         )}
       </div>
 
       {showNewForm && <CharacterForm isNew />}
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {characters.map((character) => (
           <div key={character.id}>
             {editingId === character.id ? (
               <CharacterForm characterId={character.id} />
             ) : (
               <div className="card-elevated p-4">
                 {character.image_url && (
                   <img 
                     src={character.image_url} 
                     alt={character.name}
                     className="w-full h-48 object-cover rounded-lg mb-4"
                   />
                 )}
                 <div className="flex items-center gap-2 mb-2">
                   <h3 className="font-semibold text-lg">{character.name}</h3>
                   {character.is_premium && (
                     <Crown size={16} className="text-amber-500" />
                   )}
                 </div>
                 {character.description && (
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                     {character.description}
                   </p>
                 )}
                 <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                   {character.age && <span>Idade: {character.age}</span>}
                   {character.country && <span>• {character.country}</span>}
                 </div>
                 <div className="flex gap-2">
                   <button
                     onClick={() => startEdit(character)}
                     className="flex-1 p-2 rounded-lg hover:bg-primary/20 text-primary flex items-center justify-center gap-2"
                   >
                     <Edit2 size={16} />
                     Editar
                   </button>
                   <button
                     onClick={() => handleDelete(character.id)}
                     className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 export default AdminCharacters;