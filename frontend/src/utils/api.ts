import { API_BASE_URL } from '../config';
import { ChatMessage, ChatUser } from '../types';

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (body && body.error) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function login(username: string): Promise<ChatUser> {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return handleResponse<ChatUser>(res);
}

export async function fetchMessageHistory(): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE_URL}/api/messages`);
  const data = await handleResponse<{ messages: ChatMessage[] }>(res);
  return data.messages;
}
