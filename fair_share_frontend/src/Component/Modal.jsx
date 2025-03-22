import React from 'react';

export const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};