import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { ChatMessage, ChatUser, PresenceEvent, TypingEvent } from '../types';
import { fetchMessageHistory } from '../utils/api';

type ConnectionStatus = 'connecting' | 'online' | 'offline';

interface SocketContextValue {
  status: ConnectionStatus;
  messages: ChatMessage[];
  onlineUsers: { userId: string; username: string }[];
  typingUser: TypingEvent | null;
  sendMessage: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export function SocketProvider({
  user,
  children,
}: {
  user: ChatUser;
  children: React.ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ userId: string; username: string }[]>([]);
  const [typingUser, setTypingUser] = useState<TypingEvent | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Load recent history over REST immediately, so the screen isn't blank
    // while the socket handshake is still in flight.
    fetchMessageHistory()
      .then((history) => {
        if (isMounted) setMessages(history);
      })
      .catch(() => {
        // Non-fatal — the socket "history" event below will fill this in too.
      });

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('online');
      socket.emit('join', { userId: user.userId, username: user.username });
    });

    socket.on('disconnect', () => setStatus('offline'));
    socket.io.on('reconnect_attempt', () => setStatus('connecting'));

    socket.on('history', (history: ChatMessage[]) => setMessages(history));

    socket.on('message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('presence', (payload: PresenceEvent) => setOnlineUsers(payload.users));

    socket.on('typing', (payload: TypingEvent) => {
      if (payload.userId === user.userId) return; // ignore our own echo
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (payload.isTyping) {
        setTypingUser(payload);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
      } else {
        setTypingUser(null);
      }
    });

    return () => {
      isMounted = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user.userId, user.username]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { text: trimmed });
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit('typing', { isTyping });
  }, []);

  const value = useMemo(
    () => ({ status, messages, onlineUsers, typingUser, sendMessage, setTyping }),
    [status, messages, onlineUsers, typingUser, sendMessage, setTyping]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useChatSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useChatSocket must be used within a SocketProvider');
  return ctx;
}
