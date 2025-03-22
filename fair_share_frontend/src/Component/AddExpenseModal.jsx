import React, { useState } from 'react';
import { Modal } from './Modal';

export const AddExpenseModal = ({
  isOpen,
  onClose,
  onAddExpense,
  members,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('Equal');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      paidBy,
      splitType,
    });
    setDescription('');
    setAmount('');
    setCategory('');
    setPaidBy('');
    setSplitType('Equal');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Description*
          </label>
          <input
            type="text"
            value={description}
            placeholder="Write Something"
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Amount*
            </label>
            <input
              type="number"
              value={amount}
              placeholder="Enter Amount"
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Category*
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none appearance-none bg-white"
              required
            >
              <option value="">Select</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Paid by*
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none appearance-none bg-white"
              required
            >
              <option value="">Select</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Split Type*
            </label>
            <select
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-500 focus:outline-none appearance-none bg-white"
              required
            >
              <option value="Equal">Equal</option>
              <option value="Percentage">Percentage</option>
              <option value="Same Amount">Same Amount</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
          >
            Add
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