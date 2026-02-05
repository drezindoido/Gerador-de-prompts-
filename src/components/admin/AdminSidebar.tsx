 import { LayoutDashboard, Users, Palette, FileText, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface AdminSidebarProps {
   currentSection: string;
   onSectionChange: (section: string) => void;
   collapsed: boolean;
   onCollapse: (collapsed: boolean) => void;
 }
 
 const menuItems = [
   { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
   { id: "prompts", label: "Prompts", icon: FileText },
   { id: "characters", label: "Personagens", icon: UserCircle },
   { id: "users", label: "Usuários", icon: Users },
   { id: "settings", label: "Configurações", icon: Palette },
 ];
 
 const AdminSidebar = ({ currentSection, onSectionChange, collapsed, onCollapse }: AdminSidebarProps) => {
   return (
     <aside className={cn(
       "bg-card border-r border-border h-full transition-all duration-300 flex flex-col",
       collapsed ? "w-16" : "w-64"
     )}>
       <div className="p-4 border-b border-border flex items-center justify-between">
         {!collapsed && (
           <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
             KAIZEN CMS
           </h2>
         )}
         <button
           onClick={() => onCollapse(!collapsed)}
           className="p-2 rounded-lg hover:bg-muted transition-colors"
         >
           {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
         </button>
       </div>
       
       <nav className="flex-1 p-2 space-y-1">
         {menuItems.map((item) => (
           <button
             key={item.id}
             onClick={() => onSectionChange(item.id)}
             className={cn(
               "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
               currentSection === item.id
                 ? "bg-primary text-primary-foreground"
                 : "hover:bg-muted text-muted-foreground hover:text-foreground"
             )}
           >
             <item.icon size={20} />
             {!collapsed && <span className="font-medium">{item.label}</span>}
           </button>
         ))}
       </nav>
     </aside>
   );
 };
 
 export default AdminSidebar;