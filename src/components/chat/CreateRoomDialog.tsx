import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string) => void;
  isPending: boolean;
}
export function CreateRoomDialog({ open, onOpenChange, onCreate, isPending }: CreateRoomDialogProps) {
  const [title, setTitle] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
      setTitle('');
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Create Room</DialogTitle>
          <DialogDescription>
            Give your room a name to start inviting others to join the conversation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="room-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Room Name
            </Label>
            <Input
              id="room-name"
              placeholder="e.g. Design Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-gradient rounded-2xl px-8"
              disabled={!title.trim() || isPending}
            >
              {isPending ? 'Creating...' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}