import { create } from 'zustand';
import { User } from '@shared/types';
interface AppState {
  currentUser: User | null;
  activeChatId: string | null;
  setCurrentUser: (user: User | null) => void;
  setActiveChatId: (id: string | null) => void;
}
export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activeChatId: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setActiveChatId: (id) => set({ activeChatId: id }),
}));