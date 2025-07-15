import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Check, Settings } from "lucide-react";
import { useTheme, ThemeSettings } from "@/hooks/useTheme";
import ThemeCustomizationModal from "@/components/ThemeCustomizationModal";

export default function ThemesConfig() {
  const { themes, activeTheme, loading, activateTheme, updateTheme, duplicateTheme, applyTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeSettings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCustomizeTheme = (theme: ThemeSettings) => {
    setSelectedTheme(theme);
    setIsModalOpen(true);
  };

  const handleSaveTheme = (updates: Partial<ThemeSettings>) => {
    if (selectedTheme) {
      updateTheme(selectedTheme.id, updates);
    }
  };

  const handleDuplicateTheme = (originalTheme: ThemeSettings, newName: string) => {
    duplicateTheme(originalTheme, newName);
  };

  const handlePreviewTheme = (theme: ThemeSettings) => {
    applyTheme(theme);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Configuração de Temas</h2>
          <p className="text-gray-400">Carregando temas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configuração de Temas</h2>
        <p className="text-gray-400">
          Selecione o tema visual do seu site. As cores afetam apenas a página principal e a tela de login.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <Card key={theme.id} className="bg-gray-800 border-gray-700 relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {theme.name}
                </CardTitle>
                {theme.is_active && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-300">
                Tema {theme.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Theme Preview */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">Cores Principais:</p>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-600"
                    style={{ backgroundColor: `hsl(${theme.primary_color})` }}
                    title="Cor Primária"
                  />
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-600"
                    style={{ backgroundColor: `hsl(${theme.secondary_color})` }}
                    title="Cor Secundária"
                  />
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-600"
                    style={{ backgroundColor: `hsl(${theme.accent_color})` }}
                    title="Cor de Destaque"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">Cores do Krator:</p>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-600"
                    style={{ backgroundColor: `hsl(${theme.krator_primary_color})` }}
                    title="Krator Primária"
                  />
                  <div 
                    className="w-8 h-8 rounded-md border border-gray-600"
                    style={{ backgroundColor: `hsl(${theme.krator_secondary_color})` }}
                    title="Krator Secundária"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => activateTheme(theme.id)}
                  disabled={theme.is_active}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {theme.is_active ? 'Tema Ativo' : 'Aplicar Tema'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleCustomizeTheme(theme)}
                  className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <ul className="space-y-2 text-sm">
            <li>• Os temas afetam apenas a página principal e a tela de login</li>
            <li>• O painel administrativo mantém sempre o tema escuro atual</li>
            <li>• A seção Krator possui cores independentes para destaque</li>
            <li>• As mudanças são aplicadas imediatamente após a seleção</li>
          </ul>
        </CardContent>
      </Card>

      <ThemeCustomizationModal
        theme={selectedTheme}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTheme(null);
          if (activeTheme) {
            applyTheme(activeTheme);
          }
        }}
        onSave={handleSaveTheme}
        onDuplicate={handleDuplicateTheme}
        onPreview={handlePreviewTheme}
      />
    </div>
  );
}