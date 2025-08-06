# Real-time Chat Engine

A modern, high-performance real-time messaging application built with Node.js, React.js, and ChatEngine.io. Features seamless user communication with performance tuning and bug resolution for high responsiveness during peak usage.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery with ChatEngine.io
- **User Authentication**: Secure login/signup system
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Performance Optimized**: Rate limiting, compression, and caching
- **Security**: Helmet.js security headers and input validation
- **Offline Support**: Graceful handling of network disconnections
- **Mobile Responsive**: Works perfectly on all devices
- **Real-time Typing Indicators**: See when others are typing
- **Message History**: Persistent chat history
- **Performance Monitoring**: Built-in performance tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **ChatEngine.io** - Real-time messaging platform
- **Helmet.js** - Security headers
- **Compression** - Response compression
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Chat Engine** - ChatEngine.io React components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **React Router** - Client-side routing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- ChatEngine.io account

### 1. Clone the repository
```bash
git clone <repository-url>
cd Realtime-Chatbot
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Fill in your ChatEngine.io credentials:
```env
# ChatEngine.io Configuration
CHAT_ENGINE_PROJECT_ID=your_project_id_here
CHAT_ENGINE_PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_here
```

Create a `.env` file in the client directory:
```bash
cd client
echo "REACT_APP_CHAT_ENGINE_PROJECT_ID=your_project_id_here" > .env
cd ..
```

### 4. Get ChatEngine.io Credentials

1. Sign up at [ChatEngine.io](https://chatengine.io)
2. Create a new project
3. Copy your Project ID and Private Key
4. Update the environment variables

### 5. Run the application

#### Development Mode
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Production Mode
```bash
# Build and start
npm run build
npm start
```

## 🎯 Usage

### Starting the Application

1. **Start the backend server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the React frontend**:
   ```bash
   npm run client
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

### Creating Users

1. **Sign up**: Use the signup form to create a new account
2. **Demo credentials**: Use the provided demo credentials for testing
   - Username: `demo_user`
   - Password: `demo123`

### Using the Chat

1. **Login**: Enter your credentials
2. **Create chats**: Start new conversations
3. **Send messages**: Real-time messaging with typing indicators
4. **Settings**: Access chat settings and logout

## 🔧 API Endpoints

### Authentication
- `POST /api/chat/create-user` - Create new user
- `GET /api/chat/get-chats/:username` - Get user's chats

### Messaging
- `POST /api/chat/create-chat` - Create new chat
- `POST /api/chat/send-message` - Send message

### Monitoring
- `GET /api/health` - Health check
- `GET /api/performance` - Performance metrics

## 🚀 Performance Features

### Backend Optimizations
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Compression**: Gzip compression for all responses
- **Security Headers**: Helmet.js for security
- **Error Handling**: Comprehensive error handling
- **Graceful Shutdown**: Proper process termination

### Frontend Optimizations
- **Lazy Loading**: Components loaded on demand
- **Debounced Input**: Optimized typing performance
- **Virtual Scrolling**: Efficient message rendering
- **Caching**: Local storage for user data
- **Offline Detection**: Network status monitoring

## 🔒 Security Features

- **Input Validation**: All inputs validated
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: Helmet.js protection
- **Error Sanitization**: Safe error messages

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🐛 Troubleshooting

### Common Issues

1. **ChatEngine Connection Failed**
   - Verify your Project ID and Private Key
   - Check network connectivity
   - Ensure ChatEngine.io service is available

2. **Messages Not Sending**
   - Check user authentication
   - Verify chat permissions
   - Check browser console for errors

3. **Performance Issues**
   - Monitor `/api/performance` endpoint
   - Check browser network tab
   - Verify rate limiting isn't blocking requests

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## 📊 Monitoring

### Performance Metrics
Access performance data at: `http://localhost:5000/api/performance`

### Health Check
Monitor application health at: `http://localhost:5000/api/health`

## 🚀 Deployment

### Heroku Deployment
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### Environment Variables for Production
Set these in your hosting platform:
- `CHAT_ENGINE_PROJECT_ID`
- `CHAT_ENGINE_PRIVATE_KEY`
- `NODE_ENV=production`
- `PORT` (auto-set by hosting platform)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [ChatEngine.io](https://chatengine.io) for the real-time messaging platform
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev) for the icon library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review ChatEngine.io documentation

---

**Built with ❤️ using Node.js, React.js, and ChatEngine.io** 