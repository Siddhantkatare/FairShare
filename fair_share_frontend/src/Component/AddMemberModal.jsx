import React, { useState } from 'react';
import { Modal } from './Modal';

export const AddMemberModal = ({
  isOpen,
  onClose,
  onAddMember,
  onContinue,
  members,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (members.length >= 2) {
      onContinue();
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter a member name';
    } else if (members.some(member => member.name.toLowerCase() === name.trim().toLowerCase())) {
      newErrors.name = 'A member with this name already exists';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter an email address';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (members.some(member => member.email.toLowerCase() === email.trim().toLowerCase())) {
      newErrors.email = 'A member with this email already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddMember({ 
      name: name.trim(),
      email: email.trim()
    });
    setName('');
    setEmail('');
    setErrors({});
  };

  const remainingMembers = Math.max(0, 2 - members.length);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Group Members">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Full Name*
          </label>
          <input
            type="text"
            value={name}
            placeholder="Enter full name"
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: '' }));
            }}
            className={`mt-1 block w-full rounded-lg border ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Email Address*
          </label>
          <input
            type="email"
            value={email}
            placeholder="example@domain.com"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            className={`mt-1 block w-full rounded-lg border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleAdd}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
          >
            Add Member
          </button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Members Added ({members.length})</h3>
            {remainingMembers > 0 && (
              <p className="text-sm text-orange-600">
                Add {remainingMembers} more member{remainingMembers !== 1 ? 's' : ''} to continue
              </p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {members.length === 0 ? (
              <p className="text-gray-500">No members added yet</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member, index) => (
                  <li key={member.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm mr-3">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-gray-500">{member.email}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-lg ${
              members.length >= 2
                ? 'bg-gray-200 hover:bg-gray-300 text-black'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={members.length < 2}
          >
            Continue
          </button>
        </div>
      </form>
    </Modal>
  );
};