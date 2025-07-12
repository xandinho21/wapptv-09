import React, { useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const ResellerConfig = () => {
  const { adminData, updateContentSettings } = useAdminContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [resellerData, setResellerData] = useState(adminData.content.reseller);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('reseller', resellerData);
      toast({
        title: "Sucesso",
        description: "Configurações de Revendedor atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuração de Revendedor</h1>
        <p className="text-gray-600">Gerencie todos os textos da seção de revendedores</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção Revendedor</CardTitle>
          <CardDescription>Configure todos os textos relacionados aos revendedores</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Títulos principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Títulos Principais</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Título Principal</label>
                <Input
                  value={resellerData.title}
                  onChange={(e) => setResellerData({...resellerData, title: e.target.value})}
                  placeholder="Seja um Revendedor"
                />
                <p className="text-sm text-gray-500 mt-1">Use {'{siteName}'} para inserir o nome do site automaticamente</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <Textarea
                  value={resellerData.subtitle}
                  onChange={(e) => setResellerData({...resellerData, subtitle: e.target.value})}
                  placeholder="Faça parte da nossa rede..."
                  rows={3}
                />
              </div>
            </div>

            {/* Cards de benefícios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cards de Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Suporte - Título</label>
                  <Input
                    value={resellerData.supportTitle}
                    onChange={(e) => setResellerData({...resellerData, supportTitle: e.target.value})}
                    placeholder="Suporte Completo"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2">Suporte - Texto</label>
                  <Textarea
                    value={resellerData.supportText}
                    onChange={(e) => setResellerData({...resellerData, supportText: e.target.value})}
                    placeholder="Oferecemos suporte técnico..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Comissões - Título</label>
                  <Input
                    value={resellerData.commissionTitle}
                    onChange={(e) => setResellerData({...resellerData, commissionTitle: e.target.value})}
                    placeholder="Comissões Atrativas"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2">Comissões - Texto</label>
                  <Textarea
                    value={resellerData.commissionText}
                    onChange={(e) => setResellerData({...resellerData, commissionText: e.target.value})}
                    placeholder="Ganhe comissões competitivas..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Qualidade - Título</label>
                  <Input
                    value={resellerData.qualityTitle}
                    onChange={(e) => setResellerData({...resellerData, qualityTitle: e.target.value})}
                    placeholder="Produtos de Qualidade"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2">Qualidade - Texto</label>
                  <Textarea
                    value={resellerData.qualityText}
                    onChange={(e) => setResellerData({...resellerData, qualityText: e.target.value})}
                    placeholder="Venda produtos testados..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Tabela de preços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tabela de Preços</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título da Tabela</label>
                  <Input
                    value={resellerData.priceTableTitle}
                    onChange={(e) => setResellerData({...resellerData, priceTableTitle: e.target.value})}
                    placeholder="Tabela de Preços para Revendedores"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Texto "Créditos"</label>
                  <Input
                    value={resellerData.creditsText}
                    onChange={(e) => setResellerData({...resellerData, creditsText: e.target.value})}
                    placeholder="créditos"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Texto "Por Crédito"</label>
                  <Input
                    value={resellerData.perCreditText}
                    onChange={(e) => setResellerData({...resellerData, perCreditText: e.target.value})}
                    placeholder="por crédito"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerConfig;