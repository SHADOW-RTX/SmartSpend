export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'both';
  color?: string;
}

export interface FilterOptions {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}