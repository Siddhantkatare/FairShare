import React, { useState } from 'react';
import { AddMemberModal } from './Component/AddMemberModal';
import { AddExpenseModal } from './Component/AddExpenseModal';

function App() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const handleAddMember = (newMember) => {
    const member = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMembers([...members, member]);
  };

  const handleContinueToExpense = () => {
    if (members.length >= 2) {
      setShowAddMemberModal(false);
      setShowAddExpenseModal(true);
    }
  };

  const handleAddExpense = (newExpense) => {
    const expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, expense]);
    setShowAddExpenseModal(false);
  };

  const handleAddExpenseClick = () => {
    setShowAddMemberModal(true);
  };

  const expenseRows = expenses.map((expense) => {
    const payer = members.find((m) => m.id === expense.paidBy);
    return {
      payFor: expense.category,
      from: payer?.name || '',
      to: members.filter((m) => m.id !== expense.paidBy).map((m) => m.name).join(', '),
      amount: `${expense.amount}$`,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">LOGO</h1>
            <nav className="space-y-4">
              <a href="#" className="flex items-center text-lg font-medium px-4 py-2 bg-gray-100 rounded">
                Home
              </a>
              <a href="#" className="flex items-center text-lg font-medium px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Group Creation
              </a>
              <a href="#" className="flex items-center text-lg font-medium px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Expense Tracking
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Dashboard</h2>
            <button
              onClick={handleAddExpenseClick}
              className="bg-gray-200 text-black px-6 py-2 rounded-lg text-lg hover:bg-gray-300"
            >
              Add Expense
            </button>
          </div>

          {/* Expense Table */}
          <div className="bg-white rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-lg font-medium">Pay For</th>
                  <th className="text-left p-4 text-lg font-medium">From</th>
                  <th className="text-left p-4 text-lg font-medium">To</th>
                  <th className="text-left p-4 text-lg font-medium">Amount</th>
                  <th className="text-right p-4"></th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map((row, index) => (
                  <tr key={index} className="border-b bg-gray-50">
                    <td className="p-4">{row.payFor}</td>
                    <td className="p-4">{row.from}</td>
                    <td className="p-4">{row.to}</td>
                    <td className="p-4">{row.amount}</td>
                    <td className="p-4 text-right">
                      <button className="bg-gray-200 text-black px-4 py-1 rounded-lg hover:bg-gray-300">
                        Settle Up
                      </button>
                    </td>
                  </tr>
                ))}
                {expenseRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No expenses added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={handleAddMember}
        onContinue={handleContinueToExpense}
        members={members}
      />

      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onAddExpense={handleAddExpense}
        members={members}
      />
    </div>
  );
}

export default App;