
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, TestTube, Users, Eye, EyeOff } from 'lucide-react';

const ButtonsConfig = () => {
  const { adminData, updateMessages, updateButtonTexts, updateResellerSettings, updateSocialLinks } = useAdmin();
  const { toast } = useToast();

  const [messages, setMessages] = useState(adminData.messages);
  const [buttonTexts, setButtonTexts] = useState(adminData.buttonTexts);
  const [resellerSettings, setResellerSettings] = useState(adminData.resellerSettings);
  const [socialLinks, setSocialLinks] = useState({
    facebook: adminData.socialLinks?.facebook || '',
    instagram: adminData.socialLinks?.instagram || '',
    youtube: adminData.socialLinks?.youtube || ''
  });

  const handleSaveMessages = () => {
    updateMessages(messages);
    toast({
      title: "Mensagens atualizadas!",
      description: "As mensagens dos botões foram salvas com sucesso.",
    });
  };

  const handleSaveButtonTexts = () => {
    updateButtonTexts(buttonTexts);
    toast({
      title: "Textos dos botões atualizados!",
      description: "Os textos dos botões foram salvos com sucesso.",
    });
  };

  const handleSaveResellerSettings = () => {
    updateResellerSettings(resellerSettings);
    toast({
      title: "Configurações de revendedores atualizadas!",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  const handleSaveSocialLinks = () => {
    updateSocialLinks(socialLinks);
    toast({
      title: "Links das redes sociais atualizados!",
      description: "Os links foram salvos com sucesso.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Configurar Botões</h1>
        <p className="text-gray-400">Gerencie mensagens, textos dos botões e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gerenciar Mensagens */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Mensagens dos Botões</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Mensagem padrão (Planos normais)</Label>
              <Textarea
                value={messages.default}
                onChange={(e) => setMessages({ ...messages, default: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
                <Label className="text-gray-300">Mensagem do plano Destaque</Label>
              <Textarea
                value={messages.krator}
                onChange={(e) => setMessages({ ...messages, krator: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Mensagem de contato (Footer)</Label>
              <Textarea
                value={messages.contact}
                onChange={(e) => setMessages({ ...messages, contact: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Mensagem teste 4 horas</Label>
              <Textarea
                value={messages.trial4h}
                onChange={(e) => setMessages({ ...messages, trial4h: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Mensagem teste 1 hora (Krator)</Label>
              <Textarea
                value={messages.trial1h}
                onChange={(e) => setMessages({ ...messages, trial1h: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Mensagem revendedores</Label>
              <Textarea
                value={messages.reseller}
                onChange={(e) => setMessages({ ...messages, reseller: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <Button onClick={handleSaveMessages} className="w-full bg-green-500 hover:bg-green-600">
              Salvar Mensagens
            </Button>
          </div>
        </div>

        {/* Gerenciar Textos dos Botões */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <TestTube className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Textos dos Botões</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Texto botão teste 4 horas</Label>
              <Input
                value={buttonTexts.trial4h}
                onChange={(e) => setButtonTexts({ ...buttonTexts, trial4h: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Texto botão teste 1 hora (Krator)</Label>
              <Input
                value={buttonTexts.trial1h}
                onChange={(e) => setButtonTexts({ ...buttonTexts, trial1h: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Texto botão revendedores</Label>
              <Input
                value={buttonTexts.reseller}
                onChange={(e) => setButtonTexts({ ...buttonTexts, reseller: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button onClick={handleSaveButtonTexts} className="w-full bg-green-500 hover:bg-green-600">
              Salvar Textos dos Botões
            </Button>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Links das Redes Sociais</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Link do Facebook</Label>
              <Input
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://facebook.com/seu-perfil"
              />
            </div>

            <div>
              <Label className="text-gray-300">Link do Instagram</Label>
              <Input
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://instagram.com/seu-perfil"
              />
            </div>

            <div>
              <Label className="text-gray-300">Link do YouTube</Label>
              <Input
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://youtube.com/seu-canal"
              />
            </div>

            <Button onClick={handleSaveSocialLinks} className="w-full bg-green-500 hover:bg-green-600">
              Salvar Links das Redes Sociais
            </Button>
          </div>
        </div>
      </div>

      {/* Configurações de Revendedores */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-green-400" size={24} />
          <h2 className="text-xl font-bold text-white">Configurações de Revendedores</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setResellerSettings({ ...resellerSettings, showButton: !resellerSettings.showButton })}
              variant="outline"
              size="sm"
              className={`border-gray-600 ${resellerSettings.showButton ? 'text-green-400 border-green-400' : 'text-gray-400'}`}
            >
              {resellerSettings.showButton ? <Eye size={16} /> : <EyeOff size={16} />}
              {resellerSettings.showButton ? 'Visível' : 'Oculto'}
            </Button>
            <Label className="text-gray-300">Botão de revendedores</Label>
          </div>

          <Button onClick={handleSaveResellerSettings} className="w-full bg-green-500 hover:bg-green-600">
            Salvar Configurações de Revendedores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonsConfig;
