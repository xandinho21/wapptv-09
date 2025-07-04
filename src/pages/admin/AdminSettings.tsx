
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    newEmail: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail
      });

      if (error) {
        toast({
          title: "Erro ao alterar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email alterado!",
          description: "Verifique seu novo email para confirmar a alteração.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        toast({
          title: "Erro ao alterar senha",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Senha alterada!",
          description: "Sua senha foi alterada com sucesso.",
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações do Administrador</h1>
        <p className="text-gray-400">Gerencie suas credenciais de acesso</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400">Alterar Email</CardTitle>
            <CardDescription className="text-gray-400">
              Atualize seu endereço de email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <Label htmlFor="currentEmail" className="text-gray-300">
                  Email Atual
                </Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-2 bg-gray-700 border-gray-600 text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="newEmail" className="text-gray-300">
                  Novo Email
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ newEmail: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="novo@email.com"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || emailData.newEmail === user?.email}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Alterando...' : 'Alterar Email'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400">Alterar Senha</CardTitle>
            <CardDescription className="text-gray-400">
              Atualize sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-gray-300">
                  Nova Senha
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Digite a nova senha"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
