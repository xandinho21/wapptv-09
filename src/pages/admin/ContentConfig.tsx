import React, { useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';
const ContentConfig = () => {
  const {
    adminData,
    updateContentSettings
  } = useAdminContext();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [heroData, setHeroData] = useState(adminData.content.hero);
  const [trialData, setTrialData] = useState(adminData.content.trial);
  const [footerData, setFooterData] = useState(adminData.content.footer);
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('hero', heroData);
      toast({
        title: "Sucesso",
        description: "Configurações da seção Hero atualizadas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('trial', trialData);
      toast({
        title: "Sucesso",
        description: "Configurações da seção Trial atualizadas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('footer', footerData);
      toast({
        title: "Sucesso",
        description: "Configurações do Rodapé atualizadas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-6">
      <div>
        
        
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero" className="text-base text-slate-500 bg-slate-50">Seção Hero</TabsTrigger>
          <TabsTrigger value="trial">Seção Trial</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Seção Hero</CardTitle>
              <CardDescription>Configure os textos da primeira seção do site</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título Principal</label>
                    <Input value={heroData.title} onChange={e => setHeroData({
                    ...heroData,
                    title: e.target.value
                  })} placeholder="Experimente o Melhor do Streaming" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto do Botão</label>
                    <Input value={heroData.buttonText} onChange={e => setHeroData({
                    ...heroData,
                    buttonText: e.target.value
                  })} placeholder="Ver Planos" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <Textarea value={heroData.subtitle} onChange={e => setHeroData({
                  ...heroData,
                  subtitle: e.target.value
                })} placeholder="Entretenimento de qualidade..." rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de Preço</label>
                    <Input value={heroData.priceText} onChange={e => setHeroData({
                    ...heroData,
                    priceText: e.target.value
                  })} placeholder="A partir de" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Inicial</label>
                    <Input value={heroData.initialPrice} onChange={e => setHeroData({
                    ...heroData,
                    initialPrice: e.target.value
                  })} placeholder="R$ 25,00" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card 1 - Título</label>
                    <Input value={heroData.card1Title} onChange={e => setHeroData({
                    ...heroData,
                    card1Title: e.target.value
                  })} placeholder="Streaming" />
                    <label className="block text-sm font-medium mb-2 mt-2">Card 1 - Subtítulo</label>
                    <Input value={heroData.card1Subtitle} onChange={e => setHeroData({
                    ...heroData,
                    card1Subtitle: e.target.value
                  })} placeholder="Qualidade Premium" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Card 2 - Título</label>
                    <Input value={heroData.card2Title} onChange={e => setHeroData({
                    ...heroData,
                    card2Title: e.target.value
                  })} placeholder="Suporte" />
                    <label className="block text-sm font-medium mb-2 mt-2">Card 2 - Subtítulo</label>
                    <Input value={heroData.card2Subtitle} onChange={e => setHeroData({
                    ...heroData,
                    card2Subtitle: e.target.value
                  })} placeholder="Pelo Whatsapp" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Card 3 - Título</label>
                    <Input value={heroData.card3Title} onChange={e => setHeroData({
                    ...heroData,
                    card3Title: e.target.value
                  })} placeholder="15.000+" />
                    <label className="block text-sm font-medium mb-2 mt-2">Card 3 - Subtítulo</label>
                    <Input value={heroData.card3Subtitle} onChange={e => setHeroData({
                    ...heroData,
                    card3Subtitle: e.target.value
                  })} placeholder="Conteúdos Disponíveis" />
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Seção Trial</CardTitle>
              <CardDescription>Configure os textos da seção de teste grátis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input value={trialData.title} onChange={e => setTrialData({
                  ...trialData,
                  title: e.target.value
                })} placeholder="Experimente Antes de Comprar" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <Textarea value={trialData.subtitle} onChange={e => setTrialData({
                  ...trialData,
                  subtitle: e.target.value
                })} placeholder="Teste nossa plataforma..." rows={3} />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Rodapé</CardTitle>
              <CardDescription>Configure os textos do rodapé do site</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFooterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                    <Input value={footerData.companyName} onChange={e => setFooterData({
                    ...footerData,
                    companyName: e.target.value
                  })} placeholder="Wapp TV" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Copyright</label>
                    <Input value={footerData.copyright} onChange={e => setFooterData({
                    ...footerData,
                    copyright: e.target.value
                  })} placeholder="© 2025 Wapp TV..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição da Empresa</label>
                  <Textarea value={footerData.companyDescription} onChange={e => setFooterData({
                  ...footerData,
                  companyDescription: e.target.value
                })} placeholder="A melhor experiência..." rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título - Links Úteis</label>
                    <Input value={footerData.linksTitle} onChange={e => setFooterData({
                    ...footerData,
                    linksTitle: e.target.value
                  })} placeholder="Links Úteis" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Título - Contato</label>
                    <Input value={footerData.contactTitle} onChange={e => setFooterData({
                    ...footerData,
                    contactTitle: e.target.value
                  })} placeholder="Contato" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Link - Início</label>
                    <Input value={footerData.linkInicio} onChange={e => setFooterData({
                    ...footerData,
                    linkInicio: e.target.value
                  })} placeholder="Início" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Link - Planos</label>
                    <Input value={footerData.linkPlanos} onChange={e => setFooterData({
                    ...footerData,
                    linkPlanos: e.target.value
                  })} placeholder="Planos" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Link - Destaque</label>
                    <Input value={footerData.linkKrator} onChange={e => setFooterData({
                    ...footerData,
                    linkKrator: e.target.value
                  })} placeholder="Sistema Krator" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Link - Suporte</label>
                    <Input value={footerData.linkSupport} onChange={e => setFooterData({
                    ...footerData,
                    linkSupport: e.target.value
                  })} placeholder="Suporte Técnico" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Botão WhatsApp</label>
                    <Input value={footerData.whatsappButton} onChange={e => setFooterData({
                    ...footerData,
                    whatsappButton: e.target.value
                  })} placeholder="Falar no WhatsApp" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de Ativação</label>
                    <Input value={footerData.activationText} onChange={e => setFooterData({
                    ...footerData,
                    activationText: e.target.value
                  })} placeholder="⚡ Ativação imediata" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Título - Redes Sociais</label>
                    <Input value={footerData.socialTitle} onChange={e => setFooterData({
                    ...footerData,
                    socialTitle: e.target.value
                  })} placeholder="Redes Sociais" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slogan Final</label>
                  <Input value={footerData.tagline} onChange={e => setFooterData({
                  ...footerData,
                  tagline: e.target.value
                })} placeholder="Wapp TV - Transformando sua experiência..." />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ContentConfig;