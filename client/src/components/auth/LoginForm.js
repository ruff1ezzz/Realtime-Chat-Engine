import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth, database } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '', username: '' });
  const [isSignup, setIsSignup] = useState(false);

  // Find user by username and return their email
  const findUserByUsername = async (username) => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userEntry = Object.entries(users).find(([uid, userData]) => 
          userData.username === username
        );
        if (userEntry) {
          return userEntry[1].email;
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let emailToUse = loginData.email;
      
      // Check if input is a username (doesn't contain @)
      if (!loginData.email.includes('@')) {
        const email = await findUserByUsername(loginData.email);
        if (email) {
          emailToUse = email;
        } else {
          toast.error('Username not found. Please check your username or use your email.');
          return;
        }
      }
      
      await signInWithEmailAndPassword(auth, emailToUse, loginData.password);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please check your email/username and password.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    try {
      // Check if username already exists
      const existingEmail = await findUserByUsername(loginData.username);
      if (existingEmail) {
        toast.error('Username already exists. Please choose a different username.');
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      
      // Save username to Firebase Database
      const userData = {
        username: loginData.username.trim(),
        email: loginData.email,
        createdAt: Date.now()
      };
      
      await set(ref(database, `users/${user.uid}`), userData);
      
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists. Please use a different email or sign in.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Private Chat Rooms
            </h1>
            <p className="text-gray-600">
              {isSignup ? 'Sign up new account' : 'Sign in to start chatting'}
            </p>
          </div>

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your username"
                  required={isSignup}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isSignup ? 'Email' : 'Email or Username'}
              </label>
              <input
                type="text"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder={isSignup ? "Enter your email" : "Enter your email or username"}
                required
              />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm; 