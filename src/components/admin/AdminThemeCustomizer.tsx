import { useState, useEffect } from "react";
import { Palette, Save, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
}

const DEFAULT_COLORS: ThemeColors = {
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#F59E0B",
    background: "#0F172A",
    foreground: "#F8FAFC"
};

const AdminThemeCustomizer = () => {
    const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadThemeColors();
    }, []);

    const loadThemeColors = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('setting_value')
                .eq('setting_key', 'theme_colors')
                .single();

            if (error) throw error;

            if (data?.setting_value) {
                setColors(data.setting_value as ThemeColors);
                applyThemeColors(data.setting_value as ThemeColors);
            }
        } catch (error) {
            console.error('Error loading theme colors:', error);
            toast.error('Erro ao carregar cores do tema');
        } finally {
            setLoading(false);
        }
    };

    const applyThemeColors = (themeColors: ThemeColors) => {
        const root = document.documentElement;

        // Convert hex to HSL for CSS variables
        const hexToHSL = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return '0 0% 0%';

            const r = parseInt(result[1], 16) / 255;
            const g = parseInt(result[2], 16) / 255;
            const b = parseInt(result[3], 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }

            return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
        };

        root.style.setProperty('--primary', hexToHSL(themeColors.primary));
        root.style.setProperty('--secondary', hexToHSL(themeColors.secondary));
        root.style.setProperty('--accent', hexToHSL(themeColors.accent));
        root.style.setProperty('--background', hexToHSL(themeColors.background));
        root.style.setProperty('--foreground', hexToHSL(themeColors.foreground));
    };

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        const newColors = { ...colors, [key]: value };
        setColors(newColors);
        applyThemeColors(newColors);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'theme_colors',
                    setting_value: colors
                });

            if (error) throw error;

            toast.success('Cores do tema salvas com sucesso!');
        } catch (error) {
            console.error('Error saving theme colors:', error);
            toast.error('Erro ao salvar cores do tema');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setColors(DEFAULT_COLORS);
        applyThemeColors(DEFAULT_COLORS);
        toast.info('Cores resetadas para o padrão');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-xl">
                    <Palette size={24} className="text-primary-foreground" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Customização de Tema</h2>
                    <p className="text-muted-foreground text-sm">
                        Personalize as cores do site
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg border-2 border-border"
                                style={{ backgroundColor: colors.primary }}
                            />
                            Cor Primária
                        </label>
                        <input
                            type="color"
                            value={colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-full h-12 rounded-xl border border-border cursor-pointer"
                        />
                        <input
                            type="text"
                            value={colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm font-mono"
                            placeholder="#8B5CF6"
                        />
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg border-2 border-border"
                                style={{ backgroundColor: colors.secondary }}
                            />
                            Cor Secundária
                        </label>
                        <input
                            type="color"
                            value={colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-full h-12 rounded-xl border border-border cursor-pointer"
                        />
                        <input
                            type="text"
                            value={colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm font-mono"
                            placeholder="#EC4899"
                        />
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg border-2 border-border"
                                style={{ backgroundColor: colors.accent }}
                            />
                            Cor de Destaque
                        </label>
                        <input
                            type="color"
                            value={colors.accent}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                            className="w-full h-12 rounded-xl border border-border cursor-pointer"
                        />
                        <input
                            type="text"
                            value={colors.accent}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm font-mono"
                            placeholder="#F59E0B"
                        />
                    </div>

                    {/* Background Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg border-2 border-border"
                                style={{ backgroundColor: colors.background }}
                            />
                            Cor de Fundo
                        </label>
                        <input
                            type="color"
                            value={colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-full h-12 rounded-xl border border-border cursor-pointer"
                        />
                        <input
                            type="text"
                            value={colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm font-mono"
                            placeholder="#0F172A"
                        />
                    </div>

                    {/* Foreground Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded-lg border-2 border-border"
                                style={{ backgroundColor: colors.foreground }}
                            />
                            Cor do Texto
                        </label>
                        <input
                            type="color"
                            value={colors.foreground}
                            onChange={(e) => handleColorChange('foreground', e.target.value)}
                            className="w-full h-12 rounded-xl border border-border cursor-pointer"
                        />
                        <input
                            type="text"
                            value={colors.foreground}
                            onChange={(e) => handleColorChange('foreground', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm font-mono"
                            placeholder="#F8FAFC"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="border-t border-border pt-6">
                    <h3 className="text-sm font-medium mb-4">Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <div
                                className="h-20 rounded-xl"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Primária</p>
                        </div>
                        <div className="space-y-2">
                            <div
                                className="h-20 rounded-xl"
                                style={{ backgroundColor: colors.secondary }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Secundária</p>
                        </div>
                        <div className="space-y-2">
                            <div
                                className="h-20 rounded-xl"
                                style={{ backgroundColor: colors.accent }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Destaque</p>
                        </div>
                        <div className="space-y-2">
                            <div
                                className="h-20 rounded-xl border-2 border-border"
                                style={{ backgroundColor: colors.background }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Fundo</p>
                        </div>
                        <div className="space-y-2">
                            <div
                                className="h-20 rounded-xl border-2 border-border"
                                style={{ backgroundColor: colors.foreground }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Texto</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-muted/80 transition-colors"
                    >
                        <RotateCcw size={18} />
                        Resetar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminThemeCustomizer;
