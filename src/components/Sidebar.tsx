import { Users, Wand2, FileText, Crown } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium: boolean;
}

const Sidebar = ({ activeTab, onTabChange, isPremium }: SidebarProps) => {
  const menuItems = [
    { id: "characters", label: "Personagens", icon: Users },
    { id: "generator", label: "Gerador", icon: Wand2 },
    { id: "prompts", label: "Prompts", icon: FileText },
    { id: "premium", label: "Premium", icon: Crown },
  ];

  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      <div className="p-6">
        <h1 className="font-display text-xl font-bold">
          <span className="gold-gradient-text">AI Prompt</span>
          <br />
          <span className="text-foreground">Characters</span>
        </h1>
        {isPremium && (
          <div className="mt-3">
            <span className="premium-badge">✨ PREMIUM</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`sidebar-link w-full ${isActive ? "active" : ""}`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? "text-primary" : "text-muted-foreground"} 
                />
                <span className={isActive ? "text-primary font-medium" : ""}>
                  {item.label}
                </span>
                {item.id === "premium" && !isPremium && (
                  <Crown size={14} className="ml-auto text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 AI Prompt Characters
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
