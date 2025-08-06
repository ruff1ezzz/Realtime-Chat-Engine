import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Users, Settings, Plus, Key, Copy, Trash2, LogOut, Warehouse, BookKeyIcon, KeyRoundIcon, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomSidebar = ({ 
  user, 
  userData,
  rooms, 
  currentRoom, 
  onJoinRoom, 
  onLogout, 
  onShowCreateRoom, 
  onShowJoinRoom, 
  onCopyRoomCode, 
  onConfirmDeleteRoom,
  onDebugInfo,
  onShowSettings,
  unreadMessages
}) => {
  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const displayName = userData?.username || user?.email || 'User';

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Private Rooms</h2>
          <div className="flex space-x-2">
            
            <button
              onClick={onShowJoinRoom}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Join Room"
            >
              <KeyRoundIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onShowCreateRoom}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Create Room"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {getInitials(displayName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onShowSettings}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 cursor-pointer transition-colors duration-200 ${
              currentRoom?.id === room.id 
                ? 'bg-blue-100 border-r-2 border-blue-500' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onJoinRoom(room)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                {/* Notification indicator */}
                {unreadMessages[room.id] > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {unreadMessages[room.id] > 9 ? '9+' : unreadMessages[room.id]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {room.name}
                </p>
                <p className="text-xs text-gray-500">
                  Code: {room.code} • {room.members?.length || 0} members
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                {room.createdBy === displayName && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyRoomCode(room);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Copy room code"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onConfirmDeleteRoom(room);
                      }}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete room"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {rooms.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No rooms yet</p>
            <p className="text-xs mt-1">Create a room or join one with a code</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSidebar; 