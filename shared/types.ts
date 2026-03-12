export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
  description?: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  userName: string;
  text: string;
  ts: number; // epoch millis
}