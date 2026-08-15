export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  model?: string | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  created_at?: string;
  updated_at?: string;
}