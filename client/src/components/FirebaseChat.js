import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Hash, Settings, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

// Import components
import LoginForm from './auth/LoginForm';
import RoomSidebar from './rooms/RoomSidebar';
import MessageItem from './chat/MessageItem';
import MessageInput from './chat/MessageInput';
import CreateRoomModal from './modals/CreateRoomModal';
import JoinRoomModal from './modals/JoinRoomModal';
import DeleteRoomModal from './modals/DeleteRoomModal';
import RoomSettingsModal from './modals/RoomSettingsModal';
import SettingsPage from './settings/SettingsPage';

// Import utilities and hooks
import { useFirebase } from '../hooks/useFirebase';
import { 
  formatTime, 
  formatTimeHeader, 
  shouldShowTimeHeader, 
  getInitials, 
  getRandomColor 
} from '../utils/helpers';

const FirebaseChat = () => {
  // Modal states
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  // Firebase hook
  const {
    messages,
    rooms,
    currentRoom,
    user,
    userData,
    loading,
    showLogin,
    unreadMessages,
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
    leaveRoom
  } = useFirebase();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug function
  const handleDebugInfo = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Current user:', user);
    console.log('User UID:', user?.uid);
    console.log('User email:', user?.email);
    console.log('User data:', userData);
    console.log('Current rooms:', rooms);
    console.log('Current room:', currentRoom);
    console.log('Messages count:', messages.length);
    console.log('Last message:', messages[messages.length - 1]);
    loadRooms(); // Manually trigger room loading
    toast.info('Debug info logged to console');
  };

  // Modal handlers
  const handleCreateRoom = (roomName, roomCode) => {
    createRoom(roomName, roomCode);
    setShowCreateRoom(false);
  };

  const handleJoinRoomByCode = (roomCode) => {
    joinRoomByCode(roomCode);
    setShowJoinRoom(false);
  };

  const handleConfirmDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const handleDeleteRoom = () => {
    deleteRoom(roomToDelete);
    setShowDeleteConfirm(false);
    setRoomToDelete(null);
  };

  // Settings handlers
  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleUpdateUserData = (newUserData) => {
    updateUserData(newUserData);
  };

  // Room settings handlers
  const handleShowRoomSettings = () => {
    setShowRoomSettings(true);
  };

  const handleCloseRoomSettings = () => {
    setShowRoomSettings(false);
  };

  const handleUpdateRoom = async (roomId, updates) => {
    try {
      await updateRoom(roomId, updates);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  const handleKickMember = async (roomId, memberId) => {
    try {
      await kickMember(roomId, memberId);
    } catch (error) {
      console.error('Error kicking member:', error);
      toast.error('Failed to kick member');
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await leaveRoom(roomId);
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('Failed to leave room');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading Chat</h2>
        </div>
      </div>
    );
  }

  // Login state
  if (showLogin) {
    return <LoginForm />;
  }

  // Settings state
  if (showSettings) {
    return (
      <SettingsPage
        user={user}
        userData={userData}
        onBack={handleBackFromSettings}
        onUpdateUserData={handleUpdateUserData}
      />
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <RoomSidebar
        user={user}
        userData={userData}
        rooms={rooms}
        currentRoom={currentRoom}
        onJoinRoom={joinRoom}
        onLogout={handleLogout}
        onShowCreateRoom={() => setShowCreateRoom(true)}
        onShowJoinRoom={() => setShowJoinRoom(true)}
        onCopyRoomCode={copyRoomCode}
        onConfirmDeleteRoom={handleConfirmDeleteRoom}
        onDebugInfo={handleDebugInfo}
        onShowSettings={handleShowSettings}
        unreadMessages={unreadMessages}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          {currentRoom ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center space-x-3 justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900 text-center">
                    {currentRoom.name}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Code: {currentRoom.code} • Created by {currentRoom.createdBy} • {new Date(currentRoom.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {currentRoom.members?.length || 0} members
                </span>
                <button
                  onClick={handleShowRoomSettings}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Room Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Select a room to start chatting
              </h2>
              <p className="text-sm text-gray-500">
                Create a room or join one with a code
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentRoom ? (
            messages.length > 0 ? (
              messages.map((message, index) => {
                const isOwnMessage = message.userId === user?.uid;
                const showAvatar = index === 0 || messages[index - 1]?.userId !== message.userId;
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const showTimeHeader = shouldShowTimeHeader(message, previousMessage);
                
                // Show timestamp only if it's your message and it's the very last message
                const showTimestamp = isOwnMessage && index === messages.length - 1;
                
                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                    showAvatar={showAvatar}
                    showTimestamp={showTimestamp}
                    showTimeHeader={showTimeHeader}
                    formatTimeHeader={formatTimeHeader}
                    formatTime={formatTime}
                    getInitials={getInitials}
                    getRandomColor={getRandomColor}
                    user={user}
                    userData={userData}
                  />
                );
              })
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No room selected</p>
              <p className="text-sm">Create a room or join one with a code</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          currentRoom={currentRoom}
          onSendMessage={sendMessage}
        />
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onCreateRoom={handleCreateRoom}
      />

      <JoinRoomModal
        isOpen={showJoinRoom}
        onClose={() => setShowJoinRoom(false)}
        onJoinRoom={handleJoinRoomByCode}
      />

      <DeleteRoomModal
        isOpen={showDeleteConfirm}
        roomToDelete={roomToDelete}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={handleDeleteRoom}
      />

      <RoomSettingsModal
        isOpen={showRoomSettings}
        onClose={handleCloseRoomSettings}
        room={currentRoom}
        onUpdateRoom={handleUpdateRoom}
        onKickMember={handleKickMember}
        onLeaveRoom={handleLeaveRoom}
        user={user}
        userData={userData}
      />
    </div>
  );
};

export default FirebaseChat; 