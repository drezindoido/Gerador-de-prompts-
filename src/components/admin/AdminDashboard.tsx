 import { useEffect, useState } from "react";
 import { Users, FileText, UserCircle, TrendingUp } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 
 interface Stats {
   totalUsers: number;
   totalPrompts: number;
   totalCharacters: number;
   premiumUsers: number;
 }
 
 const AdminDashboard = () => {
   const [stats, setStats] = useState<Stats>({
     totalUsers: 0,
     totalPrompts: 0,
     totalCharacters: 0,
     premiumUsers: 0,
   });
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     fetchStats();
   }, []);
 
   const fetchStats = async () => {
     try {
       const [profilesRes, promptsRes, charactersRes, premiumRes] = await Promise.all([
         supabase.from("profiles").select("id", { count: "exact", head: true }),
         supabase.from("prompts").select("id", { count: "exact", head: true }),
         supabase.from("characters").select("id", { count: "exact", head: true }),
         supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
       ]);
 
       setStats({
         totalUsers: profilesRes.count || 0,
         totalPrompts: promptsRes.count || 0,
         totalCharacters: charactersRes.count || 0,
         premiumUsers: premiumRes.count || 0,
       });
     } catch (error) {
       console.error("Error fetching stats:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const statCards = [
     { label: "Total Usuários", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
     { label: "Total Prompts", value: stats.totalPrompts, icon: FileText, color: "text-green-500" },
     { label: "Personagens", value: stats.totalCharacters, icon: UserCircle, color: "text-purple-500" },
     { label: "Usuários Premium", value: stats.premiumUsers, icon: TrendingUp, color: "text-amber-500" },
   ];
 
   if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-2xl font-bold">Dashboard</h1>
         <p className="text-muted-foreground">Visão geral do sistema</p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {statCards.map((card) => (
           <div key={card.label} className="card-elevated p-6">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">{card.label}</p>
                 <p className="text-3xl font-bold mt-1">{card.value}</p>
               </div>
               <div className={`p-3 rounded-full bg-muted ${card.color}`}>
                 <card.icon size={24} />
               </div>
             </div>
           </div>
         ))}
       </div>
 
       <div className="card-elevated p-6">
         <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
             <FileText size={20} className="text-primary mb-2" />
             <span className="text-sm font-medium">Novo Prompt</span>
           </button>
           <button className="p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-left">
             <UserCircle size={20} className="text-purple-500 mb-2" />
             <span className="text-sm font-medium">Novo Personagem</span>
           </button>
         </div>
       </div>
     </div>
   );
 };
 
 export default AdminDashboard;