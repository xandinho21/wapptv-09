
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SiteConfig = () => {
  const { adminData, updateSiteName, updateSiteLogo } = useAdmin();
  const { toast } = useToast();
  const [siteName, setSiteName] = useState(adminData.siteName);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSiteNameUpdate = async () => {
    try {
      await updateSiteName(siteName);
      toast({
        title: "Nome do site atualizado",
        description: "O nome do site foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o nome do site.",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    try {
      setUploading(true);
      await updateSiteLogo(logoFile);
      toast({
        title: "Logo atualizado",
        description: "O logo do site foi atualizado com sucesso.",
      });
      setLogoFile(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione uma imagem (JPEG, PNG, SVG ou WebP).",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Configurações do Site</h1>
        <p className="text-gray-400">Configure o nome e o logotipo do seu site</p>
      </div>

      <div className="grid gap-6">
        {/* Nome do Site */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400">Nome do Site</CardTitle>
            <CardDescription className="text-gray-400">
              O nome que aparece no cabeçalho e em todo o site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-gray-300">Nome</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Nome do site"
              />
            </div>
            <Button
              onClick={handleSiteNameUpdate}
              className="bg-green-600 hover:bg-green-700"
              disabled={siteName === adminData.siteName}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Nome
            </Button>
          </CardContent>
        </Card>

        {/* Logo do Site */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400">Logotipo</CardTitle>
            <CardDescription className="text-gray-400">
              O logo que aparece no cabeçalho do site (JPEG, PNG, SVG ou WebP - máximo 2MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview do logo atual */}
            {adminData.siteLogoUrl && (
              <div>
                <Label className="text-gray-300">Logo Atual</Label>
                <div className="mt-2 p-4 bg-gray-700 rounded-lg inline-block">
                  <img
                    src={adminData.siteLogoUrl}
                    alt="Logo atual"
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Upload de novo logo */}
            <div>
              <Label htmlFor="logoFile" className="text-gray-300">Novo Logo</Label>
              <div className="mt-2">
                <input
                  id="logoFile"
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logoFile')?.click()}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </Button>
                {logoFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Arquivo selecionado: {logoFile.name}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleLogoUpload}
              disabled={!logoFile || uploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Logo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteConfig;
