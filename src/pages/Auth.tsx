
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeTheme, convertHslToValidColor } = useTheme();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao painel administrativo.",
        });
        
        navigate('/admin/dashboard');
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
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom right, rgb(17, 24, 39), rgb(31, 41, 55), ${activeTheme?.primary_color ? convertHslToValidColor(activeTheme.primary_color) : '#14532d'})`
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: activeTheme?.primary_color ? convertHslToValidColor(activeTheme.primary_color) : '#4ade80' }}
            >
              Wapp TV
            </h1>
            <p className="text-gray-300">
              Login Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="admin@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3"
              style={{
                backgroundColor: activeTheme?.primary_color ? convertHslToValidColor(activeTheme.primary_color) : '#22c55e'
              }}
              onMouseEnter={(e) => {
                if (activeTheme?.primary_color) {
                  const color = convertHslToValidColor(activeTheme.primary_color);
                  // Create a darker shade for hover by reducing lightness
                  const darkerColor = color.replace(/(\d+)%\)$/, (match, lightness) => {
                    const newLightness = Math.max(0, parseInt(lightness) - 10);
                    return `${newLightness}%)`;
                  });
                  e.currentTarget.style.backgroundColor = darkerColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTheme?.primary_color) {
                  e.currentTarget.style.backgroundColor = convertHslToValidColor(activeTheme.primary_color);
                }
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 transition-colors"
              onMouseEnter={(e) => {
                if (activeTheme?.primary_color) {
                  e.currentTarget.style.color = convertHslToValidColor(activeTheme.primary_color);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              ← Voltar ao site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
