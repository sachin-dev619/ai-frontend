import { Message } from './message.model';

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  model?: string | null;
  created_at?: string;
  updated_at?: string;
  messages?: Message[];
}