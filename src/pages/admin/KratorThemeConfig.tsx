import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save, Eye } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';

const KratorThemeConfig = () => {
  const { themes, activeTheme, fetchThemes } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewColors, setPreviewColors] = useState({
    krator_primary_color: activeTheme?.krator_primary_color || '168 85 247',
    krator_secondary_color: activeTheme?.krator_secondary_color || '147 51 234'
  });

  const handleColorChange = (colorType: 'krator_primary_color' | 'krator_secondary_color', value: string) => {
    setPreviewColors(prev => ({
      ...prev,
      [colorType]: value
    }));
    
    // Apply preview to CSS variables immediately
    const root = document.documentElement;
    if (colorType === 'krator_primary_color') {
      root.style.setProperty('--krator-primary', value);
    } else {
      root.style.setProperty('--krator-secondary', value);
    }
  };

  const saveKratorColors = async () => {
    if (!activeTheme) {
      toast({
        title: "Erro",
        description: "Nenhum tema ativo encontrado",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('theme_settings')
        .update({
          krator_primary_color: previewColors.krator_primary_color,
          krator_secondary_color: previewColors.krator_secondary_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeTheme.id);

      if (error) throw error;

      await fetchThemes();
      
      toast({
        title: "Cores do Krator atualizadas!",
        description: "As cores do tema Krator foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar cores do Krator:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as cores do Krator.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToOriginal = () => {
    if (activeTheme) {
      setPreviewColors({
        krator_primary_color: activeTheme.krator_primary_color,
        krator_secondary_color: activeTheme.krator_secondary_color
      });
      
      // Reset CSS variables
      const root = document.documentElement;
      root.style.setProperty('--krator-primary', activeTheme.krator_primary_color);
      root.style.setProperty('--krator-secondary', activeTheme.krator_secondary_color);
    }
  };

  const colorPresets = [
    { name: 'Roxo Padrão', primary: '168 85 247', secondary: '147 51 234' },
    { name: 'Dourado', primary: '245 158 11', secondary: '234 179 8' },
    { name: 'Azul', primary: '59 130 246', secondary: '37 99 235' },
    { name: 'Verde', primary: '34 197 94', secondary: '22 163 74' },
    { name: 'Vermelho', primary: '239 68 68', secondary: '220 38 38' },
    { name: 'Rosa', primary: '236 72 153', secondary: '219 39 119' },
  ];

  const applyPreset = (preset: typeof colorPresets[0]) => {
    handleColorChange('krator_primary_color', preset.primary);
    handleColorChange('krator_secondary_color', preset.secondary);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="text-theme-primary" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-white">Tema Krator</h1>
          <p className="text-gray-400">Configure as cores exclusivas das seções do Krator</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye size={20} />
            Tema Atual: {activeTheme?.name}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Personalize as cores do Krator de forma independente do tema principal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Cor Primária do Krator</Label>
              <div className="flex gap-2">
                <Input
                  value={previewColors.krator_primary_color}
                  onChange={(e) => handleColorChange('krator_primary_color', e.target.value)}
                  placeholder="168 85 247"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div 
                  className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                  style={{ backgroundColor: `hsl(${previewColors.krator_primary_color})` }}
                  title="Cor Primária do Krator"
                />
              </div>
              <p className="text-xs text-gray-500">Formato HSL: "hue saturation lightness" (ex: 168 85 247)</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Cor Secundária do Krator</Label>
              <div className="flex gap-2">
                <Input
                  value={previewColors.krator_secondary_color}
                  onChange={(e) => handleColorChange('krator_secondary_color', e.target.value)}
                  placeholder="147 51 234"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div 
                  className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                  style={{ backgroundColor: `hsl(${previewColors.krator_secondary_color})` }}
                  title="Cor Secundária do Krator"
                />
              </div>
              <p className="text-xs text-gray-500">Formato HSL: "hue saturation lightness" (ex: 147 51 234)</p>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-3">
            <Label className="text-white">Presets de Cores</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorPresets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 border-gray-600 hover:border-gray-500 text-left"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: `hsl(${preset.primary})` }}
                      />
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: `hsl(${preset.secondary})` }}
                      />
                    </div>
                    <span className="text-white text-sm">{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <h3 className="text-white font-semibold">Preview das Cores do Krator</h3>
            <div className="space-y-2">
              <div 
                className="p-3 rounded text-white font-medium"
                style={{ backgroundColor: `hsl(${previewColors.krator_primary_color})` }}
              >
                Cor Primária - Títulos e destaques
              </div>
              <div 
                className="p-3 rounded text-white font-medium"
                style={{ backgroundColor: `hsl(${previewColors.krator_secondary_color})` }}
              >
                Cor Secundária - Botões e acentos
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={saveKratorColors}
              disabled={isLoading}
              className="flex-1 bg-theme-primary hover:bg-theme-secondary text-white"
            >
              <Save size={16} className="mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Cores do Krator'}
            </Button>
            <Button 
              onClick={resetToOriginal}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• As cores do Krator são independentes do tema principal do site</p>
          <p>• Cada tema (Verde, Azul, Amarelo, etc.) pode ter suas próprias cores do Krator</p>
          <p>• As seções afetadas são: "Conheça o Novo Sistema Krator", "Plano com Sistema Krator" e "Tutoriais Krator"</p>
          <p>• Use o formato HSL para as cores: "matiz saturação luminosidade" (ex: 168 85 247)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KratorThemeConfig;