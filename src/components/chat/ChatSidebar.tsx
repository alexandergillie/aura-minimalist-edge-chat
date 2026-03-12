import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash, Plus, MessageSquare, LogOut, Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Chat } from '@shared/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CreateRoomDialog } from './CreateRoomDialog';
export function ChatSidebar() {
  const queryClient = useQueryClient();
  const activeChatId = useAppStore((s) => s.activeChatId);
  const setActiveChatId = useAppStore((s) => s.setActiveChatId);
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: chatsData } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api<{ items: Chat[] }>('/api/chats'),
    refetchInterval: 5000,
  });
  const createChatMutation = useMutation({
    mutationFn: (title: string) =>
      api<Chat>('/api/chats', { method: 'POST', body: JSON.stringify({ title }) }),
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setActiveChatId(newChat.id);
      toast.success('Room created successfully');
    },
  });
  const chats = useMemo(() => {
    const list = chatsData?.items ?? [];
    if (!searchQuery.trim()) return list;
    return list.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chatsData, searchQuery]);
  // Mock unread state for visual polish
  const unreadChats = useMemo(() => {
    return new Set(['c1', 'c3']); 
  }, []);
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatId(null);
  };
  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <span className="font-black text-xl tracking-tight">Aura</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDialogOpen(true)} 
            className="rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20 text-orange-600 dark:text-orange-400"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none text-sm"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-6">
          <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Channels
          </h3>
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group text-sm font-semibold relative",
                activeChatId === chat.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
              )}
            >
              <Hash className={cn("h-4 w-4 transition-colors", activeChatId === chat.id ? "text-orange-100" : "text-muted-foreground/40 group-hover:text-orange-400")} />
              <span className="truncate flex-1 text-left">{chat.title}</span>
              {unreadChats.has(chat.id) && activeChatId !== chat.id && (
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse ring-4 ring-orange-500/10" />
              )}
            </button>
          ))}
          {chats.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <Search className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-xs text-muted-foreground px-4">No rooms found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 center font-black text-orange-600 dark:text-orange-400 text-sm">
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate leading-tight">{currentUser?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Active</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="rounded-xl text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CreateRoomDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onCreate={(title) => createChatMutation.mutate(title)}
        isPending={createChatMutation.isPending}
      />
    </div>
  );
}