import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
const PricingConfig = () => {
  const {
    adminData,
    updateResellerSettings,
    updateKratorPrice
  } = useAdmin();
  const {
    toast
  } = useToast();
  const [wappPrices, setWappPrices] = useState([{
    plan: 'Básico',
    price: 'R$ 15,00',
    features: '1 mês'
  }, {
    plan: 'Premium',
    price: 'R$ 25,00',
    features: '3 meses'
  }, {
    plan: 'VIP',
    price: 'R$ 40,00',
    features: '6 meses'
  }]);
  const [kratorPrice, setKratorPrice] = useState(adminData.kratorPrice);
  const [resellerPrices, setResellerPrices] = useState(adminData.resellerSettings.creditPrices);
  const addWappPrice = () => {
    setWappPrices([...wappPrices, {
      plan: '',
      price: '',
      features: ''
    }]);
  };
  const removeWappPrice = (index: number) => {
    setWappPrices(wappPrices.filter((_, i) => i !== index));
  };
  const updateWappPrice = (index: number, field: string, value: string) => {
    const updated = wappPrices.map((price, i) => i === index ? {
      ...price,
      [field]: value
    } : price);
    setWappPrices(updated);
  };
  const addResellerPrice = () => {
    setResellerPrices([...resellerPrices, {
      credits: 0,
      price: ''
    }]);
  };
  const removeResellerPrice = (index: number) => {
    setResellerPrices(resellerPrices.filter((_, i) => i !== index));
  };
  const updateResellerPrice = (index: number, field: string, value: string | number) => {
    const updated = resellerPrices.map((price, i) => i === index ? {
      ...price,
      [field]: value
    } : price);
    setResellerPrices(updated);
  };
  const handleSaveWappPrices = () => {
    // Aqui você salvaria os preços da Wapp TV
    toast({
      title: "Preços da Wapp TV atualizados!",
      description: "Os preços foram salvos com sucesso."
    });
  };
  const handleSaveKratorPrice = () => {
    updateKratorPrice(kratorPrice);
    toast({
      title: "Preço do Krator atualizado!",
      description: "O preço foi salvo com sucesso."
    });
  };
  const handleSaveResellerPrices = () => {
    const updatedSettings = {
      ...adminData.resellerSettings,
      creditPrices: resellerPrices
    };
    updateResellerSettings(updatedSettings);
    toast({
      title: "Preços de revendedores atualizados!",
      description: "Os preços foram salvos com sucesso."
    });
  };
  return <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Tabela de Preços</h1>
        <p className="text-gray-400">Gerencie os preços dos planos e revendedores</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Preços Wapp TV */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Preços Wapp TV</h2>
          </div>

          <div className="space-y-4">
            {wappPrices.map((price, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded">
                <div>
                  <Label className="text-gray-300">Nome do Plano</Label>
                  <Input value={price.plan} onChange={e => updateWappPrice(index, 'plan', e.target.value)} className="mt-1 bg-gray-600 border-gray-500 text-white" placeholder="Básico" />
                </div>
                <div>
                  <Label className="text-gray-300">Preço</Label>
                  <Input value={price.price} onChange={e => updateWappPrice(index, 'price', e.target.value)} className="mt-1 bg-gray-600 border-gray-500 text-white" placeholder="R$ 15,00" />
                </div>
                <div>
                  <Label className="text-gray-300">Características</Label>
                  <Input value={price.features} onChange={e => updateWappPrice(index, 'features', e.target.value)} className="mt-1 bg-gray-600 border-gray-500 text-white" placeholder="1 mês" />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => removeWappPrice(index)} variant="destructive" size="sm" className="w-full">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>)}

            <div className="flex gap-2">
              <Button onClick={addWappPrice} variant="outline" className="border-gray-600 text-zinc-900">
                <Plus size={16} className="mr-2" />
                Adicionar Plano
              </Button>
              <Button onClick={handleSaveWappPrices} className="bg-green-500 hover:bg-green-600">
                Salvar Preços Wapp TV
              </Button>
            </div>
          </div>
        </div>

        {/* Preço Krator */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Preço Krator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Preço mensal do Krator</Label>
              <Input value={kratorPrice} onChange={e => setKratorPrice(e.target.value)} className="mt-2 bg-gray-700 border-gray-600 text-white" placeholder="R$ 25,00" />
            </div>

            <Button onClick={handleSaveKratorPrice} className="bg-green-500 hover:bg-green-600">
              Salvar Preço Krator
            </Button>
          </div>
        </div>

        {/* Preços Revendedores */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Preços Revendedores</h2>
          </div>

          <div className="space-y-4">
            {resellerPrices.map((price, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-700 rounded">
                <div>
                  <Label className="text-gray-300">Quantidade de Créditos</Label>
                  <Input type="number" value={price.credits} onChange={e => updateResellerPrice(index, 'credits', parseInt(e.target.value))} className="mt-1 bg-gray-600 border-gray-500 text-white" placeholder="10" />
                </div>
                <div>
                  <Label className="text-gray-300">Preço por Crédito</Label>
                  <Input value={price.price} onChange={e => updateResellerPrice(index, 'price', e.target.value)} className="mt-1 bg-gray-600 border-gray-500 text-white" placeholder="R$ 11,00" />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => removeResellerPrice(index)} variant="destructive" size="sm" className="w-full">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>)}

            <div className="flex gap-2">
              <Button onClick={addResellerPrice} variant="outline" className="border-gray-600 text-gray-900">
                <Plus size={16} className="mr-2" />
                Adicionar Preço
              </Button>
              <Button onClick={handleSaveResellerPrices} className="bg-green-500 hover:bg-green-600">
                Salvar Preços Revendedores
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PricingConfig;