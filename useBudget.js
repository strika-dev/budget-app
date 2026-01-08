// Custom hook for budget state management
import { useState, useCallback, useMemo } from 'react';
import {
  generateId,
  calculateTotals,
  groupByCategory,
  groupByMonth,
  sortByDate,
  generateSampleData,
} from '../utils/helpers';

export const useBudget = () => {
  const [transactions, setTransactions] = useState(generateSampleData);
  const [filter, setFilter] = useState({ type: 'all', category: 'all' });

  // Add a new transaction
  const addTransaction = useCallback((transaction) => {
    const newTx = {
      ...transaction,
      id: generateId(),
      amount: parseFloat(transaction.amount),
    };
    setTransactions(prev => sortByDate([...prev, newTx]));
  }, []);

  // Delete a transaction
  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    setTransactions(generateSampleData());
  }, []);

  // Clear all transactions
  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filter.type !== 'all') {
      result = result.filter(t => t.type === filter.type);
    }
    return sortByDate(result);
  }, [transactions, filter]);

  // Calculated values
  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);
  const expensesByCategory = useMemo(() => groupByCategory(filteredTransactions, 'expense'), [filteredTransactions]);
  const incomeByCategory = useMemo(() => groupByCategory(filteredTransactions, 'income'), [filteredTransactions]);
  const monthlyData = useMemo(() => groupByMonth(transactions), [transactions]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    filter,
    totals,
    expensesByCategory,
    incomeByCategory,
    monthlyData,
    addTransaction,
    deleteTransaction,
    resetToSampleData,
    clearAllTransactions,
    setFilter,
  };
};

export default useBudget;
