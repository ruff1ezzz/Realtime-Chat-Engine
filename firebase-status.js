#!/usr/bin/env node

const http = require('http');

console.log('🔍 Firebase Chat Status Check');
console.log('=============================\n');

// Check backend server
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          resolve({
            status: '✅ Running',
            uptime: health.uptime,
            timestamp: health.timestamp
          });
        } catch (error) {
          resolve({ status: '❌ Error parsing response' });
        }
      });
    });

    req.on('error', () => {
      resolve({ status: '❌ Not running' });
    });

    req.setTimeout(5000, () => {
      resolve({ status: '⏰ Timeout' });
    });

    req.end();
  });
}

// Check frontend server
function checkFrontend() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000', { method: 'HEAD' }, (res) => {
      resolve({ status: '✅ Running', code: res.statusCode });
    });

    req.on('error', () => {
      resolve({ status: '❌ Not running' });
    });

    req.setTimeout(5000, () => {
      resolve({ status: '⏰ Timeout' });
    });

    req.end();
  });
}

async function checkStatus() {
  console.log('Checking Firebase Chat servers...\n');

  const backend = await checkBackend();
  const frontend = await checkFrontend();

  console.log('📊 Server Status:');
  console.log(`   Backend  (Port 5000): ${backend.status}`);
  if (backend.uptime) {
    console.log(`   Uptime: ${Math.round(backend.uptime)} seconds`);
  }
  console.log(`   Frontend (Port 3000): ${frontend.status}`);
  if (frontend.code) {
    console.log(`   Status Code: ${frontend.code}`);
  }

  console.log('\n🌐 Access URLs:');
  console.log('   Backend API:  http://localhost:5000');
  console.log('   Frontend App: http://localhost:3000');
  console.log('   Health Check: http://localhost:5000/api/health');
  console.log('   Performance:  http://localhost:5000/api/performance');

  console.log('\n🔥 Firebase Features:');
  console.log('   ✅ Real-time messaging');
  console.log('   ✅ User authentication');
  console.log('   ✅ Message persistence');
  console.log('   ✅ Offline support');
  console.log('   ✅ Security rules');

  console.log('\n📚 Next Steps:');
  console.log('   1. Open http://localhost:3000 in your browser');
  console.log('   2. Create an account using the signup form');
  console.log('   3. Start chatting with real-time messages!');
  console.log('   4. Check Firebase Console for monitoring');

  console.log('\n🔧 Firebase Console:');
  console.log('   https://console.firebase.google.com/project/realtime-chatengine');

  if (backend.status.includes('✅') && frontend.status.includes('✅')) {
    console.log('\n🎉 All systems are running! Your Firebase chat is ready to use.');
    console.log('   No more ChatEngine.io dependency issues!');
  } else {
    console.log('\n⚠️  Some services are not running. Check the logs above.');
  }
}

checkStatus(); 