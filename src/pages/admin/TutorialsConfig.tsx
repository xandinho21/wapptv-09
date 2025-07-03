
import React, { useState, useRef } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Trash2, Plus, Save, ExternalLink, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Tutorial {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

const TutorialsConfig = () => {
  const { adminData, updateTutorials, updateKratorTutorials } = useAdmin();
  const [wappTutorials, setWappTutorials] = useState<Tutorial[]>(adminData.tutorials);
  const [kratorTutorials, setKratorTutorials] = useState<Tutorial[]>(adminData.kratorTutorials);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddTutorial = (type: 'wapp' | 'krator') => {
    const newTutorial: Tutorial = {
      id: Date.now().toString(),
      title: '',
      imageUrl: '',
      link: ''
    };

    if (type === 'wapp') {
      setWappTutorials([...wappTutorials, newTutorial]);
    } else {
      setKratorTutorials([...kratorTutorials, newTutorial]);
    }
  };

  const handleRemoveTutorial = (id: string, type: 'wapp' | 'krator') => {
    if (type === 'wapp') {
      setWappTutorials(wappTutorials.filter(tutorial => tutorial.id !== id));
    } else {
      setKratorTutorials(kratorTutorials.filter(tutorial => tutorial.id !== id));
    }
  };

  const handleTutorialChange = (id: string, field: keyof Tutorial, value: string, type: 'wapp' | 'krator') => {
    if (type === 'wapp') {
      setWappTutorials(wappTutorials.map(tutorial => 
        tutorial.id === id ? { ...tutorial, [field]: value } : tutorial
      ));
    } else {
      setKratorTutorials(kratorTutorials.map(tutorial => 
        tutorial.id === id ? { ...tutorial, [field]: value } : tutorial
      ));
    }
  };

  const handleImageUpload = (id: string, file: File, type: 'wapp' | 'krator') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleTutorialChange(id, 'imageUrl', imageUrl, type);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem');
    }
  };

  const handleSave = () => {
    // Filtrar tutoriais vazios
    const validWappTutorials = wappTutorials.filter(tutorial => 
      tutorial.title.trim() && tutorial.imageUrl.trim() && tutorial.link.trim()
    );
    
    const validKratorTutorials = kratorTutorials.filter(tutorial => 
      tutorial.title.trim() && tutorial.imageUrl.trim() && tutorial.link.trim()
    );
    
    updateTutorials(validWappTutorials);
    updateKratorTutorials(validKratorTutorials);
    setWappTutorials(validWappTutorials);
    setKratorTutorials(validKratorTutorials);
    toast.success('Tutoriais salvos com sucesso!');
  };

  const testLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const renderTutorialSection = (tutorials: Tutorial[], type: 'wapp' | 'krator', title: string, color: string) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 mt-1">
            Gerencie os tutoriais que aparecem na seção {type === 'wapp' ? 'Wapp TV' : 'Krator'}
          </p>
        </div>
        <Button onClick={() => handleAddTutorial(type)} className={`bg-${color}-600 hover:bg-${color}-700`}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tutorial
        </Button>
      </div>

      <div className="grid gap-6">
        {tutorials.map((tutorial, index) => (
          <Card key={tutorial.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg text-white">
                Tutorial #{index + 1}
              </CardTitle>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveTutorial(tutorial.id, type)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${tutorial.id}`} className="text-gray-300">
                    Título do Tutorial
                  </Label>
                  <Input
                    id={`title-${tutorial.id}`}
                    value={tutorial.title}
                    onChange={(e) => handleTutorialChange(tutorial.id, 'title', e.target.value, type)}
                    placeholder="Ex: Como instalar no Smart TV"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`link-${tutorial.id}`} className="text-gray-300">
                    Link do Tutorial
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`link-${tutorial.id}`}
                      value={tutorial.link}
                      onChange={(e) => handleTutorialChange(tutorial.id, 'link', e.target.value, type)}
                      placeholder="https://example.com/tutorial"
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => testLink(tutorial.link)}
                      disabled={!tutorial.link}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  Imagem do Tutorial (1:1)
                </Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(tutorial.id, file, type);
                        }
                      }}
                      ref={(el) => {
                        fileInputRefs.current[`${type}-${tutorial.id}`] = el;
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRefs.current[`${type}-${tutorial.id}`]?.click()}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {tutorial.imageUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
                    </Button>
                  </div>
                  
                  {tutorial.imageUrl && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
                      <img 
                        src={tutorial.imageUrl} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tutorials.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">Nenhum tutorial configurado</p>
              <Button onClick={() => handleAddTutorial(type)} className={`bg-${color}-600 hover:bg-${color}-700`}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Tutorial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Configurar Tutoriais</h2>
          <p className="text-gray-400 mt-2">
            Gerencie os tutoriais que aparecem nos slides da página inicial
          </p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="wapp" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="wapp" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Tutoriais Wapp TV
          </TabsTrigger>
          <TabsTrigger value="krator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Tutoriais Krator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wapp" className="mt-6">
          {renderTutorialSection(wappTutorials, 'wapp', 'Tutoriais Wapp TV', 'green')}
        </TabsContent>
        
        <TabsContent value="krator" className="mt-6">
          {renderTutorialSection(kratorTutorials, 'krator', 'Tutoriais Krator', 'purple')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialsConfig;
