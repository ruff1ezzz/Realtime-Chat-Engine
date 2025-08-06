#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Real-time Chat Engine Setup');
console.log('===============================\n');

const questions = [
  {
    name: 'projectId',
    question: 'Enter your ChatEngine.io Project ID: ',
    required: true
  },
  {
    name: 'privateKey',
    question: 'Enter your ChatEngine.io Private Key: ',
    required: true
  },
  {
    name: 'port',
    question: 'Enter server port (default: 5000): ',
    default: '5000'
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  try {
    const answers = {};
    
    for (const q of questions) {
      let answer = await askQuestion(q.question);
      
      if (q.required && !answer) {
        console.log('❌ This field is required!');
        continue;
      }
      
      if (!answer && q.default) {
        answer = q.default;
      }
      
      answers[q.name] = answer;
    }

    // Create .env file
    const envContent = `# ChatEngine.io Configuration
CHAT_ENGINE_PROJECT_ID=${answers.projectId}
CHAT_ENGINE_PRIVATE_KEY=${answers.privateKey}

# Server Configuration
PORT=${answers.port}
NODE_ENV=development

# Security
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
`;

    fs.writeFileSync('.env', envContent);

    // Create client .env file
    const clientEnvContent = `REACT_APP_CHAT_ENGINE_PROJECT_ID=${answers.projectId}
REACT_APP_API_URL=http://localhost:${answers.port}
`;

    fs.writeFileSync('client/.env', clientEnvContent);

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📁 Files created:');
    console.log('  - .env (backend configuration)');
    console.log('  - client/.env (frontend configuration)');
    
    console.log('\n🚀 To start the application:');
    console.log('  1. Backend: npm run dev');
    console.log('  2. Frontend: npm run client');
    console.log('  3. Open: http://localhost:3000');
    
    console.log('\n📚 Next steps:');
    console.log('  1. Create a ChatEngine.io account at https://chatengine.io');
    console.log('  2. Create a new project');
    console.log('  3. Copy your Project ID and Private Key');
    console.log('  4. Update the .env files with your credentials');
    console.log('  5. Start the application');
    
    console.log('\n🔧 For help:');
    console.log('  - Read the README.md file');
    console.log('  - Check the troubleshooting section');
    console.log('  - Visit https://chatengine.io/docs');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup(); 