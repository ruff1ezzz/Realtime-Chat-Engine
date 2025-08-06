import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

const DeleteRoomModal = ({ isOpen, roomToDelete, onClose, onDelete }) => {
  if (!isOpen || !roomToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Room</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Delete "{roomToDelete.name}"?
            </h4>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All messages and room data will be permanently deleted.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Delete Room
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteRoomModal; 