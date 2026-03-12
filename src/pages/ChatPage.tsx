import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
export function ChatPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  if (!currentUser) return null;
  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <ChatSidebar />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-gradient">Aura</span>
        </div>
        <ThemeToggle className="static" />
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r bg-card/50">
        <ChatSidebar />
      </div>
      {/* Main Chat Area */}
      <main className="flex-1 relative flex flex-col min-w-0 bg-zinc-50/50 dark:bg-zinc-950/30">
        <ChatArea />
      </main>
    </div>
  );
}