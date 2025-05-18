import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../types';
import { getCategories, saveCategories } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getCategoryByName: (name: string) => Category | undefined;
  getCategoryColor: (name: string) => string;
  getCategoriesByType: (type: 'income' | 'expense' | 'both') => Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from localStorage on initial render
  useEffect(() => {
    const savedCategories = getCategories();
    setCategories(savedCategories);
  }, []);

  const addCategory = (category: Omit<Category, 'id'>) => {
    // Check if category with same name already exists
    if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
      toast.error('Category with this name already exists!');
      return;
    }
    
    const newCategory = {
      ...category,
      id: uuidv4(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast.success('Category added successfully!');
  };

  const updateCategory = (updatedCategory: Category) => {
    // Check if we're trying to rename to an existing category name
    const existingWithSameName = categories.find(
      c => c.name.toLowerCase() === updatedCategory.name.toLowerCase() && c.id !== updatedCategory.id
    );
    
    if (existingWithSameName) {
      toast.error('Category with this name already exists!');
      return;
    }
    
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast.success('Category updated successfully!');
  };

  const deleteCategory = (id: string) => {
    // Don't allow deleting the "Other" category
    const categoryToDelete = categories.find(c => c.id === id);
    if (categoryToDelete?.name === 'Other') {
      toast.error('Cannot delete the "Other" category!');
      return;
    }
    
    const updatedCategories = categories.filter(
      (category) => category.id !== id
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast.success('Category deleted successfully!');
  };

  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  };

  const getCategoryColor = (name: string): string => {
    const category = categories.find(
      (category) => category.name === name
    );
    return category?.color || '#6B7280'; // Default color if not found
  };

  const getCategoriesByType = (type: 'income' | 'expense' | 'both'): Category[] => {
    if (type === 'both') {
      return categories;
    }
    return categories.filter(
      (category) => category.type === type || category.type === 'both'
    );
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryByName,
        getCategoryColor,
        getCategoriesByType,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};