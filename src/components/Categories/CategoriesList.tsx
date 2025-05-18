import React, { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { Category } from '../../types';

const CategoriesList: React.FC = () => {
  const { categories, deleteCategory } = useCategories();
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Group categories by type
  const incomeCategories = categories.filter(c => c.type === 'income' || c.type === 'both');
  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  const renderCategoryList = (categoryList: Category[], title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {categoryList.length === 0 ? (
          <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
            No categories found.
          </div>
        ) : (
          categoryList.map(category => (
            <div key={category.id}>
              {editCategory === category.id ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-750">
                  <CategoryForm
                    existingCategory={category}
                    onCancel={() => setEditCategory(null)}
                    onSuccess={() => setEditCategory(null)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                    {category.type === 'both' && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        Income & Expense
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Edit category"
                      disabled={category.name === 'Other'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-danger-500 transition-colors"
                      aria-label="Delete category"
                      disabled={category.name === 'Other'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Add New Category</h3>
          <CategoryForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {renderCategoryList(incomeCategories, 'Income Categories')}
      {renderCategoryList(expenseCategories, 'Expense Categories')}
    </div>
  );
};

export default CategoriesList;