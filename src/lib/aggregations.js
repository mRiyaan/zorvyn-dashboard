import { subDays, isAfter, isBefore, isWithinInterval } from 'date-fns';

// Pure JS operations per requirements
export function calculateTotalRevenue(data) {
  if (!data || !Array.isArray(data)) return 0;
  
  return data
    .filter(txn => txn.status === 'COMPLETED' && txn.type === 'REVENUE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
}

export function calculateNetProfit(data) {
  if (!data || !Array.isArray(data)) return 0;

  const validData = data.filter(txn => txn.status === 'COMPLETED');
  
  const revenue = validData
    .filter(txn => txn.type === 'REVENUE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
    
  const opex = validData
    .filter(txn => txn.type === 'EXPENSE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);

  return revenue - opex;
}

export function calculateCashRunway(data, currentBalance = 5000000) {
  if (!data || !Array.isArray(data)) return 0;

  const expenses = data.filter(txn => txn.status === 'COMPLETED' && txn.type === 'EXPENSE');
  
  if (expenses.length === 0) return Infinity;

  // Find the earliest and latest expense to determine duration
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const firstDate = new Date(sortedExpenses[0].timestamp);
  const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].timestamp);
  
  const diffMonths = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30.44) || 1;
  const totalExpense = sortedExpenses.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  
  const monthlyBurnRate = totalExpense / diffMonths;
  
  if (monthlyBurnRate <= 0) return Infinity; // No burn
  
  return currentBalance / monthlyBurnRate;
}

export function calculateTotalExpense(data) {
  if (!data || !Array.isArray(data)) return 0;
  
  return data
    .filter(txn => txn.status === 'COMPLETED' && txn.type === 'EXPENSE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
}

/**
 * Calculates percentage variance between current and previous periods.
 * Default period: 30 days.
 * Returns { percentage: "+12.4%", type: "up" | "down" }
 */
export function calculateVariance(data, type = 'REVENUE') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { percentage: '0.0%', type: 'up' };
  }

  const completed = data.filter(txn => txn.status === 'COMPLETED');
  if (completed.length === 0) return { percentage: '0.0%', type: 'up' };

  // Helper for sub-filtering
  const filterByType = (list, t) => list.filter(txn => txn.type === t);
  const sum = (list) => list.reduce((acc, txn) => acc + (txn.amount || 0), 0);

  // Determine the temporal reference point (latest transaction in the set)
  const sorted = [...completed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latestDate = new Date(sorted[0].timestamp);
  
  const currentStart = subDays(latestDate, 30);
  const previousEnd = subDays(currentStart, 1);
  const previousStart = subDays(previousEnd, 30);

  const currentWindow = completed.filter(txn => isAfter(new Date(txn.timestamp), currentStart));
  const previousWindow = completed.filter(txn => isWithinInterval(new Date(txn.timestamp), { start: previousStart, end: previousEnd }));

  let currentVal, previousVal;

  if (type === 'NET_PROFIT') {
    currentVal = sum(filterByType(currentWindow, 'REVENUE')) - sum(filterByType(currentWindow, 'EXPENSE'));
    previousVal = sum(filterByType(previousWindow, 'REVENUE')) - sum(filterByType(previousWindow, 'EXPENSE'));
  } else {
    currentVal = sum(filterByType(currentWindow, type));
    previousVal = sum(filterByType(previousWindow, type));
  }

  if (previousVal === 0) {
    return { percentage: currentVal > 0 ? '+100%' : '0.0%', type: 'up' };
  }

  const diff = ((currentVal - previousVal) / Math.abs(previousVal)) * 100;
  const isUp = diff >= 0;

  return {
    percentage: `${isUp ? '+' : ''}${diff.toFixed(1)}%`,
    type: isUp ? 'up' : 'down'
  };
}

