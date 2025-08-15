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

## Tech Stack

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

**Built using React.js and Firebase**
