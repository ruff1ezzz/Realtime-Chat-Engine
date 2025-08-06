import React from 'react';
import { motion } from 'framer-motion';

const MessageItem = ({ 
  message, 
  isOwnMessage, 
  showAvatar, 
  showTimestamp, 
  showTimeHeader, 
  formatTimeHeader, 
  formatTime, 
  getInitials, 
  getRandomColor, 
  user,
  userData
}) => {
  const displayName = userData?.username || user?.email || 'User';
  const isSystemMessage = message.type === 'system' || message.userId === 'system';

  return (
    <div>
      {/* Time Header */}
      {showTimeHeader && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-4"
        >
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {formatTimeHeader(message.timestamp)}
          </div>
        </motion.div>
      )}
      
      {/* System Message */}
      {isSystemMessage ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-1"
        >
          <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200">
            {message.text}
          </div>
        </motion.div>
      ) : (
        /* Regular Message */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-1`}
        >
          {!isOwnMessage && showAvatar && (
            <div className="relative group flex-shrink-0 mr-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(message.sender)} cursor-pointer transition-transform duration-200 hover:scale-110`}>
                {getInitials(message.sender)}
              </div>
              <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {message.sender}
              </div>
            </div>
          )}
          
          {!isOwnMessage && !showAvatar && (
            <div className="w-10 flex-shrink-0"></div>
          )}
          
          <div className="flex flex-col min-w-0">
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              isOwnMessage 
                ? 'bg-blue-500 text-white rounded-br-md' 
                : 'bg-gray-200 text-gray-800 rounded-bl-md'
            }`}>
              <div className="text-sm">{message.text}</div>
            </div>
            {/* Timestamp under message - only show if it's your message and it's the last message */}
            {showTimestamp && isOwnMessage && (
              <div className={`text-xs mt-1 text-gray-500`}>
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>
          
          {isOwnMessage && (
            <div className="relative group flex-shrink-0 ml-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(displayName)} cursor-pointer transition-transform duration-200 hover:scale-110`}>
                {getInitials(displayName)}
              </div>
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {displayName}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MessageItem; 