import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, FilterOptions } from '../types';
import { getTransactions, saveTransactions } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { filterTransactions } from '../utils/calculations';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  clearFilters: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = getTransactions();
    setTransactions(savedTransactions);
  }, []);

  // Update filtered transactions when transactions or filters change
  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, filters));
  }, [transactions, filters]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast.success(`${transaction.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast.success('Transaction updated successfully!');
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast.success('Transaction deleted successfully!');
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filteredTransactions,
        filters,
        setFilters,
        clearFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};