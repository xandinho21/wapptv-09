
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Eye, Globe, Share2, Twitter } from 'lucide-react';
import { toast } from 'sonner';

const SeoConfig = () => {
  const { adminData, updateSeoSettings, updateSeoImage } = useAdmin();
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: ''
  });

  // Sync local state with adminData when it changes
  useEffect(() => {
    setSeoData({
      title: adminData.seo.title,
      description: adminData.seo.description,
      keywords: adminData.seo.keywords,
      ogTitle: adminData.seo.ogTitle,
      ogDescription: adminData.seo.ogDescription,
      ogImage: adminData.seo.ogImage,
      twitterTitle: adminData.seo.twitterTitle,
      twitterDescription: adminData.seo.twitterDescription
    });
  }, [adminData.seo]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await updateSeoImage(file);
        setSeoData(prev => ({ ...prev, ogImage: imageUrl }));
        toast.success('Imagem SEO atualizada com sucesso!');
      } catch (error) {
        toast.error('Erro ao fazer upload da imagem');
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!seoData.title.trim() || !seoData.description.trim()) {
        toast.error('Título e descrição são obrigatórios');
        return;
      }

      // Validate field lengths
      if (seoData.title.length > 60) {
        toast.error('Título deve ter no máximo 60 caracteres');
        return;
      }

      if (seoData.description.length > 160) {
        toast.error('Descrição deve ter no máximo 160 caracteres');
        return;
      }

      await updateSeoSettings(seoData);
      toast.success('Configurações de SEO salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações SEO:', error);
      toast.error('Erro ao salvar configurações. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Configurações de SEO</h1>
        <p className="text-gray-400">Otimize seu site para mecanismos de busca e redes sociais</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="basic" className="data-[state=active]:bg-green-600">
            <Globe className="w-4 h-4 mr-2" />
            SEO Básico
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-blue-600">
            <Share2 className="w-4 h-4 mr-2" />
            Open Graph
          </TabsTrigger>
          <TabsTrigger value="twitter" className="data-[state=active]:bg-sky-600">
            <Twitter className="w-4 h-4 mr-2" />
            Twitter Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400">Configurações Básicas de SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Título da Página</Label>
                <Input
                  value={seoData.title}
                  onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Wapp TV - O Melhor da IPTV"
                  className="bg-gray-700 border-gray-600 text-white"
                  maxLength={60}
                />
                <p className="text-sm text-gray-400 mt-1">
                  {seoData.title.length}/60 caracteres (recomendado: até 60)
                </p>
              </div>

              <div>
                <Label className="text-gray-300">Meta Descrição</Label>
                <Textarea
                  value={seoData.description}
                  onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva seu site em até 160 caracteres"
                  className="bg-gray-700 border-gray-600 text-white"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-gray-400 mt-1">
                  {seoData.description.length}/160 caracteres (recomendado: até 160)
                </p>
              </div>

              <div>
                <Label className="text-gray-300">Palavras-chave</Label>
                <Input
                  value={seoData.keywords}
                  onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="palavra1, palavra2, palavra3"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separe as palavras-chave com vírgulas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Open Graph (Facebook, LinkedIn, etc.)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Título Open Graph</Label>
                <Input
                  value={seoData.ogTitle}
                  onChange={(e) => setSeoData(prev => ({ ...prev, ogTitle: e.target.value }))}
                  placeholder="Título para redes sociais"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Descrição Open Graph</Label>
                <Textarea
                  value={seoData.ogDescription}
                  onChange={(e) => setSeoData(prev => ({ ...prev, ogDescription: e.target.value }))}
                  placeholder="Descrição para redes sociais"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300">Imagem Open Graph</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 bg-gray-700 rounded-lg overflow-hidden">
                    {seoData.ogImage ? (
                      <img
                        src={seoData.ogImage}
                        alt="Preview Open Graph"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Eye className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('og-image-upload')?.click()}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Imagem
                    </Button>
                    <input
                      id="og-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Recomendado: 1200x630px
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sky-400">Twitter Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Título Twitter</Label>
                <Input
                  value={seoData.twitterTitle}
                  onChange={(e) => setSeoData(prev => ({ ...prev, twitterTitle: e.target.value }))}
                  placeholder="Título para Twitter"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Descrição Twitter</Label>
                <Textarea
                  value={seoData.twitterDescription}
                  onChange={(e) => setSeoData(prev => ({ ...prev, twitterDescription: e.target.value }))}
                  placeholder="Descrição para Twitter"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white">
        Salvar Configurações de SEO
      </Button>
    </div>
  );
};

export default SeoConfig;
