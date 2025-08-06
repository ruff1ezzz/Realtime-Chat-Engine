# Real-time Chat Engine

A modern, high-performance real-time messaging application built with React.js and Firebase. Features seamless user communication, private rooms with 4-digit codes, real-time notifications, and a beautiful, responsive UI.

**Live Demo: [https://realtime-chatengine.web.app](https://realtime-chatengine.web.app)**

## Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery with Firebase Realtime Database
- **User Authentication**: Secure login/signup system with email or username support
- **Private Rooms**: Create, join, delete, and manage private chat rooms with 4-digit codes
- **Room Management**: Kick/leave members, edit room names, and dynamic member count
- **System Messages**: Join/leave/kick notifications appear in chat
- **Real-time Notifications**: Unread message indicators on room icons
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and Framer Motion
- **Mobile Responsive**: Works perfectly on all devices

### Advanced Features
- **Dual Login**: Sign in with either email or username
- **Username System**: Custom usernames instead of email display
- **Room Settings**: Edit room names, view member list, kick members, leave rooms
- **Profile Settings**: Edit username, email, and account information
- **Dynamic Member Count**: Real-time updates when users join/leave
- **Message History**: Persistent chat history with timestamps
- **Auto-room Selection**: Automatically selects newly created/joined rooms

## 🛠️ Tech Stack

### Backend/Database
- **Firebase Realtime Database** - Real-time NoSQL database for messages and rooms
- **Firebase Authentication** - User authentication system with email/password

### Frontend
- **React.js** - UI library with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notification system
- **React Router** - Client-side routing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (see setup below)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Realtime-Chatbot
```

### 2. Install dependencies
```bash
cd client
npm install
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Create a **Realtime Database** (in test mode for development)
5. Copy your Firebase config (from Project Settings > General)
6. Replace the config in `client/src/firebase.js` with your own

### 4. Run the application
```bash
npm start
```
Frontend will run on `http://localhost:3000`

## Usage Guide

### Getting Started
1. **Sign up**: Create account with username, email, and password
2. **Login**: Use your email or username to sign in
3. **Create Room**: Click the "+" icon to create a new private room with a 4-digit code
4. **Join Room**: Click the key icon to join an existing room with its code

### Chat Features
- **Send Messages**: Type in the input field and press Enter or click the send button
- **Real-time Updates**: Messages appear instantly for all room members
- **System Notifications**: See when users join, leave, or are kicked from rooms
- **Unread Indicators**: Red circles show unread message counts on room icons

### Room Management
- **Edit Room Name**: Room creators can edit room names via the settings gear icon
- **Kick Members**: Room creators can remove members from the room
- **Leave Room**: Non-creators can leave rooms they joined
- **Delete Room**: Room creators can completely delete rooms
- **Copy Room Code**: Share room codes with others

### User Settings
- **Profile Settings**: Click the gear icon next to your username to edit profile
- **Change Username**: Update your display name
- **Account Info**: View your account details and creation date

## Project Structure

```
client/src/
├── components/
│   ├── auth/           # Authentication components
│   ├── chat/           # Message display and input
│   ├── modals/         # Room creation, joining, settings modals
│   ├── rooms/          # Room sidebar and list
│   └── settings/       # User profile settings
├── hooks/
│   └── useFirebase.js  # Main Firebase logic and state management
├── utils/
│   └── helpers.js      # Utility functions
└── firebase.js         # Firebase configuration
```

## Key Components

### useFirebase Hook
- Manages all Firebase interactions
- Handles real-time listeners for rooms and messages
- Provides authentication state management
- Implements room and message CRUD operations

### Room Management
- **Create Room**: Generate unique 4-digit codes
- **Join Room**: Add users to existing rooms
- **Delete Room**: Remove rooms completely from database
- **Leave Room**: Remove users from room members
- **Kick Members**: Room creators can remove other members

### Message System
- **Real-time Messages**: Instant delivery via Firebase
- **System Messages**: Join/leave/kick notifications
- **Message History**: Persistent storage with timestamps
- **Unread Tracking**: Smart notification system

## Known Issues & Solutions

### Common Issues
1. **Room not appearing after creation**: Wait a moment for real-time sync, or refresh
2. **Messages not sending**: Ensure you're authenticated and the room exists
3. **Firebase errors**: Check your Firebase config and database rules
4. **Duplicate messages**: Fixed by removing immediate local state updates

### Performance
- **Real-time Updates**: All changes sync instantly across all clients
- **Optimized Rendering**: Efficient message and room list updates
- **Memory Management**: Proper cleanup of Firebase listeners

### Environment Variables
- Firebase config is in `client/src/firebase.js`
- No additional .env files needed for basic setup

## Deployment

### Live Demo
**Live Application: [https://realtime-chatengine.web.app](https://realtime-chatengine.web.app)**

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the React app
cd client
npm run build
cd ..

# Deploy to Firebase
firebase deploy
```

### Environment Variables
- Firebase config is in `client/src/firebase.js`
- No additional .env files needed for basic setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built using React.js and Firebase**