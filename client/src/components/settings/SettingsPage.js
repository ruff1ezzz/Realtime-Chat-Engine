import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Mail, Calendar, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { database, auth } from '../../firebase';
import { ref, set, get } from 'firebase/database';

const SettingsPage = ({ user, userData, onBack, onUpdateUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        email: userData.email || user?.email || ''
      });
    }
  }, [userData, user]);

  const handleSave = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      // Check if username is being changed and if it already exists
      if (formData.username !== userData?.username) {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const users = snapshot.val();
          const existingUser = Object.entries(users).find(([uid, userData]) => 
            userData.username === formData.username && uid !== user.uid
          );
          if (existingUser) {
            toast.error('Username already exists. Please choose a different username.');
            setLoading(false);
            return;
          }
        }
      }

      // Update user data in Firebase
      const updatedUserData = {
        ...userData,
        username: formData.username.trim(),
        email: formData.email,
        updatedAt: Date.now()
      };

      await set(ref(database, `users/${user.uid}`), updatedUserData);
      
      // Update local state
      onUpdateUserData(updatedUserData);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userData?.username || '',
      email: userData?.email || user?.email || ''
    });
    setIsEditing(false);
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const getRandomColor = (username) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium"></span>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-left">Profile Settings</h1>
          <p className="text-gray-600 mt-1 text-left">Manage your account information</p>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            {/* Profile Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold ${getRandomColor(userData?.username)}`}>
                  {getInitials(userData?.username)}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mt-3">
                  {userData?.username || 'User'}
                </h4>
                <p className="text-gray-500">{userData?.email || user?.email}</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Account Created
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500">
                    {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Unknown'
                    }
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || !formData.username.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">User ID</span>
                  <span className="text-sm text-gray-900 font-mono">{user?.uid}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`text-sm ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Last Sign In</span>
                  <span className="text-sm text-gray-900">
                    {user?.metadata?.lastSignInTime 
                      ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 