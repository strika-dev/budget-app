// Utility functions for Budget Manager

/**
 * Format a number as currency (EUR)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date for display
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short' 
  });
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).slice(2, 11);
};

/**
 * Get percentage of total
 */
export const getPercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Calculate totals from transactions
 */
export const calculateTotals = (transactions) => {
  return transactions.reduce((acc, t) => {
    if (t.type === 'income') {
      acc.income += t.amount;
    } else {
      acc.expenses += t.amount;
    }
    acc.balance = acc.income - acc.expenses;
    return acc;
  }, { income: 0, expenses: 0, balance: 0 });
};

/**
 * Group transactions by category
 */
export const groupByCategory = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
};

/**
 * Group transactions by month
 */
export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, t) => {
    const key = t.date.slice(0, 7);
    if (!acc[key]) {
      acc[key] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      acc[key].income += t.amount;
    } else {
      acc[key].expenses += t.amount;
    }
    return acc;
  }, {});
};

/**
 * Sort transactions by date (newest first)
 */
export const sortByDate = (transactions) => {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * Generate sample data
 */
export const generateSampleData = () => {
  const txs = [];
  const now = new Date();
  
  for (let m = 0; m < 4; m++) {
    const mo = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const yy = mo.getFullYear();
    const mm = mo.getMonth();
    
    // Salary
    txs.push({
      id: generateId(),
      type: 'income',
      category: 'salary',
      amount: 3200 + Math.floor(Math.random() * 300),
      description: 'Salaire',
      date: `${yy}-${String(mm + 1).padStart(2, '0')}-05`,
    });
    
    // Occasional freelance
    if (Math.random() > 0.5) {
      txs.push({
        id: generateId(),
        type: 'income',
        category: 'freelance',
        amount: 400 + Math.floor(Math.random() * 600),
        description: 'Mission',
        date: `${yy}-${String(mm + 1).padStart(2, '0')}-${10 + Math.floor(Math.random() * 15)}`,
      });
    }
    
    // Expenses
    const expenses = [
      ['housing', 950],
      ['food', 380],
      ['transport', 120],
      ['utilities', 95],
      ['entertainment', 60],
      ['shopping', 150],
    ];
    
    expenses.forEach(([cat, base]) => {
      txs.push({
        id: generateId(),
        type: 'expense',
        category: cat,
        amount: base + Math.floor(Math.random() * 80),
        description: '',
        date: `${yy}-${String(mm + 1).padStart(2, '0')}-${1 + Math.floor(Math.random() * 27)}`,
      });
    });
  }
  
  return sortByDate(txs);
};

export default {
  formatCurrency,
  formatDate,
  formatDateForInput,
  generateId,
  getPercentage,
  calculateTotals,
  groupByCategory,
  groupByMonth,
  sortByDate,
  generateSampleData,
};
