const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Performance endpoint
app.get('/api/performance', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    },
    uptime: `${Math.round(process.uptime())} seconds`
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`📊 Performance monitoring: http://localhost:${PORT}/api/performance`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n🎉 Server is ready! You can now:');
  console.log('1. Start the React client: npm run client');
  console.log('2. Access the app at: http://localhost:3000');
  console.log('3. Set up your ChatEngine.io credentials in .env file');
}); 