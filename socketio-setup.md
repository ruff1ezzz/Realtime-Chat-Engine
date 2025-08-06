# Socket.io Real-time Chat Setup

## 🚀 Self-hosted Real-time Solution

### 1. Install Socket.io
```bash
npm install socket.io
cd client && npm install socket.io-client
```

### 2. Backend Setup (server.js)
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });
  
  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 3. Frontend Setup
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join a chat room
socket.emit('join_room', roomId);

// Send a message
socket.emit('send_message', {
  roomId: roomId,
  message: messageText,
  sender: userId,
  timestamp: Date.now()
});

// Listen for messages
socket.on('receive_message', (data) => {
  // Update UI with new message
  console.log('New message:', data);
});
```

### 4. Benefits
- ✅ Complete control over your data
- ✅ No external dependencies
- ✅ No usage limits
- ✅ Customizable features
- ✅ One-time server cost only

### 5. Database Options
- **MongoDB**: For message persistence
- **PostgreSQL**: For user management
- **Redis**: For session management
- **SQLite**: For simple deployments

## 🔧 Implementation Steps

1. **Remove ChatEngine**: Uninstall react-chat-engine
2. **Add Socket.io**: Install server and client packages
3. **Update Backend**: Replace ChatEngine API with Socket.io
4. **Update Frontend**: Replace ChatEngine components
5. **Add Database**: For message persistence

## 📊 Cost Comparison
- **Socket.io**: Only server hosting costs
- **ChatEngine**: Monthly subscription
- **Firebase**: Pay-as-you-go after free tier 