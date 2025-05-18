import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { FilterOptions } from '../../types';
import { Filter, X } from 'lucide-react';

const TransactionFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useTransactions();
  const { getCategoriesByType } = useCategories();
  
  const handleTypeChange = (type: 'income' | 'expense' | '') => {
    if (type === '') {
      const { type, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      setFilters({ ...filters, type: type as 'income' | 'expense' });
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    if (category === '') {
      const { category, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      setFilters({ ...filters, category });
    }
  };
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };
  
  // Get categories based on selected type
  const categories = filters.type 
    ? getCategoriesByType(filters.type)
    : getCategoriesByType('both');
  
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter Transactions
        </h3>
        {(filters.type || filters.category || filters.startDate || filters.endDate) && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Transaction Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                filters.type === 'income'
                  ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleTypeChange(filters.type === 'income' ? '' : 'income')}
            >
              Income
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                filters.type === 'expense'
                  ? 'bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleTypeChange(filters.type === 'expense' ? '' : 'expense')}
            >
              Expense
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={filters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Range Filter - Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="start-date"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={filters.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
        </div>
        
        {/* Date Range Filter - End Date */}
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="end-date"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={filters.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;