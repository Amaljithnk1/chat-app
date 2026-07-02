export interface ChatUser {
  userId: string;
  username: string;
  token?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string; // ISO string
}

export interface TypingEvent {
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  users: { userId: string; username: string }[];
}
