 import { useState, useEffect } from "react";
 import { Loader2, Save, Palette } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 interface SiteSetting {
   id: string;
   key: string;
   value: string | null;
 }
 
 const AdminSettings = () => {
   const [settings, setSettings] = useState<Record<string, string>>({});
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
 
   useEffect(() => {
     fetchSettings();
   }, []);
 
   const fetchSettings = async () => {
     try {
       const { data, error } = await supabase
         .from("site_settings")
         .select("*");
 
       if (error) throw error;
 
       const settingsMap: Record<string, string> = {};
       (data || []).forEach((s: SiteSetting) => {
         settingsMap[s.key] = s.value || "";
       });
       setSettings(settingsMap);
     } catch (error) {
       console.error("Error fetching settings:", error);
       toast.error("Erro ao carregar configurações");
     } finally {
       setLoading(false);
     }
   };
 
   const handleSave = async () => {
     setSaving(true);
     try {
       for (const [key, value] of Object.entries(settings)) {
         const { error } = await supabase
           .from("site_settings")
           .update({ value })
           .eq("key", key);
         
         if (error) throw error;
       }
       toast.success("Configurações salvas!");
     } catch (error) {
       console.error("Error saving settings:", error);
       toast.error("Erro ao salvar configurações");
     } finally {
       setSaving(false);
     }
   };
 
   const updateSetting = (key: string, value: string) => {
     setSettings({ ...settings, [key]: value });
   };
 
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
           <h1 className="text-2xl font-bold">Configurações do Site</h1>
           <p className="text-muted-foreground">Personalize cores, textos e aparência</p>
         </div>
         <button
           onClick={handleSave}
           disabled={saving}
           className="btn-primary-glow px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
         >
           {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
           Salvar Alterações
         </button>
       </div>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Cores */}
         <div className="card-elevated p-6 space-y-4">
           <div className="flex items-center gap-2 mb-4">
             <Palette size={20} className="text-primary" />
             <h2 className="font-semibold text-lg">Cores</h2>
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-2">Cor Primária</label>
               <div className="flex gap-3">
                 <input
                   type="color"
                   value={settings.primary_color || "#9b59b6"}
                   onChange={(e) => updateSetting("primary_color", e.target.value)}
                   className="h-10 w-20 rounded cursor-pointer"
                 />
                 <input
                   type="text"
                   value={settings.primary_color || "#9b59b6"}
                   onChange={(e) => updateSetting("primary_color", e.target.value)}
                   className="input-dark flex-1"
                 />
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-2">Cor Secundária</label>
               <div className="flex gap-3">
                 <input
                   type="color"
                   value={settings.secondary_color || "#8e44ad"}
                   onChange={(e) => updateSetting("secondary_color", e.target.value)}
                   className="h-10 w-20 rounded cursor-pointer"
                 />
                 <input
                   type="text"
                   value={settings.secondary_color || "#8e44ad"}
                   onChange={(e) => updateSetting("secondary_color", e.target.value)}
                   className="input-dark flex-1"
                 />
               </div>
             </div>
           </div>
         </div>
 
         {/* Textos */}
         <div className="card-elevated p-6 space-y-4">
           <h2 className="font-semibold text-lg mb-4">Textos do Site</h2>
           
           <div>
             <label className="block text-sm font-medium mb-2">Nome do Site</label>
             <input
               type="text"
               value={settings.site_name || ""}
               onChange={(e) => updateSetting("site_name", e.target.value)}
               className="input-dark w-full"
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium mb-2">Título do Hero</label>
             <input
               type="text"
               value={settings.hero_title || ""}
               onChange={(e) => updateSetting("hero_title", e.target.value)}
               className="input-dark w-full"
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium mb-2">Subtítulo do Hero</label>
             <textarea
               value={settings.hero_subtitle || ""}
               onChange={(e) => updateSetting("hero_subtitle", e.target.value)}
               className="input-dark w-full min-h-[80px]"
             />
           </div>
         </div>
 
         {/* Logo */}
         <div className="card-elevated p-6 space-y-4">
           <h2 className="font-semibold text-lg mb-4">Logo</h2>
           
           <div>
             <label className="block text-sm font-medium mb-2">URL do Logo</label>
             <input
               type="url"
               value={settings.logo_url || ""}
               onChange={(e) => updateSetting("logo_url", e.target.value)}
               placeholder="https://..."
               className="input-dark w-full"
             />
           </div>
           
           {settings.logo_url && (
             <div className="mt-4">
               <p className="text-sm text-muted-foreground mb-2">Preview:</p>
               <img 
                 src={settings.logo_url} 
                 alt="Logo preview" 
                 className="max-h-16 object-contain"
               />
             </div>
           )}
         </div>
 
         {/* Preview */}
         <div className="card-elevated p-6">
           <h2 className="font-semibold text-lg mb-4">Preview do Hero</h2>
           <div 
             className="rounded-lg p-6 text-center"
             style={{ 
               background: `linear-gradient(135deg, ${settings.primary_color || '#9b59b6'}, ${settings.secondary_color || '#8e44ad'})` 
             }}
           >
             <h3 className="text-2xl font-bold text-white mb-2">
               {settings.hero_title || "KAIZEN PROMPTS"}
             </h3>
             <p className="text-white/80">
               {settings.hero_subtitle || "Crie prompts profissionais"}
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default AdminSettings;