import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Edit, Trash2, Search } from 'lucide-react';
import TransactionForm from './TransactionForm';

const TransactionsList: React.FC = () => {
  const { filteredTransactions, deleteTransaction, filters, setFilters } = useTransactions();
  const { getCategoryColor } = useCategories();
  const [editTransaction, setEditTransaction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof filteredTransactions>);

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="animate-fade-in">
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(date)}
                </h3>
                <div className="ml-2 flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {groupedTransactions[date].map(transaction => (
                  <div key={transaction.id}>
                    {editTransaction === transaction.id ? (
                      <div className="p-4 bg-gray-50 dark:bg-gray-750">
                        <TransactionForm
                          existingTransaction={transaction}
                          onCancel={() => setEditTransaction(null)}
                          onSuccess={() => setEditTransaction(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
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
                            {transaction.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`font-semibold ${
                            transaction.type === 'income' 
                              ? 'text-success-600 dark:text-success-400' 
                              : 'text-danger-600 dark:text-danger-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => setEditTransaction(transaction.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              aria-label="Edit transaction"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteTransaction(transaction.id)}
                              className="p-1 text-gray-400 hover:text-danger-500 transition-colors"
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TransactionsList;