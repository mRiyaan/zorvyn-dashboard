// Pure JS aggregation utilities for Granular Tier (Phase 4)

export function buildLiquidityData(data) {
  if (!data || !Array.isArray(data)) return [];

  const completed = data.filter(txn => txn.status === 'COMPLETED');

  const revenue = completed
    .filter(txn => txn.type === 'REVENUE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const expenses = completed
    .filter(txn => txn.type === 'EXPENSE')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const cashPosition = revenue - expenses;
  // Simulated Debt-to-Equity — assume fixed debt of ~20% of revenue
  const totalDebt = revenue * 0.20;
  const equity = cashPosition > 0 ? cashPosition : 1;
  const debtToEquity = parseFloat((totalDebt / equity).toFixed(2));

  // Churn rate approximation: ratio of FAILED transactions to total
  const totalTxns = data.filter(txn => txn.type === 'REVENUE').length;
  const failedTxns = data.filter(txn => txn.type === 'REVENUE' && txn.status === 'FAILED').length;
  const churnRate = totalTxns > 0 ? parseFloat(((failedTxns / totalTxns) * 100).toFixed(1)) : 0;

  return {
    donutData: [
      { name: 'Cash Position', value: Math.max(cashPosition, 0) },
      { name: 'Total Debt', value: totalDebt },
      { name: 'Operating Expenses', value: expenses },
    ],
    metrics: {
      cashPosition,
      debtToEquity,
      churnRate,
    },
  };
}

export function buildTransactionalHealthData(data) {
  if (!data || !Array.isArray(data)) return [];

  const regions = ['US-EAST', 'US-WEST', 'EU-CENTRAL', 'APAC'];
  const statuses = ['COMPLETED', 'PENDING', 'FAILED'];

  return regions.map(region => {
    const regionTxns = data.filter(txn => txn.region === region);
    const row = { region };
    statuses.forEach(status => {
      row[status] = regionTxns.filter(txn => txn.status === status).length;
    });
    row.total = regionTxns.length;
    row.successRate = row.total > 0
      ? parseFloat(((row.COMPLETED / row.total) * 100).toFixed(1))
      : 0;
    return row;
  });
}
