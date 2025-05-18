import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const { transactions } = useTransactions();
  const { getCategoryColor } = useCategories();
  
  // Sort transactions by date (newest first) and take the first 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No transactions yet. Add your first transaction to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400' 
                  : 'bg-danger-100 dark:bg-danger-900 text-danger-600 dark:text-danger-400'
              }`}>
                {transaction.type === 'income' 
                  ? <ArrowUpCircle className="h-5 w-5" /> 
                  : <ArrowDownCircle className="h-5 w-5" />
                }
              </div>
              <div>
                <div className="font-medium">{transaction.category}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </div>
              </div>
            </div>
            <div className={`font-semibold ${
              transaction.type === 'income' 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-danger-600 dark:text-danger-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;