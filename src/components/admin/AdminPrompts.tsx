 import { useState, useEffect } from "react";
 import { Plus, Edit2, Trash2, Save, X, Loader2, Crown } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 interface Prompt {
   id: string;
   title: string;
   description: string | null;
   image_url: string | null;
   prompt_text: string;
   is_premium: boolean | null;
   category: string | null;
 }
 
 const AdminPrompts = () => {
   const [prompts, setPrompts] = useState<Prompt[]>([]);
   const [loading, setLoading] = useState(true);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [showNewForm, setShowNewForm] = useState(false);
   const [saving, setSaving] = useState(false);
 
   const [formData, setFormData] = useState({
     title: "",
     description: "",
     image_url: "",
     prompt_text: "",
     is_premium: false,
     category: "geral"
   });
 
   useEffect(() => {
     fetchPrompts();
   }, []);
 
   const fetchPrompts = async () => {
     const { data, error } = await supabase
       .from("prompts")
       .select("*")
       .order("created_at", { ascending: false });
 
     if (error) {
       toast.error("Erro ao carregar prompts");
       console.error(error);
     } else {
       setPrompts(data || []);
     }
     setLoading(false);
   };
 
   const handleCreate = async () => {
     if (!formData.title || !formData.prompt_text) {
       toast.error("Título e prompt são obrigatórios");
       return;
     }
 
     setSaving(true);
     const { data, error } = await supabase
       .from("prompts")
       .insert([{
         title: formData.title,
         description: formData.description || null,
         image_url: formData.image_url || null,
         prompt_text: formData.prompt_text,
         is_premium: formData.is_premium,
         category: formData.category
       }])
       .select()
       .single();
 
     if (error) {
       toast.error("Erro ao criar prompt");
       console.error(error);
     } else {
       toast.success("Prompt criado!");
       setPrompts([data, ...prompts]);
       setShowNewForm(false);
       resetForm();
     }
     setSaving(false);
   };
 
   const handleUpdate = async (id: string) => {
     setSaving(true);
     const { error } = await supabase
       .from("prompts")
       .update({
         title: formData.title,
         description: formData.description || null,
         image_url: formData.image_url || null,
         prompt_text: formData.prompt_text,
         is_premium: formData.is_premium,
         category: formData.category
       })
       .eq("id", id);
 
     if (error) {
       toast.error("Erro ao atualizar prompt");
     } else {
       toast.success("Prompt atualizado!");
       fetchPrompts();
       setEditingId(null);
       resetForm();
     }
     setSaving(false);
   };
 
   const handleDelete = async (id: string) => {
     if (!confirm("Tem certeza?")) return;
 
     const { error } = await supabase.from("prompts").delete().eq("id", id);
     if (error) {
       toast.error("Erro ao excluir");
     } else {
       toast.success("Prompt excluído!");
       setPrompts(prompts.filter(p => p.id !== id));
     }
   };
 
   const startEdit = (prompt: Prompt) => {
     setEditingId(prompt.id);
     setFormData({
       title: prompt.title,
       description: prompt.description || "",
       image_url: prompt.image_url || "",
       prompt_text: prompt.prompt_text,
       is_premium: prompt.is_premium || false,
       category: prompt.category || "geral"
     });
   };
 
   const resetForm = () => {
     setFormData({
       title: "", description: "", image_url: "",
       prompt_text: "", is_premium: false, category: "geral"
     });
   };
 
   const PromptForm = ({ isNew = false, promptId = "" }) => (
     <div className="card-elevated p-6 space-y-4">
       <h3 className="font-semibold text-lg">{isNew ? "Novo Prompt" : "Editar Prompt"}</h3>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <input
           type="text"
           value={formData.title}
           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
           placeholder="Título"
           className="input-dark"
         />
         <select
           value={formData.category}
           onChange={(e) => setFormData({ ...formData, category: e.target.value })}
           className="select-dark"
         >
           <option value="geral">Geral</option>
           <option value="retrato">Retrato</option>
           <option value="paisagem">Paisagem</option>
           <option value="arte">Arte</option>
           <option value="produto">Produto</option>
           <option value="moda">Moda</option>
           <option value="animacao">Animação</option>
           <option value="video">Vídeo</option>
         </select>
       </div>
 
       <input
         type="text"
         value={formData.description}
         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
         placeholder="Descrição"
         className="input-dark w-full"
       />
 
       <input
         type="url"
         value={formData.image_url}
         onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
         placeholder="URL da imagem"
         className="input-dark w-full"
       />
 
       <textarea
         value={formData.prompt_text}
         onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
         placeholder="Texto do prompt"
         className="input-dark w-full min-h-[120px]"
       />
 
       <div className="flex items-center gap-3">
         <input
           type="checkbox"
           id={`premium-${promptId || 'new'}`}
           checked={formData.is_premium}
           onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
           className="w-5 h-5 rounded border-border bg-input accent-primary"
         />
         <label htmlFor={`premium-${promptId || 'new'}`} className="flex items-center gap-2">
           <Crown size={18} className="text-amber-500" />
           Premium
         </label>
       </div>
 
       <div className="flex gap-3">
         <button
           onClick={isNew ? handleCreate : () => handleUpdate(promptId)}
           disabled={saving}
           className="btn-primary-glow px-6 py-2 rounded-lg flex items-center gap-2"
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
           <h1 className="text-2xl font-bold">Prompts</h1>
           <p className="text-muted-foreground">Gerenciar biblioteca de prompts</p>
         </div>
         
         {!showNewForm && (
           <button
             onClick={() => setShowNewForm(true)}
             className="btn-primary-glow px-4 py-2 rounded-lg flex items-center gap-2"
           >
             <Plus size={20} />
             Novo Prompt
           </button>
         )}
       </div>
 
       {showNewForm && <PromptForm isNew />}
 
       <div className="space-y-4">
         {prompts.map((prompt) => (
           <div key={prompt.id}>
             {editingId === prompt.id ? (
               <PromptForm promptId={prompt.id} />
             ) : (
               <div className="card-elevated p-6 flex items-start justify-between">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                     <h3 className="font-semibold text-lg">{prompt.title}</h3>
                     {prompt.is_premium && <span className="premium-badge">Premium</span>}
                     {prompt.category && (
                       <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                         {prompt.category}
                       </span>
                     )}
                   </div>
                   {prompt.description && (
                     <p className="text-muted-foreground text-sm mb-2">{prompt.description}</p>
                   )}
                   <p className="text-sm line-clamp-2">{prompt.prompt_text}</p>
                 </div>
                 
                 <div className="flex gap-2 ml-4">
                   <button
                     onClick={() => startEdit(prompt)}
                     className="p-2 rounded-lg hover:bg-primary/20 text-primary"
                   >
                     <Edit2 size={18} />
                   </button>
                   <button
                     onClick={() => handleDelete(prompt.id)}
                     className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"
                   >
                     <Trash2 size={18} />
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
 
 export default AdminPrompts;