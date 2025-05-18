import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { Transaction } from '../../types';
import { formatNumberInput, getCurrentDateString } from '../../utils/formatters';
import { CheckCircle, XCircle } from 'lucide-react';

interface TransactionFormProps {
  existingTransaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  existingTransaction,
  onSuccess,
  onCancel,
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const { getCategoriesByType } = useCategories();
  
  const [amount, setAmount] = useState(existingTransaction?.amount.toString() || '');
  const [type, setType] = useState<'income' | 'expense'>(
    existingTransaction?.type || 'expense'
  );
  const [category, setCategory] = useState(existingTransaction?.category || '');
  const [date, setDate] = useState(
    existingTransaction?.date || getCurrentDateString()
  );
  const [description, setDescription] = useState(existingTransaction?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get categories based on selected transaction type
  const categories = getCategoriesByType(type);

  // Update category options when transaction type changes
  useEffect(() => {
    if (!existingTransaction) {
      // Only reset category when creating a new transaction
      setCategory('');
    }
  }, [type, existingTransaction]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const transactionData = {
      amount: parseFloat(amount),
      type,
      category,
      date,
      description: description.trim() || undefined,
    };
    
    if (existingTransaction) {
      updateTransaction({
        ...transactionData,
        id: existingTransaction.id,
      });
    } else {
      addTransaction(transactionData);
      // Reset form for new transactions
      setAmount('');
      setType('expense');
      setCategory('');
      setDescription('');
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatNumberInput(e.target.value);
    setAmount(value);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="amount"
              className={`block w-full pl-7 pr-3 py-2 rounded-md ${
                errors.amount
                  ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-danger-600">{errors.amount}</p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type *
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-success-600 focus:ring-success-500"
                name="type"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Income</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-danger-600 focus:ring-danger-500"
                name="type"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select
            id="category"
            className={`block w-full rounded-md ${
              errors.category
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-danger-600">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            className={`block w-full rounded-md ${
              errors.date
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-danger-600">{errors.date}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
          rows={2}
          placeholder="Add details about this transaction..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          {existingTransaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;