const http = require('http');

console.log('🔍 Test Environment Status Check');
console.log('===============================\n');

console.log('Checking test servers...\n');

// Check backend
const checkBackend = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          resolve({
            status: '✅ Running',
            uptime: Math.floor(health.uptime),
            timestamp: health.timestamp
          });
        } catch (e) {
          resolve({ status: '❌ Error parsing response' });
        }
      });
    });

    req.on('error', () => resolve({ status: '❌ Not running' }));
    req.on('timeout', () => resolve({ status: '❌ Timeout' }));
    req.setTimeout(5000);
    req.end();
  });
};

// Check frontend
const checkFrontend = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve({
        status: '✅ Running',
        statusCode: res.statusCode
      });
    });

    req.on('error', () => resolve({ status: '❌ Not running' }));
    req.on('timeout', () => resolve({ status: '❌ Timeout' }));
    req.setTimeout(5000);
    req.end();
  });
};

async function checkStatus() {
  const [backend, frontend] = await Promise.all([
    checkBackend(),
    checkFrontend()
  ]);

  console.log('📊 Test Server Status:');
  console.log(`   Backend  (Port 5001): ${backend.status}`);
  if (backend.uptime) {
    console.log(`   Uptime: ${backend.uptime} seconds`);
  }
  console.log(`   Frontend (Port 3001): ${frontend.status}`);
  if (frontend.statusCode) {
    console.log(`   Status Code: ${frontend.statusCode}`);
  }

  console.log('\n🌐 Test Access URLs:');
  console.log('   Backend API:  http://localhost:5001');
  console.log('   Frontend App: http://localhost:3001');
  console.log('   Health Check: http://localhost:5001/api/health');
  console.log('   Performance:  http://localhost:5001/api/performance');

  console.log('\n🔥 Test Features:');
  console.log('   ✅ Multi-room chat functionality');
  console.log('   ✅ Profile picture message design');
  console.log('   ✅ Real-time messaging');
  console.log('   ✅ User authentication');
  console.log('   ✅ Room creation and joining');

  console.log('\n📚 Test Instructions:');
  console.log('   1. Open http://localhost:3001 in your browser');
  console.log('   2. Create an account or sign in');
  console.log('   3. Create a new room using the "+" button');
  console.log('   4. Test the new profile picture message design!');
  console.log('   5. Try sending messages to see the speech bubble effect');

  if (backend.status === '✅ Running' && frontend.status === '✅ Running') {
    console.log('\n🎉 Test environment is running successfully!');
    console.log('   You can now test the new message design with profile pictures.');
  } else {
    console.log('\n⚠️  Some test services are not running. Check the logs above.');
  }
}

checkStatus(); 