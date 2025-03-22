import React, { useState } from 'react';
import { Modal } from './Modal';

export const AddMemberModal = ({
  isOpen,
  onClose,
  onAddMember,
  members,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMember({ name, email });
    setName('');
    setEmail('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Members">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Enter Name*
          </label>
          <input
            type="text"
            value={name}
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Enter Email*
          </label>
          <input
            type="email"
            value={email}
            placeholder="johndoe@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Members</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {members.length === 0 ? (
              <p className="text-gray-500">none</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member.id}>
                    {member.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};