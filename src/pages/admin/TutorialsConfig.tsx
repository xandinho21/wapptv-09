import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
const TutorialsConfig = () => {
  const {
    adminData,
    updateTutorials
  } = useAdmin();
  const [wappTutorials, setWappTutorials] = useState(adminData.tutorials.wapp);
  const [kratorTutorials, setKratorTutorials] = useState(adminData.tutorials.krator);

  // Sync local state with adminData when it changes
  useEffect(() => {
    setWappTutorials(adminData.tutorials.wapp);
    setKratorTutorials(adminData.tutorials.krator);
  }, [adminData.tutorials.wapp, adminData.tutorials.krator]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'wapp' | 'krator', index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const imageUrl = event.target?.result as string;
        if (type === 'wapp') {
          const newTutorials = [...wappTutorials];
          newTutorials[index].image = imageUrl;
          setWappTutorials(newTutorials);
        } else {
          const newTutorials = [...kratorTutorials];
          newTutorials[index].image = imageUrl;
          setKratorTutorials(newTutorials);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const updateTutorialField = (type: 'wapp' | 'krator', index: number, field: 'title' | 'link', value: string) => {
    if (type === 'wapp') {
      const newTutorials = [...wappTutorials];
      newTutorials[index][field] = value;
      setWappTutorials(newTutorials);
    } else {
      const newTutorials = [...kratorTutorials];
      newTutorials[index][field] = value;
      setKratorTutorials(newTutorials);
    }
  };
  const addTutorial = (type: 'wapp' | 'krator') => {
    const newTutorial = {
      id: crypto.randomUUID(),
      title: '',
      image: '/placeholder.svg',
      link: ''
    };
    if (type === 'wapp') {
      setWappTutorials([...wappTutorials, newTutorial]);
    } else {
      setKratorTutorials([...kratorTutorials, newTutorial]);
    }
  };
  const removeTutorial = (type: 'wapp' | 'krator', index: number) => {
    if (type === 'wapp') {
      const newTutorials = wappTutorials.filter((_, i) => i !== index);
      setWappTutorials(newTutorials);
    } else {
      const newTutorials = kratorTutorials.filter((_, i) => i !== index);
      setKratorTutorials(newTutorials);
    }
  };
  const handleSave = async () => {
    try {
      // Validate tutorials before saving
      const allTutorials = [...wappTutorials, ...kratorTutorials];
      const invalidTutorials = allTutorials.filter(t => !t.title.trim() || !t.link.trim());
      if (invalidTutorials.length > 0) {
        toast.error('Por favor, preencha título e link para todos os tutoriais');
        return;
      }
      console.log('Salvando tutoriais:', {
        wappTutorials,
        kratorTutorials
      });
      await Promise.all([updateTutorials('wapp', wappTutorials), updateTutorials('krator', kratorTutorials)]);
      toast.success('Configurações dos tutoriais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar tutoriais:', error);
      toast.error('Erro ao salvar configurações. Tente novamente.');
    }
  };
  const renderTutorialForm = (tutorials: any[], type: 'wapp' | 'krator') => <div className="space-y-6">
      {tutorials.map((tutorial, index) => <Card key={tutorial.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-green-400">Tutorial {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeTutorial(type, index)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Título</Label>
              <Input value={tutorial.title} onChange={e => updateTutorialField(type, index, 'title', e.target.value)} placeholder="Digite o título do tutorial" className="bg-gray-700 border-gray-600 text-white" />
            </div>

            <div>
              <Label className="text-gray-300">Link</Label>
              <Input value={tutorial.link} onChange={e => updateTutorialField(type, index, 'link', e.target.value)} placeholder="https://exemplo.com/tutorial" className="bg-gray-700 border-gray-600 text-white" />
            </div>

            <div>
              <Label className="text-gray-300">Imagem</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
                  <img src={tutorial.image} alt={tutorial.title || 'Preview'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById(`file-${type}-${index}`)?.click()} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <Upload size={16} className="mr-2" />
                    Upload Imagem
                  </Button>
                  <input id={`file-${type}-${index}`} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, type, index)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>)}

      <Button onClick={() => addTutorial(type)} className="w-full bg-green-600 hover:bg-green-700">
        <Plus size={16} className="mr-2" />
        Adicionar Tutorial
      </Button>
    </div>;
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Configurar Tutoriais</h1>
        <p className="text-gray-400">Gerencie os tutoriais que aparecem no site</p>
      </div>

      <Tabs defaultValue="wapp" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="wapp" className="data-[state=active]:bg-green-600">
            Tutoriais Wapp TV
          </TabsTrigger>
          <TabsTrigger value="krator" className="data-[state=active]:bg-purple-600">Tutoriais Destaque</TabsTrigger>
        </TabsList>

        <TabsContent value="wapp" className="space-y-6">
          {renderTutorialForm(wappTutorials, 'wapp')}
        </TabsContent>

        <TabsContent value="krator" className="space-y-6">
          {renderTutorialForm(kratorTutorials, 'krator')}
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white">
        Salvar Configurações
      </Button>
    </div>;
};
export default TutorialsConfig;