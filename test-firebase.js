const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDChzYYOMFhXQnR9d0zSBK1NArZdZPSJBI",
  authDomain: "realtime-chatengine.firebaseapp.com",
  databaseURL: "https://realtime-chatengine-default-rtdb.firebaseio.com",
  projectId: "realtime-chatengine",
  storageBucket: "realtime-chatengine.firebasestorage.app",
  messagingSenderId: "156811505030",
  appId: "1:156811505030:web:92548ebeb2ff20c53b1007",
  measurementId: "G-48DK612YK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testFirebaseConnection() {
  console.log('🔍 Testing Firebase Database Connection...\n');

  try {
    // Test reading from database
    console.log('📖 Testing database read...');
    const testRef = ref(database, 'test');
    const snapshot = await get(testRef);
    console.log('✅ Database read successful');
    console.log('Current test data:', snapshot.val());

    // Test writing to database
    console.log('\n📝 Testing database write...');
    const testData = {
      message: 'Firebase connection test',
      timestamp: Date.now()
    };
    await set(testRef, testData);
    console.log('✅ Database write successful');

    // Verify the write
    console.log('\n🔍 Verifying write...');
    const verifySnapshot = await get(testRef);
    console.log('✅ Write verification successful');
    console.log('Written data:', verifySnapshot.val());

    console.log('\n🎉 Firebase database connection is working properly!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.log('\nPossible issues:');
    console.log('1. Firebase database rules might be too restrictive');
    console.log('2. Network connectivity issues');
    console.log('3. Firebase project configuration');
  }
}

testFirebaseConnection(); 