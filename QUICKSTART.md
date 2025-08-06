# Quick Start Guide

Get your Real-time Chat Engine running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Get ChatEngine.io Credentials
1. Go to [ChatEngine.io](https://chatengine.io)
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID and Private Key

### 3. Configure Environment
```bash
node setup.js
```
Or manually create `.env` files:

**Backend (.env):**
```env
CHAT_ENGINE_PROJECT_ID=your_project_id
CHAT_ENGINE_PRIVATE_KEY=your_private_key
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

**Frontend (client/.env):**
```env
REACT_APP_CHAT_ENGINE_PROJECT_ID=your_project_id
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### 5. Access the Application
Open your browser and go to: `http://localhost:3000`

## 🎯 Test the Application

1. **Create an account** using the signup form
2. **Login** with your credentials
3. **Start chatting** with real-time messaging!

## 🔧 Troubleshooting

### Common Issues

**"ChatEngine connection failed"**
- Verify your Project ID and Private Key
- Check that your ChatEngine.io project is active
- Ensure your credentials are in the .env files

**"Messages not sending"**
- Check browser console for errors
- Verify user authentication
- Ensure ChatEngine.io service is available

**"Performance issues"**
- Monitor `/api/performance` endpoint
- Check rate limiting settings
- Verify network connectivity

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📊 Monitoring

- **Health Check**: `http://localhost:5000/api/health`
- **Performance**: `http://localhost:5000/api/performance`
- **Frontend**: `http://localhost:3000`

## 🎉 Success!

Your real-time chat engine is now running with:
- ✅ Real-time messaging
- ✅ User authentication
- ✅ Performance monitoring
- ✅ Security features
- ✅ Mobile responsive design

## 📚 Next Steps

1. **Customize the UI** - Modify components in `client/src/components/`
2. **Add features** - Extend the API in `server.js`
3. **Deploy** - Follow the deployment guide in README.md
4. **Scale** - Add database, caching, and load balancing

## 🆘 Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Check [troubleshooting section](README.md#troubleshooting)
- 📧 Create an issue in the repository
- 🌐 Visit [ChatEngine.io docs](https://chatengine.io/docs)

---

**Happy Chatting! 🚀** 