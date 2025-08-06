import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin mx-auto absolute top-0 left-0" style={{ animationDelay: '0.1s' }}></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading Chat Engine</h2>
        <p className="text-gray-500 mt-2">Connecting to real-time messaging...</p>
        
        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 