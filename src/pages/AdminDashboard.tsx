import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Phone, MessageSquare, Plus, Trash2, TestTube, Users, Eye, EyeOff } from 'lucide-react';

const AdminDashboard = () => {
  const { adminData, updateContacts, updateResellerContacts, updateMessages, updateButtonTexts, updateResellerSettings } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contacts, setContacts] = useState<string[]>(adminData.contacts);
  const [resellerContacts, setResellerContacts] = useState<string[]>(adminData.resellerContacts);
  const [messages, setMessages] = useState(adminData.messages);
  const [buttonTexts, setButtonTexts] = useState(adminData.buttonTexts);
  const [resellerSettings, setResellerSettings] = useState(adminData.resellerSettings);
  const [newContact, setNewContact] = useState('');
  const [newResellerContact, setNewResellerContact] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
  };

  const handleSaveContacts = () => {
    updateContacts(contacts);
    toast({
      title: "Contatos atualizados!",
      description: "Os números de WhatsApp foram salvos com sucesso.",
    });
  };

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

  const addContact = () => {
    if (newContact.trim() && !contacts.includes(newContact.trim())) {
      setContacts([...contacts, newContact.trim()]);
      setNewContact('');
    }
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSaveResellerContacts = () => {
    updateResellerContacts(resellerContacts);
    toast({
      title: "Contatos de revendedores atualizados!",
      description: "Os números dos revendedores foram salvos com sucesso.",
    });
  };

  const handleSaveResellerSettings = () => {
    updateResellerSettings(resellerSettings);
    toast({
      title: "Configurações de revendedores atualizadas!",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  const addResellerContact = () => {
    if (newResellerContact.trim() && !resellerContacts.includes(newResellerContact.trim())) {
      setResellerContacts([...resellerContacts, newResellerContact.trim()]);
      setNewResellerContact('');
    }
  };

  const removeResellerContact = (index: number) => {
    setResellerContacts(resellerContacts.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Wapp TV Admin</h1>
            <p className="text-gray-400">Painel de Administração</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Ver Site
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gerenciar Contatos */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Números do WhatsApp</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Adicionar novo número</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="+5519999999999"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={() => {
                    if (newContact.trim() && !contacts.includes(newContact.trim())) {
                      setContacts([...contacts, newContact.trim()]);
                      setNewContact('');
                    }
                  }} size="sm" className="bg-green-500 hover:bg-green-600">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Números ativos</Label>
                <div className="space-y-2 mt-2">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-700 p-3 rounded">
                      <span className="text-white flex-1">{contact}</span>
                      <Button
                        onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => {
                updateContacts(contacts);
                toast({
                  title: "Contatos atualizados!",
                  description: "Os números de WhatsApp foram salvos com sucesso.",
                });
              }} className="w-full bg-green-500 hover:bg-green-600">
                Salvar Contatos
              </Button>
            </div>
          </div>

          {/* Gerenciar Contatos de Revendedores */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Números Revendedores</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Adicionar novo número</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newResellerContact}
                    onChange={(e) => setNewResellerContact(e.target.value)}
                    placeholder="+5519999999999"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={addResellerContact} size="sm" className="bg-green-500 hover:bg-green-600">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Números ativos</Label>
                <div className="space-y-2 mt-2">
                  {resellerContacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-700 p-3 rounded">
                      <span className="text-white flex-1">{contact}</span>
                      <Button
                        onClick={() => removeResellerContact(index)}
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveResellerContacts} className="w-full bg-green-500 hover:bg-green-600">
                Salvar Contatos
              </Button>
            </div>
          </div>

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
                <Label className="text-gray-300">Mensagem Krator</Label>
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

              <Button onClick={() => {
                updateMessages(messages);
                toast({
                  title: "Mensagens atualizadas!",
                  description: "As mensagens dos botões foram salvas com sucesso.",
                });
              }} className="w-full bg-green-500 hover:bg-green-600">
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

              <Button onClick={() => {
                updateButtonTexts(buttonTexts);
                toast({
                  title: "Textos dos botões atualizados!",
                  description: "Os textos dos botões foram salvos com sucesso.",
                });
              }} className="w-full bg-green-500 hover:bg-green-600">
                Salvar Textos dos Botões
              </Button>
            </div>
          </div>

          {/* Configurações de Revendedores */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
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

        {/* Estatísticas */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400">{contacts.length}</div>
              <div className="text-gray-300">Números ativos</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400">{resellerContacts.length}</div>
              <div className="text-gray-300">Números revendedores</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400">6</div>
              <div className="text-gray-300">Mensagens configuradas</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400">3</div>
              <div className="text-gray-300">Botões de ação</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400">Online</div>
              <div className="text-gray-300">Status do sistema</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
