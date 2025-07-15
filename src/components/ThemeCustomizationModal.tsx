import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeSettings } from '@/hooks/useTheme';
import { Copy, RotateCcw } from 'lucide-react';

interface ThemeCustomizationModalProps {
  theme: ThemeSettings | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ThemeSettings>) => void;
  onDuplicate: (originalTheme: ThemeSettings, newName: string) => void;
  onPreview: (theme: ThemeSettings) => void;
}

export default function ThemeCustomizationModal({ 
  theme, 
  isOpen, 
  onClose, 
  onSave, 
  onDuplicate, 
  onPreview 
}: ThemeCustomizationModalProps) {
  const [editedTheme, setEditedTheme] = useState<ThemeSettings | null>(null);
  const [duplicateName, setDuplicateName] = useState('');
  const [showDuplicateInput, setShowDuplicateInput] = useState(false);

  useEffect(() => {
    if (theme && isOpen) {
      setEditedTheme({ ...theme });
      setDuplicateName(`${theme.name} (Cópia)`);
      setShowDuplicateInput(false);
    }
  }, [theme, isOpen]);

  if (!editedTheme) return null;

  const handleColorChange = (field: keyof ThemeSettings, value: string) => {
    const hexToHsl = (hex: string): string => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert hex to RGB
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      // Convert RGB to HSL
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const hslValue = hexToHsl(value);
    const updatedTheme = { ...editedTheme, [field]: hslValue };
    setEditedTheme(updatedTheme);
    onPreview(updatedTheme);
  };

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(/\s+/).map(v => parseFloat(v.replace('%', '')));
    
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lNorm - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const toHex = (val: number) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handleSave = () => {
    const { id, ...updates } = editedTheme;
    onSave(updates);
    onClose();
  };

  const handleDuplicate = () => {
    if (duplicateName.trim()) {
      onDuplicate(theme, duplicateName.trim());
      onClose();
    }
  };

  const handleReset = () => {
    if (theme) {
      setEditedTheme({ ...theme });
      onPreview(theme);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-green-400">Personalizar Tema</DialogTitle>
          <DialogDescription className="text-gray-300">
            Edite as cores e o nome do tema. As mudanças são aplicadas em tempo real.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <Label htmlFor="theme-name" className="text-gray-300">Nome do Tema</Label>
            <Input
              id="theme-name"
              value={editedTheme.name}
              onChange={(e) => setEditedTheme({ ...editedTheme, name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Main Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">Cores Principais</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Cor Primária</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(editedTheme.primary_color)}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: `hsl(${editedTheme.primary_color})` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Cor Secundária</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(editedTheme.secondary_color)}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: `hsl(${editedTheme.secondary_color})` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Cor de Destaque</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(editedTheme.accent_color)}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: `hsl(${editedTheme.accent_color})` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Krator Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">Cores do Krator</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Krator Primária</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(editedTheme.krator_primary_color)}
                    onChange={(e) => handleColorChange('krator_primary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: `hsl(${editedTheme.krator_primary_color})` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Krator Secundária</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hslToHex(editedTheme.krator_secondary_color)}
                    onChange={(e) => handleColorChange('krator_secondary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-600"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: `hsl(${editedTheme.krator_secondary_color})` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Duplicate Section */}
          {!showDuplicateInput ? (
            <Button
              variant="outline"
              onClick={() => setShowDuplicateInput(true)}
              className="w-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicar Tema
            </Button>
          ) : (
            <div className="space-y-2">
              <Label className="text-gray-300">Nome do Novo Tema</Label>
              <div className="flex gap-2">
                <Input
                  value={duplicateName}
                  onChange={(e) => setDuplicateName(e.target.value)}
                  placeholder="Nome do tema duplicado"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={handleDuplicate} className="bg-green-600 hover:bg-green-700 text-white">
                  Criar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDuplicateInput(false)}
                  className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-green-600 hover:text-white hover:border-green-600"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
