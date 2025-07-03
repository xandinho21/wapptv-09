
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Trash2, Plus, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Tutorial {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

const TutorialsConfig = () => {
  const { adminData, updateTutorials } = useAdmin();
  const [tutorials, setTutorials] = useState<Tutorial[]>(adminData.tutorials);

  const handleAddTutorial = () => {
    const newTutorial: Tutorial = {
      id: Date.now().toString(),
      title: '',
      imageUrl: '',
      link: ''
    };
    setTutorials([...tutorials, newTutorial]);
  };

  const handleRemoveTutorial = (id: string) => {
    setTutorials(tutorials.filter(tutorial => tutorial.id !== id));
  };

  const handleTutorialChange = (id: string, field: keyof Tutorial, value: string) => {
    setTutorials(tutorials.map(tutorial => 
      tutorial.id === id ? { ...tutorial, [field]: value } : tutorial
    ));
  };

  const handleSave = () => {
    // Filtrar tutoriais vazios
    const validTutorials = tutorials.filter(tutorial => 
      tutorial.title.trim() && tutorial.imageUrl.trim() && tutorial.link.trim()
    );
    
    updateTutorials(validTutorials);
    setTutorials(validTutorials);
    toast.success('Tutoriais salvos com sucesso!');
  };

  const testLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Configurar Tutoriais</h2>
          <p className="text-gray-400 mt-2">
            Gerencie os tutoriais que aparecem nos slides da página inicial
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAddTutorial} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Tutorial
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
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
                onClick={() => handleRemoveTutorial(tutorial.id)}
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
                    onChange={(e) => handleTutorialChange(tutorial.id, 'title', e.target.value)}
                    placeholder="Ex: Como instalar no Smart TV"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`imageUrl-${tutorial.id}`} className="text-gray-300">
                    URL da Imagem (1:1)
                  </Label>
                  <Input
                    id={`imageUrl-${tutorial.id}`}
                    value={tutorial.imageUrl}
                    onChange={(e) => handleTutorialChange(tutorial.id, 'imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`link-${tutorial.id}`} className="text-gray-300">
                  Link do Tutorial
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`link-${tutorial.id}`}
                    value={tutorial.link}
                    onChange={(e) => handleTutorialChange(tutorial.id, 'link', e.target.value)}
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

              {tutorial.imageUrl && (
                <div className="mt-4">
                  <Label className="text-gray-300 mb-2 block">Preview da Imagem:</Label>
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
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {tutorials.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">Nenhum tutorial configurado</p>
              <Button onClick={handleAddTutorial} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Tutorial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TutorialsConfig;
