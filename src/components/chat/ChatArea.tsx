import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Sparkles, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { ChatMessage } from '@shared/types';
import { useAppStore } from '@/store/useAppStore';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
export function ChatArea() {
  const queryClient = useQueryClient();
  const activeChatId = useAppStore((s) => s.activeChatId);
  const currentUser = useAppStore((s) => s.currentUser);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', activeChatId],
    queryFn: () => activeChatId ? api<ChatMessage[]>(`/api/chats/${activeChatId}/messages`) : Promise.resolve([]),
    enabled: !!activeChatId,
    refetchInterval: 2000,
  });
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) =>
      api<ChatMessage>(`/api/chats/${activeChatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser?.id, text: messageText }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeChatId] });
      setText('');
    },
  });
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChatId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(text.trim());
  };
  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground animate-pulse">
          <MessageCircle className="w-10 h-10" />
        </div>
        <div className="max-w-xs space-y-2">
          <h2 className="text-2xl font-display font-bold">Pick a Room</h2>
          <p className="text-muted-foreground">Select a channel from the sidebar to start reflecting your aura.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-bold tracking-tight">Live Conversation</h2>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwnMessage={msg.userId === currentUser?.id} 
            />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 md:p-6 bg-background/50 backdrop-blur-md border-t">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <Input
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-zinc-100 dark:bg-zinc-900 border-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl h-12 px-5"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-2xl w-12 h-12 btn-gradient shrink-0"
            disabled={!text.trim() || sendMessageMutation.isPending}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}