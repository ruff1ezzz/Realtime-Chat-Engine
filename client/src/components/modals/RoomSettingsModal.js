import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, UserX, LogOut, Edit3, Hash, Copy, Trash2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomSettingsModal = ({ 
  isOpen, 
  onClose, 
  room, 
  user, 
  userData, 
  onUpdateRoom, 
  onKickMember, 
  onLeaveRoom 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roomName, setRoomName] = useState(room?.name || '');
  const [loading, setLoading] = useState(false);

  const isCreator = room?.createdBy === (userData?.username || user?.email);

  const handleSaveRoomName = async () => {
    if (!roomName.trim() || roomName.trim() === room?.name) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await onUpdateRoom(room.id, { name: roomName.trim() });
      setIsEditing(false);
      toast.success('Room name updated successfully!');
    } catch (error) {
      console.error('Error updating room name:', error);
      toast.error('Failed to update room name');
    } finally {
      setLoading(false);
    }
  };

  const handleKickMember = async (memberId) => {
    if (!window.confirm(`Are you sure you want to kick this member?`)) return;
    
    try {
      await onKickMember(room.id, memberId);
      toast.success('Member kicked successfully!');
    } catch (error) {
      console.error('Error kicking member:', error);
      toast.error('Failed to kick member');
    }
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm(`Are you sure you want to leave "${room?.name}"?`)) return;
    
    try {
      await onLeaveRoom(room.id);
      toast.success('Left room successfully!');
      onClose();
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('Failed to leave room');
    }
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      toast.success('Room code copied to clipboard!');
    } catch (error) {
      console.error('Error copying room code:', error);
      toast.error('Failed to copy room code');
    }
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Room Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Info */}
        <div className="space-y-6">
          {/* Room Name Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Room Name
              </h4>
              {isCreator && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-sm transition-colors duration-200"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter room name"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setRoomName(room.name);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRoomName}
                    disabled={loading || !roomName.trim()}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 font-medium">{room.name}</p>
            )}
          </div>

          {/* Room Code Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Room Code</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-gray-900">{room.code}</span>
              <button
                onClick={copyRoomCode}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-sm transition-colors duration-200"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Members Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Members ({room.members?.length || 0})
            </h4>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {room.members?.map((memberId, index) => {
                const isCurrentUser = memberId === user?.uid;
                const isCreatorMember = room.createdBy === (userData?.username || user?.email);
                const canKick = isCreator && !isCurrentUser;
                
                return (
                  <div key={memberId} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {memberId === user?.uid ? 'You' : (index + 1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {memberId === user?.uid ? 'You' : `Member ${index + 1}`}
                        {room.createdBy === (userData?.username || user?.email) && memberId === user?.uid && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Creator</span>
                        )}
                      </span>
                    </div>
                    {canKick && (
                      <button
                        onClick={() => handleKickMember(memberId)}
                        className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-sm transition-colors duration-200"
                        title="Kick member"
                      >
                        <UserX className="w-3 h-3" />
                        <span>Kick</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            {!isCreator && (
              <button
                onClick={handleLeaveRoom}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave Room</span>
              </button>
            )}
            
            {isCreator && (
              <div className="text-xs text-gray-500 text-center">
                As the room creator, you can edit the room name and kick members.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomSettingsModal; 