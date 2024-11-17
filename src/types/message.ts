import { User } from './user';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  createdAt: string;
  readAt?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}