import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash, Plus, MessageSquare, LogOut } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Chat } from '@shared/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
export function ChatSidebar() {
  const queryClient = useQueryClient();
  const activeChatId = useAppStore((s) => s.activeChatId);
  const setActiveChatId = useAppStore((s) => s.setActiveChatId);
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
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
      toast.success('Room created');
    },
  });
  const handleCreateRoom = () => {
    const title = prompt('Room name:');
    if (title?.trim()) {
      createChatMutation.mutate(title.trim());
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatId(null);
  };
  const chats = chatsData?.items ?? [];
  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">Rooms</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCreateRoom} className="rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeChatId === chat.id 
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Hash className={cn("h-4 w-4", activeChatId === chat.id ? "text-orange-100" : "text-muted-foreground/50")} />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
          {chats.length === 0 && (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-muted-foreground">No rooms yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 center font-bold text-xs">
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}