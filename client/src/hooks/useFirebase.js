import { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, push, onValue, off, set, get, remove } from 'firebase/database';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

export const useFirebase = () => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState({}); // Track unread messages per room

  // Fetch user data including username
  const fetchUserData = async (uid, retryCount = 0) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        // If no user data found and this is a retry, wait a bit and try again
        if (retryCount < 3) {
          console.log(`User data not found, retrying in 500ms (attempt ${retryCount + 1})`);
          setTimeout(() => {
            fetchUserData(uid, retryCount + 1);
          }, 500);
          return;
        }
        // Fallback for users without username (old accounts)
        setUserData({ username: user?.email?.split('@')[0] || 'User' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({ username: user?.email?.split('@')[0] || 'User' });
    }
  };

  // Load rooms for the current user
  const loadRooms = () => {
    console.log('Loading rooms for user:', user?.uid, user?.email);
    if (!user?.uid) {
      console.log('No user UID, skipping room load');
      return;
    }
    
    const roomsRef = ref(database, 'rooms');
    
    // Remove any existing listener before setting up a new one
    off(roomsRef);
    
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Raw rooms data:', data);
      if (data) {
        const roomList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log('All rooms:', roomList);
        // Filter rooms where user is a member
        const userRooms = roomList.filter(room => 
          room.members && room.members.includes(user?.uid)
        );
        console.log('User rooms after filtering:', userRooms);
        console.log('User UID:', user?.uid);
        console.log('Room members check:', roomList.map(room => ({
          roomName: room.name,
          members: room.members,
          isMember: room.members && room.members.includes(user?.uid)
        })));
        
        setRooms(userRooms.sort((a, b) => a.createdAt - b.createdAt));
        
        // Auto-select first room if no room is selected
        if (!currentRoom && userRooms.length > 0) {
          setCurrentRoom(userRooms[0]);
        }
      } else {
        console.log('No rooms data found');
        setRooms([]);
      }
    });
  };

  // Load messages for a specific room
  const loadMessages = (roomId) => {
    if (!roomId) return;
    
    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    
    // Remove any existing listener before setting up a new one
    off(messagesRef);
    
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        const sortedMessages = messageList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
        
        // Mark messages as read when room is active
        if (currentRoom?.id === roomId) {
          markAsRead(roomId);
        }
      } else {
        setMessages([]);
      }
    });
  };

  // Mark messages as read for a specific room
  const markAsRead = (roomId) => {
    setUnreadMessages(prev => ({
      ...prev,
      [roomId]: 0
    }));
  };

  // Track unread messages for all rooms
  const trackUnreadMessages = () => {
    if (!user?.uid) return;
    
    const roomsRef = ref(database, 'rooms');
    
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Filter rooms where user is a member
        const userRooms = roomList.filter(room => 
          room.members && room.members.includes(user?.uid)
        );
        
        // Check for unread messages in each room
        userRooms.forEach(room => {
          if (room.id !== currentRoom?.id) { // Only track unread for non-active rooms
            const messagesRef = ref(database, `rooms/${room.id}/messages`);
            onValue(messagesRef, (msgSnapshot) => {
              const msgData = msgSnapshot.val();
              if (msgData) {
                const messageList = Object.keys(msgData).map(key => ({
                  id: key,
                  ...msgData[key]
                }));
                
                // Count messages that are not from the current user and are newer than the last read
                const unreadCount = messageList.filter(msg => 
                  msg.userId !== user?.uid && 
                  msg.timestamp > (unreadMessages[room.id] || 0)
                ).length;
                
                if (unreadCount > 0) {
                  setUnreadMessages(prev => ({
                    ...prev,
                    [room.id]: unreadCount
                  }));
                }
              }
            });
          }
        });
      }
    });
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up all listeners when component unmounts
      off(ref(database, 'rooms'));
      if (currentRoom) {
        off(ref(database, `rooms/${currentRoom.id}/messages`));
      }
    };
  }, [currentRoom]);

  // Create a new room
  const createRoom = async (roomName, roomCode) => {
    if (!roomName.trim() || !roomCode.trim() || !user) return;

    if (roomCode.length !== 4 || !/^\d+$/.test(roomCode)) {
      toast.error('Room code must be exactly 4 digits');
      return;
    }

    try {
      // Check if room code already exists
      const roomsRef = ref(database, 'rooms');
      const roomsSnapshot = await get(roomsRef);
      const existingRooms = roomsSnapshot.val();
      
      if (existingRooms) {
        const codeExists = Object.values(existingRooms).some(room => room.code === roomCode);
        if (codeExists) {
          toast.error('Room code already exists. Please choose a different code.');
          return;
        }
      }

      const newRoomRef = push(roomsRef);
      const newRoomId = newRoomRef.key;
      
      const newRoom = {
        id: newRoomId,
        name: roomName.trim(),
        code: roomCode,
        createdBy: userData?.username || user.email,
        createdAt: Date.now(),
        members: [user.uid]
      };
      
      await set(newRoomRef, newRoom);
      
      toast.success('Room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  // Delete a room
  const deleteRoom = async (roomToDelete) => {
    if (!roomToDelete || !user) return;

    try {
      // Check if user is the creator
      if (roomToDelete.createdBy !== (userData?.username || user.email)) {
        toast.error('Only room creators can delete rooms');
        return;
      }

      // Delete the room and all its messages
      const roomRef = ref(database, `rooms/${roomToDelete.id}`);
      await remove(roomRef);

      // Immediately update local state
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomToDelete.id));

      // If this was the current room, clear it
      if (currentRoom?.id === roomToDelete.id) {
        setCurrentRoom(null);
        setMessages([]);
      }

      toast.success('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  // Send a system message (for join/leave notifications)
  const sendSystemMessage = async (roomId, message, type = 'system') => {
    if (!roomId) return;

    try {
      const messagesRef = ref(database, `rooms/${roomId}/messages`);
      const systemMessage = {
        text: message,
        sender: 'System',
        timestamp: Date.now(),
        userId: 'system',
        type: type
      };
      await push(messagesRef, systemMessage);
    } catch (error) {
      console.error('Error sending system message:', error);
    }
  };

  // Join a room by code
  const joinRoomByCode = async (roomCode) => {
    if (!roomCode.trim() || !user) return;

    try {
      const roomsRef = ref(database, 'rooms');
      const roomsSnapshot = await get(roomsRef);
      const existingRooms = roomsSnapshot.val();
      
      if (!existingRooms) {
        toast.error('No rooms found');
        return;
      }

      const roomEntry = Object.entries(existingRooms).find(([id, room]) => room.code === roomCode);
      
      if (!roomEntry) {
        toast.error('Invalid room code');
        return;
      }

      const [roomId, roomData] = roomEntry;
      
      if (roomData.members && roomData.members.includes(user.uid)) {
        toast.error('You are already a member of this room');
        return;
      }

      // Add user to room members
      const updatedMembers = roomData.members ? [...roomData.members, user.uid] : [user.uid];
      await set(ref(database, `rooms/${roomId}/members`), updatedMembers);
      
      // Send welcome message
      const welcomeMessage = `${userData?.username || user.email} joined the room`;
      await sendSystemMessage(roomId, welcomeMessage, 'join');
      
      toast.success(`Joined ${roomData.name}!`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  // Send a message
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !user || !currentRoom) return;

    try {
      const messagesRef = ref(database, `rooms/${currentRoom.id}/messages`);
      const newMessage = {
        text: messageText.trim(),
        sender: userData?.username || user.email,
        timestamp: Date.now(),
        userId: user.uid
      };
      await push(messagesRef, newMessage);
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Copy room code to clipboard
  const copyRoomCode = async (room) => {
    try {
      await navigator.clipboard.writeText(room.code);
      toast.success('Room code copied to clipboard!');
    } catch (error) {
      console.error('Error copying room code:', error);
      toast.error('Failed to copy room code');
    }
  };

  // Logout user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed.');
    }
  };

  // Switch to a different room
  const joinRoom = async (room) => {
    try {
      setCurrentRoom(room);
      markAsRead(room.id); // Mark messages as read when switching to room
      toast.success(`Switched to ${room.name}!`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  // Update user data
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  // Update room information
  const updateRoom = async (roomId, updates) => {
    if (!user?.uid) return;

    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const updatedRoom = {
        ...currentRoom,
        ...updates,
        updatedAt: Date.now()
      };
      
      await set(roomRef, updatedRoom);
      
      // Immediately update local state
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, ...updates, updatedAt: Date.now() } : room
        )
      );
      
      // Update current room if it's the one being updated
      if (currentRoom?.id === roomId) {
        setCurrentRoom(updatedRoom);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  // Kick a member from the room
  const kickMember = async (roomId, memberId) => {
    if (!user?.uid) return;

    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const roomSnapshot = await get(roomRef);
      const roomData = roomSnapshot.val();
      
      if (!roomData) {
        throw new Error('Room not found');
      }

      // Check if user is the creator
      if (roomData.createdBy !== (userData?.username || user.email)) {
        throw new Error('Only room creators can kick members');
      }

      // Get the kicked user's info (we'll use memberId for now, but ideally we'd fetch their username)
      const kickedUserInfo = memberId; // This could be enhanced to fetch actual username
      
      // Send kick message
      const kickMessage = `A member was kicked from the room`;
      await sendSystemMessage(roomId, kickMessage, 'kick');

      // Remove member from the room
      const updatedMembers = roomData.members.filter(id => id !== memberId);
      await set(ref(database, `rooms/${roomId}/members`), updatedMembers);

      // Immediately update local state
      setRooms(prevRooms => prevRooms.map(room =>
        room.id === roomId ? { ...room, members: updatedMembers } : room
      ));
      if (currentRoom?.id === roomId) {
        setCurrentRoom({ ...currentRoom, members: updatedMembers });
      }
    } catch (error) {
      console.error('Error kicking member:', error);
      throw error;
    }
  };

  // Leave a room
  const leaveRoom = async (roomId) => {
    if (!user?.uid) return;

    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const roomSnapshot = await get(roomRef);
      const roomData = roomSnapshot.val();
      
      if (!roomData) {
        throw new Error('Room not found');
      }

      // Send leave message before removing user
      const leaveMessage = `${userData?.username || user.email} left the room`;
      await sendSystemMessage(roomId, leaveMessage, 'leave');

      // Remove user from the room
      const updatedMembers = roomData.members.filter(id => id !== user.uid);
      await set(ref(database, `rooms/${roomId}/members`), updatedMembers);

      // Immediately update local state
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
      
      // If this was the current room, clear it
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  };

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      if (user) {
        console.log('User details:', { uid: user.uid, email: user.email });
        setUser(user);
        setShowLogin(false);
        setLoading(false);
        
        // Fetch user data after user is set
        await fetchUserData(user.uid);
        
        // Load rooms after user data is fetched
        loadRooms();
        
        // Start tracking unread messages
        trackUnreadMessages();
      } else {
        console.log('No user, showing login');
        setUser(null);
        setUserData(null);
        setShowLogin(true);
        setRooms([]);
        setCurrentRoom(null);
        setMessages([]);
        setUnreadMessages({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Reload rooms when user changes
  useEffect(() => {
    if (user?.uid) {
      console.log('User changed, reloading rooms for:', user.uid);
      loadRooms();
    }
  }, [user?.uid]);

  // Reload user data when user changes (for new signups)
  useEffect(() => {
    if (user?.uid && !userData) {
      console.log('User data missing, fetching for:', user.uid);
      fetchUserData(user.uid);
    }
  }, [user?.uid, userData]);

  // Load messages when current room changes
  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom.id);
      markAsRead(currentRoom.id); // Mark messages as read when switching to room
    }
  }, [currentRoom]);

  return {
    // State
    messages,
    rooms,
    currentRoom,
    user,
    userData,
    loading,
    showLogin,
    unreadMessages,
    
    // Actions
    setCurrentRoom,
    createRoom,
    deleteRoom,
    joinRoomByCode,
    sendMessage,
    copyRoomCode,
    handleLogout,
    joinRoom,
    loadRooms,
    updateUserData,
    updateRoom,
    kickMember,
    leaveRoom,
    markAsRead,
    trackUnreadMessages
  };
}; 