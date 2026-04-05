import { calculateVariance } from '@/lib/aggregations';
import { AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function QuickInsights({ data }) {
  if (!data || data.length === 0) return null;

  // 1. Highest Spending Category
  const expenseByCategory = data
    .filter(txn => txn.type === 'EXPENSE' && txn.status === 'COMPLETED')
    .reduce((acc, txn) => {
      const category = txn.category || txn.merchant_category || 'UNKNOWN';
      acc[category] = (acc[category] || 0) + (txn.amount || 0);
      return acc;
    }, {});
  
  let highestCategory = 'N/A';
  let highestAmount = 0;
  for (const [cat, amt] of Object.entries(expenseByCategory)) {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat;
    }
  }

  // 2. Net Profit Trend
  const profitTrend = calculateVariance(data, 'NET_PROFIT');

  // 3. Data scope insight
  const txnVolume = data.length;
  const regions = [...new Set(data.map(d => d.region))];
  const regionText = regions.length > 1 ? 'Global Market' : (regions[0] || 'Unknown');

  return (
    <div className="w-full lg:w-[80%] mx-auto mb-8 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-300 dark:border-border-grid rounded-sm p-4 md:p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 shadow-sm transition-all duration-300 break-words whitespace-normal h-auto">
       
       {/* Insight 1: Highest Expense */}
       <div className="flex items-start md:items-center space-x-3 w-full md:w-auto flex-1 h-auto">
          <AlertCircle size={14} className="text-[#FFA028] flex-shrink-0 mt-0.5 md:mt-0" />
          <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
             <span className="text-[#FFA028] font-black uppercase mr-2 tracking-wide">Top Expense:</span>
             {highestCategory} (${(highestAmount / 1000).toFixed(1)}k)
          </p>
       </div>
       
       <div className="hidden md:block w-px h-6 bg-zinc-300 dark:bg-zinc-700/50 flex-shrink-0" />
       
       {/* Insight 2: Profit Trend */}
       <div className="flex items-start md:items-center space-x-3 w-full md:w-auto flex-1 h-auto">
          {profitTrend.type === 'up' ? <TrendingUp size={14} className="text-bullish flex-shrink-0 mt-0.5 md:mt-0" /> : <TrendingDown size={14} className="text-bearish flex-shrink-0 mt-0.5 md:mt-0" />}
          <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
             <span className={`font-black uppercase mr-2 tracking-wide ${profitTrend.type === 'up' ? 'text-bullish' : 'text-bearish'}`}>Profit Trend:</span>
             Net profit implies {profitTrend.type === 'up' ? 'an upward' : 'a downward'} trajectory by {profitTrend.percentage}.
          </p>
       </div>

       <div className="hidden md:block w-px h-6 bg-zinc-300 dark:bg-zinc-700/50 flex-shrink-0" />

       {/* Insight 3: Active Scope */}
       <div className="flex items-start md:items-center space-x-3 w-full md:w-auto flex-1 h-auto">
          <Info size={14} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5 md:mt-0" />
          <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
             <span className="text-blue-500 dark:text-blue-400 font-black uppercase mr-2 tracking-wide">Active Scope:</span>
             Validating {txnVolume} institutional transactions across {regionText}.
          </p>
       </div>

    </div>
  );
}
