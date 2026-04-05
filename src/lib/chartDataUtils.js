import { format, parseISO } from 'date-fns';

export function groupDataByMonth(data) {
  if (!data || !Array.isArray(data)) return [];

  const grouped = data.reduce((acc, txn) => {
    // Only aggregate COMPLETED transactions
    if (txn.status !== 'COMPLETED') return acc;
    
    // Group strictly by formatting ISO into "MMM yy" (e.g., "Jan 25")
    const monthKey = format(parseISO(txn.timestamp), 'MMM yy');
    
    if (!acc[monthKey]) {
       acc[monthKey] = {
         month: monthKey,
         rawDate: new Date(parseISO(txn.timestamp).getFullYear(), parseISO(txn.timestamp).getMonth(), 1).getTime(),
         revenue: 0,
         expenses: 0,
       };
    }

    if (txn.type === 'REVENUE') {
      acc[monthKey].revenue += (txn.amount || 0);
    } else {
      acc[monthKey].expenses += (txn.amount || 0);
    }

    return acc;
  }, {});

  // Convert into array and sort chronologically
  return Object.values(grouped).sort((a, b) => a.rawDate - b.rawDate);
}

export function buildWaterfallData(data) {
  if (!data || !Array.isArray(data)) return [];

  // Sum completely by expense categories specifically
  const expenses = data.filter(txn => txn.status === 'COMPLETED' && txn.type === 'EXPENSE');

  const catMap = expenses.reduce((acc, txn) => {
    const cat = txn.merchant_category;
    acc[cat] = (acc[cat] || 0) + (txn.amount || 0);
    return acc;
  }, {});

  // Compute variance. For a classic simple waterfall variance:
  // Base (always transparent) + Variance Bar (red/green).
  // Here we'll just return raw sorted objects mapped sequentially to budget derivations
  const items = Object.keys(catMap).map(k => ({
     name: k,
     value: catMap[k]
  }));

  // Sort largest to smallest for waterfall
  items.sort((a, b) => b.value - a.value);

  const waterfall = [];
  let runningTotal = 0;

  items.forEach(item => {
    // Recharts trick for Waterfall: Bottom transparent bar + Top colored bar
    waterfall.push({
      name: item.name,
      base: runningTotal, // The starting height
      change: item.value, // The actual bar height
      isTotal: false,
    });
    runningTotal += item.value;
  });

  // Finally push the Total bar
  waterfall.push({
    name: 'Total OPEX',
    base: 0,
    change: runningTotal,
    isTotal: true,
  });

  return waterfall;
}
