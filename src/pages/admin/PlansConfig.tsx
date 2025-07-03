
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

const PlansConfig = () => {
  const { adminData, updatePlans, updatePopularText } = useAdmin();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>(adminData.plans);
  const [popularText, setPopularText] = useState(adminData.popularText);

  const addPlan = () => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: '',
      price: '',
      period: 'por mês',
      features: [''],
      popular: false
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const updatePlan = (planId: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, [field]: value } : plan
    ));
  };

  const addFeature = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, features: [...plan.features, ''] }
        : plan
    ));
  };

  const removeFeature = (planId: string, featureIndex: number) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, features: plan.features.filter((_, index) => index !== featureIndex) }
        : plan
    ));
  };

  const updateFeature = (planId: string, featureIndex: number, value: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { 
            ...plan, 
            features: plan.features.map((feature, index) => 
              index === featureIndex ? value : feature
            )
          }
        : plan
    ));
  };

  const handleSavePlans = () => {
    updatePlans(plans);
    toast({
      title: "Planos atualizados!",
      description: "Os planos foram salvos com sucesso."
    });
  };

  const handleSavePopularText = () => {
    updatePopularText(popularText);
    toast({
      title: "Texto popular atualizado!",
      description: "O texto foi salvo com sucesso."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Configurar Planos</h1>
        <p className="text-gray-400">Gerencie os planos exibidos na página principal</p>
      </div>

      {/* Texto Popular */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Star className="text-green-400" size={24} />
          <h2 className="text-xl font-bold text-white">Texto do Plano Popular</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Texto exibido no plano popular</Label>
            <Input
              value={popularText}
              onChange={(e) => setPopularText(e.target.value)}
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              placeholder="MAIS POPULAR"
            />
          </div>

          <Button onClick={handleSavePopularText} className="bg-green-500 hover:bg-green-600">
            Salvar Texto Popular
          </Button>
        </div>
      </div>

      {/* Planos */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Edit className="text-green-400" size={24} />
          <h2 className="text-xl font-bold text-white">Gerenciar Planos</h2>
        </div>

        <div className="space-y-6">
          {plans.map((plan, planIndex) => (
            <div key={plan.id} className="p-6 bg-gray-700 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-gray-300">Nome do Plano</Label>
                  <Input
                    value={plan.name}
                    onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                    className="mt-1 bg-gray-600 border-gray-500 text-white"
                    placeholder="Plano 1 Tela"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Preço</Label>
                  <Input
                    value={plan.price}
                    onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                    className="mt-1 bg-gray-600 border-gray-500 text-white"
                    placeholder="R$ 25,00"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Período</Label>
                  <Input
                    value={plan.period}
                    onChange={(e) => updatePlan(plan.id, 'period', e.target.value)}
                    className="mt-1 bg-gray-600 border-gray-500 text-white"
                    placeholder="por mês"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch
                      checked={plan.popular}
                      onCheckedChange={(checked) => updatePlan(plan.id, 'popular', checked)}
                    />
                    <Label className="text-gray-300">Plano Popular</Label>
                  </div>
                  <Button
                    onClick={() => removePlan(plan.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Características do Plano</Label>
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(plan.id, featureIndex, e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Digite uma característica"
                      />
                      <Button
                        onClick={() => removeFeature(plan.id, featureIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addFeature(plan.id)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-900"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Característica
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={addPlan} variant="outline" className="border-gray-600 text-gray-900">
              <Plus size={16} className="mr-2" />
              Adicionar Plano
            </Button>
            <Button onClick={handleSavePlans} className="bg-green-500 hover:bg-green-600">
              Salvar Planos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansConfig;
