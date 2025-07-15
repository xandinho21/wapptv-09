
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
  const { activeTheme } = useTheme();

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
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, 
          hsl(var(--theme-secondary) / 0.9), 
          hsl(var(--theme-primary) / 0.8), 
          hsl(var(--theme-accent) / 0.7))`
      }}
    >
      <div className="w-full max-w-md">
        <div 
          className="rounded-2xl p-8 border shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: `hsl(var(--theme-secondary) / 0.1)`,
            borderColor: `hsl(var(--theme-primary) / 0.3)`
          }}
        >
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: `hsl(var(--theme-primary))` }}
            >
              Wapp TV
            </h1>
            <p 
              className="opacity-80"
              style={{ color: `hsl(var(--theme-primary))` }}
            >
              Login Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label 
                htmlFor="email" 
                style={{ color: `hsl(var(--theme-primary))` }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-0 text-white placeholder:text-white/60"
                style={{
                  backgroundColor: `hsl(var(--theme-secondary) / 0.2)`,
                  borderColor: `hsl(var(--theme-primary) / 0.3)`
                }}
                placeholder="admin@email.com"
                required
              />
            </div>

            <div>
              <Label 
                htmlFor="password"
                style={{ color: `hsl(var(--theme-primary))` }}
              >
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 border-0 text-white placeholder:text-white/60"
                style={{
                  backgroundColor: `hsl(var(--theme-secondary) / 0.2)`,
                  borderColor: `hsl(var(--theme-primary) / 0.3)`
                }}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3 border-0 transition-all duration-300"
              style={{
                backgroundColor: `hsl(var(--theme-primary))`,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `hsl(var(--theme-accent))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `hsl(var(--theme-primary))`;
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="transition-colors duration-300"
              style={{ 
                color: `hsl(var(--theme-primary) / 0.7)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = `hsl(var(--theme-primary))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = `hsl(var(--theme-primary) / 0.7)`;
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
