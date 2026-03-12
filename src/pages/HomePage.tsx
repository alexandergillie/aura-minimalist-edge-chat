import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { User } from '@shared/types';
import { toast, Toaster } from 'sonner';
export function HomePage() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const navigate = useNavigate();
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const user = await api<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() }),
      });
      setCurrentUser(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/chat');
    } catch (error) {
      toast.error('Failed to join the network');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black p-4 relative overflow-hidden">
      <ThemeToggle />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
        <div className="center-col space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary floating">
            <Sparkles className="w-8 h-8 text-white rotating" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Aura <span className="text-gradient">Chat</span>
            </h1>
            <p className="text-muted-foreground text-pretty">
              Minimalist messaging at the speed of light.
            </p>
          </div>
        </div>
        <Card className="p-6 glass border-zinc-200/50 dark:border-zinc-800/50 shadow-soft">
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">
                Display Name
              </label>
              <Input
                id="name"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/50 dark:bg-black/50 border-zinc-200 focus:ring-orange-500 h-11"
                disabled={isLoading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full btn-gradient h-11 group" 
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Joining...' : 'Get Started'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Card>
        <p className="text-center text-xs text-muted-foreground px-8 leading-relaxed">
          By joining, you'll be connected to the global Aura network powered by Cloudflare Edge.
        </p>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}