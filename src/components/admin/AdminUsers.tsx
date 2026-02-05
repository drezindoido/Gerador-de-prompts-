 import { useState, useEffect } from "react";
 import { Loader2, Shield, ShieldCheck, User, Crown } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 interface UserProfile {
   id: string;
   email: string;
   full_name: string | null;
   subscription_status: string | null;
   created_at: string;
 }
 
 interface UserRole {
   user_id: string;
   role: string;
 }
 
 const AdminUsers = () => {
   const [users, setUsers] = useState<UserProfile[]>([]);
   const [roles, setRoles] = useState<Record<string, string>>({});
   const [loading, setLoading] = useState(true);
   const [updating, setUpdating] = useState<string | null>(null);
 
   useEffect(() => {
     fetchUsers();
   }, []);
 
   const fetchUsers = async () => {
     try {
       const [usersRes, rolesRes] = await Promise.all([
         supabase.from("profiles").select("*").order("created_at", { ascending: false }),
         supabase.from("user_roles").select("user_id, role"),
       ]);
 
       if (usersRes.error) throw usersRes.error;
       if (rolesRes.error) throw rolesRes.error;
 
       setUsers(usersRes.data || []);
       
       const rolesMap: Record<string, string> = {};
       (rolesRes.data || []).forEach((r: UserRole) => {
         rolesMap[r.user_id] = r.role;
       });
       setRoles(rolesMap);
     } catch (error) {
       console.error("Error fetching users:", error);
       toast.error("Erro ao carregar usuários");
     } finally {
       setLoading(false);
     }
   };
 
   const handleRoleChange = async (userId: string, newRole: string) => {
     setUpdating(userId);
     try {
       const currentRole = roles[userId];
       
       if (currentRole) {
         const { error } = await supabase
           .from("user_roles")
           .update({ role: newRole })
           .eq("user_id", userId);
         if (error) throw error;
       } else {
         const { error } = await supabase
           .from("user_roles")
           .insert({ user_id: userId, role: newRole });
         if (error) throw error;
       }
 
       setRoles({ ...roles, [userId]: newRole });
       toast.success("Role atualizado!");
     } catch (error) {
       console.error("Error updating role:", error);
       toast.error("Erro ao atualizar role");
     } finally {
       setUpdating(null);
     }
   };
 
   const getRoleIcon = (role: string) => {
     switch (role) {
       case "admin": return <ShieldCheck size={16} className="text-primary" />;
       case "moderator": return <Shield size={16} className="text-blue-500" />;
       default: return <User size={16} className="text-muted-foreground" />;
     }
   };
 
   const getStatusBadge = (status: string | null) => {
     if (status === "active") {
       return <span className="premium-badge flex items-center gap-1"><Crown size={12} /> Premium</span>;
     }
     return <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Gratuito</span>;
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
       <div>
         <h1 className="text-2xl font-bold">Usuários</h1>
         <p className="text-muted-foreground">Gerenciar usuários e permissões</p>
       </div>
 
       <div className="card-elevated overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-muted/50">
               <tr>
                 <th className="px-4 py-3 text-left text-sm font-medium">Usuário</th>
                 <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                 <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                 <th className="px-4 py-3 text-left text-sm font-medium">Cadastro</th>
                 <th className="px-4 py-3 text-left text-sm font-medium">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {users.map((user) => (
                 <tr key={user.id} className="hover:bg-muted/30">
                   <td className="px-4 py-3">
                     <div>
                       <p className="font-medium">{user.full_name || "Sem nome"}</p>
                       <p className="text-sm text-muted-foreground">{user.email}</p>
                     </div>
                   </td>
                   <td className="px-4 py-3">
                     {getStatusBadge(user.subscription_status)}
                   </td>
                   <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                       {getRoleIcon(roles[user.id] || "user")}
                       <span className="capitalize">{roles[user.id] || "user"}</span>
                     </div>
                   </td>
                   <td className="px-4 py-3 text-sm text-muted-foreground">
                     {new Date(user.created_at).toLocaleDateString('pt-BR')}
                   </td>
                   <td className="px-4 py-3">
                     <select
                       value={roles[user.id] || "user"}
                       onChange={(e) => handleRoleChange(user.id, e.target.value)}
                       disabled={updating === user.id}
                       className="select-dark text-sm py-1 px-2"
                     >
                       <option value="user">User</option>
                       <option value="moderator">Moderator</option>
                       <option value="admin">Admin</option>
                     </select>
                     {updating === user.id && (
                       <Loader2 size={14} className="animate-spin inline ml-2" />
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   );
 };
 
 export default AdminUsers;