import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { calculateBalance, calculateTotalByType } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

const Summary: React.FC = () => {
  const { transactions } = useTransactions();
  
  const balance = calculateBalance(transactions);
  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpense = calculateTotalByType(transactions, 'expense');

  const summaryItems = [
    {
      title: 'Current Balance',
      value: formatCurrency(balance),
      icon: <Wallet className="h-6 w-6" />,
      iconBg: 'bg-primary-100 dark:bg-primary-900',
      iconColor: 'text-primary-600 dark:text-primary-400',
      textColor: balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: <ArrowUpCircle className="h-6 w-6" />,
      iconBg: 'bg-success-100 dark:bg-success-900',
      iconColor: 'text-success-600 dark:text-success-400',
      textColor: 'text-success-600 dark:text-success-400'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpense),
      icon: <ArrowDownCircle className="h-6 w-6" />,
      iconBg: 'bg-danger-100 dark:bg-danger-900',
      iconColor: 'text-danger-600 dark:text-danger-400',
      textColor: 'text-danger-600 dark:text-danger-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      {summaryItems.map((item, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">{item.title}</h3>
            <div className={`${item.iconBg} p-2 rounded-full ${item.iconColor}`}>
              {item.icon}
            </div>
          </div>
          <div className={`text-2xl font-bold ${item.textColor}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Summary;