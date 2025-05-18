import React from 'react';
import CategoriesList from '../components/Categories/CategoriesList';

const Categories: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <CategoriesList />
    </div>
  );
};

export default Categories;