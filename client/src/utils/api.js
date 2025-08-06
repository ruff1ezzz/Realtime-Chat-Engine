const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

const api = {
  // Chat Engine API endpoints
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  createChat: async (chatData) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/create-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatData),
    });
    return handleResponse(response);
  },

  getChats: async (username, secret) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/get-chats/${username}?secret=${secret}`);
    return handleResponse(response);
  },

  sendMessage: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    return handleResponse(response);
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return handleResponse(response);
  },

  // Performance monitoring
  getPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/api/performance`);
    return handleResponse(response);
  },

  // Utility function for authenticated requests
  authenticatedRequest: async (endpoint, options = {}) => {
    const user = JSON.parse(localStorage.getItem('chatUser') || '{}');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    
    return handleResponse(response);
  },
};

export default api;
export { ApiError }; 