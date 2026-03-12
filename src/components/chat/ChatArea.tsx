import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Sparkles, MessageCircle, Hash, Info } from 'lucide-react';
import { api } from '@/lib/api-client';
import { ChatMessage, Chat } from '@shared/types';
import { useAppStore } from '@/store/useAppStore';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
export function ChatArea() {
  const queryClient = useQueryClient();
  const activeChatId = useAppStore((s) => s.activeChatId);
  const currentUser = useAppStore((s) => s.currentUser);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: chatsData } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api<{ items: Chat[] }>('/api/chats'),
    enabled: !!activeChatId,
  });
  const activeChat = useMemo(() => 
    chatsData?.items.find(c => c.id === activeChatId),
    [chatsData, activeChatId]
  );
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', activeChatId],
    queryFn: () => activeChatId ? api<ChatMessage[]>(`/api/chats/${activeChatId}/messages`) : Promise.resolve([]),
    enabled: !!activeChatId,
    refetchInterval: 3000,
  });
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) =>
      api<ChatMessage>(`/api/chats/${activeChatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ 
          userId: currentUser?.id, 
          userName: currentUser?.name,
          text: messageText 
        }),
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
  }, [messages.length]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChatId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(text.trim());
  };
  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50/20 dark:bg-zinc-950/10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center text-orange-500 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 mb-8"
        >
          <Sparkles className="w-16 h-16 animate-pulse" />
        </motion.div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-black tracking-tight">Enter the Stream</h2>
          <p className="text-muted-foreground text-lg text-pretty">Select a frequency from the sidebar to begin communicating across the edge network.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="h-20 px-6 flex items-center justify-between border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight leading-none">{activeChat?.title || "Connecting..."}</h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Feed</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-2xl text-muted-foreground">
          <Info className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto min-h-full flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwnMessage={msg.userId === currentUser?.id}
              />
            ))}
          </AnimatePresence>
          <div ref={scrollRef} className="h-1" />
        </div>
      </ScrollArea>
      <div className="p-6 md:p-8 bg-gradient-to-t from-white via-white dark:from-zinc-950 dark:via-zinc-950 to-transparent">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder={`Message #${activeChat?.title || "..."}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-zinc-100/80 dark:bg-zinc-900/80 border-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-3xl h-14 px-6 text-base"
              disabled={sendMessageMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="rounded-[1.25rem] w-14 h-14 btn-gradient shrink-0 shadow-lg shadow-orange-500/20 active:scale-90 transition-transform"
            disabled={!text.trim() || sendMessageMutation.isPending}
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
      </div>
    </div>
  );
}