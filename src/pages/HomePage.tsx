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
import { motion } from 'framer-motion';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen overflow-hidden">
      <div className="py-8 md:py-10 lg:py-12 h-full flex flex-col items-center justify-center relative">
        <ThemeToggle />
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-300/30 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-300/30 blur-[120px] rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/40 dark:bg-zinc-950/40 blur-[120px] rounded-full" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-10 relative z-10"
        >
          <div className="flex flex-col items-center space-y-6">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow-lg cursor-pointer"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <div className="space-y-3 text-center">
              <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter">
                Aura <span className="text-gradient">Chat</span>
              </h1>
              <p className="text-muted-foreground text-lg text-pretty max-w-xs mx-auto">
                Join the minimalist messaging network built for the edge.
              </p>
            </div>
          </div>
          <Card className="p-8 glass-dark border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl">
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Your Identifier
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-orange-500 h-14 text-lg px-5 rounded-2xl"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-gradient h-14 group text-lg rounded-2xl shadow-lg"
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? 'Connecting...' : 'Join Network'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </form>
          </Card>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Global Edge Nodes Active</span>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}