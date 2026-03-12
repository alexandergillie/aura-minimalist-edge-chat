import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChatMessage } from '@shared/types';
import { cn } from '@/lib/utils';
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}
export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex flex-col max-w-[80%] md:max-w-[70%]",
        isOwnMessage ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        {!isOwnMessage && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            User {message.userId.slice(0, 4)}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground">
          {format(message.ts, 'HH:mm')}
        </span>
      </div>
      <div
        className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
          isOwnMessage 
            ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-tr-none" 
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-tl-none"
        )}
      >
        {message.text}
      </div>
    </motion.div>
  );
}