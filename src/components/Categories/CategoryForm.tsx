import React, { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { Category } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface CategoryFormProps {
  existingCategory?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  existingCategory,
  onSuccess,
  onCancel,
}) => {
  const { addCategory, updateCategory } = useCategories();
  
  const [name, setName] = useState(existingCategory?.name || '');
  const [type, setType] = useState<'income' | 'expense' | 'both'>(
    existingCategory?.type || 'expense'
  );
  const [color, setColor] = useState(existingCategory?.color || '#3B82F6');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const categoryData = {
      name: name.trim(),
      type,
      color,
    };
    
    if (existingCategory) {
      updateCategory({
        ...categoryData,
        id: existingCategory.id,
      });
    } else {
      addCategory(categoryData);
      // Reset form for new categories
      setName('');
      setType('expense');
      setColor('#3B82F6');
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            className={`block w-full rounded-md ${
              errors.name
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm`}
            placeholder="e.g., Groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
          )}
        </div>

        {/* Category Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type *
          </label>
          <div className="flex flex-wrap gap-4">
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
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600 focus:ring-primary-500"
                name="type"
                checked={type === 'both'}
                onChange={() => setType('both')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Both</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category Color */}
      <div className="mb-4">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            id="color"
            className="h-8 w-8 border-0 rounded-md p-0 cursor-pointer"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Select a color for this category
          </span>
        </div>
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
          {existingCategory ? 'Update' : 'Add'} Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;