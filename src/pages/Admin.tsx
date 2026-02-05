 import { useState } from "react";
 import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
 import AdminSidebar from "@/components/admin/AdminSidebar";
 import AdminDashboard from "@/components/admin/AdminDashboard";
 import AdminPrompts from "@/components/admin/AdminPrompts";
 import AdminCharacters from "@/components/admin/AdminCharacters";
 import AdminUsers from "@/components/admin/AdminUsers";
 import AdminSettings from "@/components/admin/AdminSettings";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
   const [currentSection, setCurrentSection] = useState("dashboard");
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // Not admin - redirect
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

   const renderSection = () => {
     switch (currentSection) {
       case "dashboard":
         return <AdminDashboard />;
       case "prompts":
         return <AdminPrompts />;
       case "characters":
         return <AdminCharacters />;
       case "users":
         return <AdminUsers />;
       case "settings":
         return <AdminSettings />;
       default:
         return <AdminDashboard />;
     }
   };

  return (
     <div className="min-h-screen flex">
       <AdminSidebar
         currentSection={currentSection}
         onSectionChange={setCurrentSection}
         collapsed={sidebarCollapsed}
         onCollapse={setSidebarCollapsed}
       />
       <main className="flex-1 p-6 overflow-y-auto">
         {renderSection()}
       </main>
    </div>
  );
};

export default Admin;
