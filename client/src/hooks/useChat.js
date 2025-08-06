import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useChat = (user) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch user's chats
  const fetchChats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/get-chats/${user.username}?secret=${user.secret}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const { chats } = await response.json();
      setChats(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new chat
  const createChat = useCallback(async (usernames, title = 'New Chat', isDirectChat = false) => {
    if (!user) return;

    try {
      const response = await fetch('/api/chat/create-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernames: [...usernames, user.username],
          title,
          is_direct_chat: isDirectChat
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const { chat } = await response.json();
      setChats(prev => [...prev, chat]);
      toast.success('Chat created successfully!');
      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      throw error;
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (text, chatId = activeChat?.id) => {
    if (!user || !chatId || !text.trim()) return;

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          username: user.username,
          secret: user.secret,
          text: text.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { message } = await response.json();
      
      // Update messages
      setMessages(prev => [...prev, message]);
      
      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, last_message: message }
          : chat
      ));

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, [user, activeChat]);

  // Set typing status
  const setTypingStatus = useCallback((isTyping) => {
    setIsTyping(isTyping);
  }, []);

  // Select chat
  const selectChat = useCallback((chat) => {
    setActiveChat(chat);
    // You can fetch messages for this chat here if needed
  }, []);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  return {
    chats,
    activeChat,
    messages,
    loading,
    isTyping,
    fetchChats,
    createChat,
    sendMessage,
    setTypingStatus,
    selectChat,
    setActiveChat
  };
}; 