import React from 'react';
import Summary from '../components/Dashboard/Summary';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import Charts from '../components/Dashboard/Charts';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from '../components/Transactions/TransactionForm';

const Dashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Transaction
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <TransactionForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <Summary />
      <Charts />
      <div className="mt-6">
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;