// Time formatting utilities
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatTimeHeader = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = Math.abs(now - date) / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

export const shouldShowTimeHeader = (currentMessage, previousMessage) => {
  if (!previousMessage) return true;
  
  const currentTime = new Date(currentMessage.timestamp);
  const previousTime = new Date(previousMessage.timestamp);
  const diffHours = Math.abs(currentTime - previousTime) / (1000 * 60 * 60);
  
  return diffHours >= 2;
};

// Avatar utilities
export const getInitials = (username) => {
  return username ? username.charAt(0).toUpperCase() : 'U';
};

export const getRandomColor = (username) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = username ? username.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

// Room utilities
export const generateRoomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Message formatting utilities
export const formatMessage = (text) => {
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  // Password should be at least 6 characters
  return password.length >= 6;
};

// User utilities
export const getUserInitials = (username) => {
  return username.charAt(0).toUpperCase();
};

export const getUserDisplayName = (user) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.username;
};

// Chat utilities
export const getChatTitle = (chat, currentUser) => {
  if (chat.title) return chat.title;
  
  if (chat.people && chat.people.length > 0) {
    const otherUsers = chat.people.filter(person => person.person.username !== currentUser);
    if (otherUsers.length === 1) {
      return getUserDisplayName(otherUsers[0].person);
    } else if (otherUsers.length > 1) {
      return `${otherUsers.length} people`;
    }
  }
  
  return 'Untitled Chat';
};

export const getLastMessage = (chat) => {
  if (!chat.last_message) return 'No messages yet';
  
  const { text, sender } = chat.last_message;
  const senderName = sender?.username || 'Unknown';
  return `${senderName}: ${truncateText(text, 30)}`;
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Network utilities
export const isOnline = () => {
  return navigator.onLine;
};

export const checkConnection = async () => {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}; 