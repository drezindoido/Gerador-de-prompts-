import { useState } from "react";
import { Settings, Palette } from "lucide-react";
import AdminThemeCustomizer from "./AdminThemeCustomizer";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<"theme" | "general">("theme");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-3 rounded-xl">
          <Settings size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configurações do Site</h1>
          <p className="text-muted-foreground text-sm">
            Personalize cores, textos e aparência
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("theme")}
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "theme"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <Palette size={18} />
            Tema e Cores
          </div>
          {activeTab === "theme" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "general"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            Geral
          </div>
          {activeTab === "general" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "theme" && <AdminThemeCustomizer />}
        {activeTab === "general" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-muted-foreground">
              Configurações gerais em breve...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
