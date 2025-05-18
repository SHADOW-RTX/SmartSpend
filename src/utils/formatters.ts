import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatNumberInput = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '');
};

export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCategoryById = (
  categoryId: string, 
  categories: Array<{ id: string; name: string }>
): string => {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.name : 'Unknown';
};