import React, { useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Plus, X } from 'lucide-react';
const KratorConfig = () => {
  const {
    adminData,
    updateContentSettings
  } = useAdminContext();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [kratorData, setKratorData] = useState(adminData.content.krator);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentSettings('krator', kratorData);
      toast({
        title: "Sucesso",
        description: "Configurações do Krator atualizadas com sucesso!"
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
  const addFeature = () => {
    setKratorData({
      ...kratorData,
      features: [...kratorData.features, '']
    });
  };
  const removeFeature = (index: number) => {
    const newFeatures = kratorData.features.filter((_, i) => i !== index);
    setKratorData({
      ...kratorData,
      features: newFeatures
    });
  };
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...kratorData.features];
    newFeatures[index] = value;
    setKratorData({
      ...kratorData,
      features: newFeatures
    });
  };
  const addPlanFeature = () => {
    setKratorData({
      ...kratorData,
      planFeatures: [...kratorData.planFeatures, '']
    });
  };
  const removePlanFeature = (index: number) => {
    const newFeatures = kratorData.planFeatures.filter((_, i) => i !== index);
    setKratorData({
      ...kratorData,
      planFeatures: newFeatures
    });
  };
  const updatePlanFeature = (index: number, value: string) => {
    const newFeatures = [...kratorData.planFeatures];
    newFeatures[index] = value;
    setKratorData({
      ...kratorData,
      planFeatures: newFeatures
    });
  };
  return <div className="space-y-6">
      <div>
        
        
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção Krator</CardTitle>
          <CardDescription>Configure todos os textos relacionados ao sistema Krator</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Títulos principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Títulos Principais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título Principal</label>
                  <Input value={kratorData.mainTitle} onChange={e => setKratorData({
                  ...kratorData,
                  mainTitle: e.target.value
                })} placeholder="Conheça o Novo Sistema Krator" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo Principal</label>
                  <Input value={kratorData.mainSubtitle} onChange={e => setKratorData({
                  ...kratorData,
                  mainSubtitle: e.target.value
                })} placeholder="Tecnologia revolucionária..." />
                </div>
              </div>
            </div>

            {/* Descrição do que é o Krator */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Descrição do Krator</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Título "O que é o Krator?"</label>
                <Input value={kratorData.whatTitle} onChange={e => setKratorData({
                ...kratorData,
                whatTitle: e.target.value
              })} placeholder="O que é o Krator?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição Completa</label>
                <Textarea value={kratorData.description} onChange={e => setKratorData({
                ...kratorData,
                description: e.target.value
              })} placeholder="O Krator é nosso sistema proprietário..." rows={4} />
              </div>
            </div>

            {/* Características do Krator */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Características do Sistema</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Recursos do Krator</label>
                {kratorData.features.map((feature, index) => <div key={index} className="flex gap-2 mb-2">
                    <Input value={feature} onChange={e => updateFeature(index, e.target.value)} placeholder="Digite uma característica..." />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>)}
                <Button type="button" variant="outline" onClick={addFeature} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Recurso
                </Button>
              </div>
            </div>

            {/* Cards de benefícios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cards de Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Performance - Título</label>
                  <Input value={kratorData.performanceTitle} onChange={e => setKratorData({
                  ...kratorData,
                  performanceTitle: e.target.value
                })} placeholder="Performance Superior" />
                  <label className="block text-sm font-medium mb-2 mt-2">Performance - Texto</label>
                  <Textarea value={kratorData.performanceText} onChange={e => setKratorData({
                  ...kratorData,
                  performanceText: e.target.value
                })} placeholder="Velocidade de carregamento..." rows={3} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Estabilidade - Título</label>
                  <Input value={kratorData.stabilityTitle} onChange={e => setKratorData({
                  ...kratorData,
                  stabilityTitle: e.target.value
                })} placeholder="Estabilidade Garantida" />
                  <label className="block text-sm font-medium mb-2 mt-2">Estabilidade - Texto</label>
                  <Textarea value={kratorData.stabilityText} onChange={e => setKratorData({
                  ...kratorData,
                  stabilityText: e.target.value
                })} placeholder="99.9% de uptime..." rows={3} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Qualidade - Título</label>
                  <Input value={kratorData.qualityTitle} onChange={e => setKratorData({
                  ...kratorData,
                  qualityTitle: e.target.value
                })} placeholder="Qualidade Adaptativa" />
                  <label className="block text-sm font-medium mb-2 mt-2">Qualidade - Texto</label>
                  <Textarea value={kratorData.qualityText} onChange={e => setKratorData({
                  ...kratorData,
                  qualityText: e.target.value
                })} placeholder="Ajuste automático..." rows={3} />
                </div>
              </div>
            </div>

            {/* Seção do plano */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seção do Plano Krator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título da Seção</label>
                  <Input value={kratorData.planSectionTitle} onChange={e => setKratorData({
                  ...kratorData,
                  planSectionTitle: e.target.value
                })} placeholder="Plano com Sistema Krator" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Plano</label>
                  <Input value={kratorData.planName} onChange={e => setKratorData({
                  ...kratorData,
                  planName: e.target.value
                })} placeholder="Krator 1 Tela" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Recursos do Plano</label>
                {kratorData.planFeatures.map((feature, index) => <div key={index} className="flex gap-2 mb-2">
                    <Input value={feature} onChange={e => updatePlanFeature(index, e.target.value)} placeholder="Digite um recurso do plano..." />
                    <Button type="button" variant="outline" size="sm" onClick={() => removePlanFeature(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>)}
                <Button type="button" variant="outline" onClick={addPlanFeature} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Recurso do Plano
                </Button>
              </div>
            </div>

            {/* Seção de teste grátis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seção de Teste Grátis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Teste</label>
                  <Input value={kratorData.trialTitle} onChange={e => setKratorData({
                  ...kratorData,
                  trialTitle: e.target.value
                })} placeholder="Teste Grátis" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duração</label>
                  <Input value={kratorData.trialDuration} onChange={e => setKratorData({
                  ...kratorData,
                  trialDuration: e.target.value
                })} placeholder="1 Hora" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <Input value={kratorData.trialSubtitle} onChange={e => setKratorData({
                  ...kratorData,
                  trialSubtitle: e.target.value
                })} placeholder="Sistema Krator" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição do Teste</label>
                  <Textarea value={kratorData.trialDescription} onChange={e => setKratorData({
                  ...kratorData,
                  trialDescription: e.target.value
                })} placeholder="Experimente o sistema Krator..." rows={3} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Recurso do Teste</label>
                  <Input value={kratorData.trialFeature} onChange={e => setKratorData({
                  ...kratorData,
                  trialFeature: e.target.value
                })} placeholder="Acesso completo por 1 hora" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Salvando...' : 'Salvar Todas as Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default KratorConfig;