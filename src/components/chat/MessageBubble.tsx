import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChatMessage } from '@shared/types';
import { cn } from '@/lib/utils';
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}
export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const nameColor = useMemo(() => {
    const colors = [
      'text-orange-500', 'text-rose-500', 'text-indigo-500', 
      'text-emerald-500', 'text-amber-500', 'text-sky-500'
    ];
    let hash = 0;
    for (let i = 0; i < message.userId.length; i++) {
      hash = message.userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [message.userId]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "flex flex-col group",
        isOwnMessage ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "flex items-center gap-2 mb-1.5 px-2",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest",
          isOwnMessage ? "text-orange-600/80" : nameColor
        )}>
          {isOwnMessage ? "You" : message.userName}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
          {format(message.ts, 'h:mm a')}
        </span>
      </div>
      <div
        className={cn(
          "relative px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all duration-300 max-w-sm md:max-w-md lg:max-w-lg",
          isOwnMessage
            ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-[1.5rem] rounded-tr-none shadow-orange-500/10"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-[1.5rem] rounded-tl-none"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        {/* Subtle decorative tail for the bubble */}
        <div className={cn(
          "absolute top-0 w-4 h-4 -z-10",
          isOwnMessage 
            ? "right-0 translate-x-1 bg-rose-600" 
            : "left-0 -translate-x-1 bg-zinc-200 dark:bg-zinc-800"
        )} style={{ clipPath: isOwnMessage ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(0 0, 100% 100%, 100% 0)' }} />
      </div>
    </motion.div>
  );
}