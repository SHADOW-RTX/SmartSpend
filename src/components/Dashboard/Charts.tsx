import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { Pie, Bar } from 'react-chartjs-2';
import { groupTransactionsByCategory } from '../../utils/calculations';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Charts: React.FC = () => {
  const { transactions } = useTransactions();
  const { getCategoryColor } = useCategories();

  if (transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Expense Breakdown</h2>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No expense data to display
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Comparison</h2>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No transaction data to display
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for expense breakdown chart
  const expensesByCategory = groupTransactionsByCategory(transactions, 'expense');
  const expenseCategories = Object.keys(expensesByCategory);
  const expenseAmounts = Object.values(expensesByCategory);
  const expenseColors = expenseCategories.map(category => getCategoryColor(category));

  const expenseData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseAmounts,
        backgroundColor: expenseColors,
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  // Prepare data for monthly comparison chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return months[monthIndex];
  }).reverse();

  const monthlyIncome = Array(6).fill(0);
  const monthlyExpense = Array(6).fill(0);

  // Group transactions by month
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const monthsAgo = (currentMonth - month + 12) % 12;
    
    if (monthsAgo < 6) {
      const index = 5 - monthsAgo;
      if (transaction.type === 'income') {
        monthlyIncome[index] += transaction.amount;
      } else {
        monthlyExpense[index] += transaction.amount;
      }
    }
  });

  const comparisonData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyExpense,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
          padding: 20,
          font: {
            size: 12
          }
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Expense Breakdown</h2>
        <div className="h-64">
          <Pie data={expenseData} options={options} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Comparison</h2>
        <div className="h-64">
          <Bar data={comparisonData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Charts;