import React, { useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const ResellerConfig = () => {
  const {
    adminData,
    updateContentSettings
  } = useAdminContext();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [resellerData, setResellerData] = useState(adminData.content.reseller);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('reseller', resellerData);
      toast({
        title: "Sucesso",
        description: "Configurações de Revendedor atualizadas com sucesso!"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-400">Configurações do Revendedor</h1>
        <p className="text-gray-400 mt-2">Configure todos os textos relacionados aos revendedores</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">Configurações da Seção Revendedor</CardTitle>
          <CardDescription>Configure todos os textos relacionados aos revendedores</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Títulos principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: '#d1c7c1' }}>Títulos Principais</h3>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Título Principal</label>
                <Input
                  value={resellerData.title}
                  onChange={(e) => setResellerData({ ...resellerData, title: e.target.value })}
                  placeholder="Seja um Revendedor"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Subtítulo</label>
                <Textarea
                  value={resellerData.subtitle}
                  onChange={(e) => setResellerData({ ...resellerData, subtitle: e.target.value })}
                  placeholder="Faça parte da nossa rede..."
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Cards de benefícios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: '#d1c7c1' }}>Cards de Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Suporte - Título</label>
                  <Input
                    value={resellerData.supportTitle}
                    onChange={(e) => setResellerData({ ...resellerData, supportTitle: e.target.value })}
                    placeholder="Suporte Completo"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2" style={{ color: '#d1c7c1' }}>Suporte - Texto</label>
                  <Textarea
                    value={resellerData.supportText}
                    onChange={(e) => setResellerData({ ...resellerData, supportText: e.target.value })}
                    placeholder="Oferecemos suporte técnico..."
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Comissões - Título</label>
                  <Input
                    value={resellerData.commissionTitle}
                    onChange={(e) => setResellerData({ ...resellerData, commissionTitle: e.target.value })}
                    placeholder="Comissões Atrativas"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2" style={{ color: '#d1c7c1' }}>Comissões - Texto</label>
                  <Textarea
                    value={resellerData.commissionText}
                    onChange={(e) => setResellerData({ ...resellerData, commissionText: e.target.value })}
                    placeholder="Ganhe comissões competitivas..."
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Qualidade - Título</label>
                  <Input
                    value={resellerData.qualityTitle}
                    onChange={(e) => setResellerData({ ...resellerData, qualityTitle: e.target.value })}
                    placeholder="Produtos de Qualidade"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <label className="block text-sm font-medium mb-2 mt-2" style={{ color: '#d1c7c1' }}>Qualidade - Texto</label>
                  <Textarea
                    value={resellerData.qualityText}
                    onChange={(e) => setResellerData({ ...resellerData, qualityText: e.target.value })}
                    placeholder="Venda produtos testados..."
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Tabela de preços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: '#d1c7c1' }}>Tabela de Preços</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Título da Tabela</label>
                  <Input
                    value={resellerData.priceTableTitle}
                    onChange={(e) => setResellerData({ ...resellerData, priceTableTitle: e.target.value })}
                    placeholder="Tabela de Preços para Revendedores"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Texto "Créditos"</label>
                  <Input
                    value={resellerData.creditsText}
                    onChange={(e) => setResellerData({ ...resellerData, creditsText: e.target.value })}
                    placeholder="créditos"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#d1c7c1' }}>Texto "Por Crédito"</label>
                  <Input
                    value={resellerData.perCreditText}
                    onChange={(e) => setResellerData({ ...resellerData, perCreditText: e.target.value })}
                    placeholder="por crédito"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full hover:opacity-90"
              style={{ backgroundColor: '#16a34a', color: '#f8fafc' }}
            >
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerConfig;
