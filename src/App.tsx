import React from 'react';
import Layout from './components/Layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';

function App() {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <TransactionProvider>
          <Layout />
        </TransactionProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default App;