import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  is_active: boolean;
  created_at: string;
}

const TenantsConfig = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    subdomain: '',
    is_active: true
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      domain: '',
      subdomain: '',
      is_active: true
    });
    setEditingTenant(null);
  };

  const openDialog = (tenant?: Tenant) => {
    if (tenant) {
      setEditingTenant(tenant);
      setFormData({
        name: tenant.name,
        domain: tenant.domain,
        subdomain: tenant.subdomain || '',
        is_active: tenant.is_active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTenant) {
        // Update existing tenant
        const { error } = await supabase
          .from('tenants')
          .update({
            name: formData.name,
            domain: formData.domain,
            subdomain: formData.subdomain || null,
            is_active: formData.is_active
          })
          .eq('id', editingTenant.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tenant atualizado com sucesso",
        });
      } else {
        // Create new tenant
        const { error } = await supabase
          .from('tenants')
          .insert({
            name: formData.name,
            domain: formData.domain,
            subdomain: formData.subdomain || null,
            is_active: formData.is_active
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tenant criado com sucesso",
        });
      }

      closeDialog();
      fetchTenants();
    } catch (error: any) {
      console.error('Error saving tenant:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar tenant",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (tenantId: string) => {
    if (!confirm('Tem certeza que deseja excluir este tenant? Todos os dados associados serão perdidos.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tenant excluído com sucesso",
      });

      fetchTenants();
    } catch (error: any) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir tenant",
        variant: "destructive",
      });
    }
  };

  const toggleTenantStatus = async (tenant: Tenant) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ is_active: !tenant.is_active })
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Tenant ${!tenant.is_active ? 'ativado' : 'desativado'} com sucesso`,
      });

      fetchTenants();
    } catch (error: any) {
      console.error('Error updating tenant status:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status do tenant",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Tenants</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes e seus domínios associados
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tenant
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTenant ? 'Editar Tenant' : 'Novo Tenant'}
              </DialogTitle>
              <DialogDescription>
                {editingTenant ? 'Edite as informações do tenant' : 'Adicione um novo tenant ao sistema'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domínio Principal</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="exemplo.com"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subdomain">Subdomínio (opcional)</Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    placeholder="cliente.wapptv.top"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTenant ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {tenant.name}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tenant.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {tenant.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Criado em {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTenantStatus(tenant)}
                  >
                    {tenant.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(tenant)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tenant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Domínio Principal: </span>
                  <span className="text-muted-foreground">{tenant.domain}</span>
                </div>
                {tenant.subdomain && (
                  <div>
                    <span className="font-medium">Subdomínio: </span>
                    <span className="text-muted-foreground">{tenant.subdomain}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tenants.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhum tenant encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantsConfig;