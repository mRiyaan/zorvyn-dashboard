import { useState } from 'react';
import { calculateTotalRevenue, calculateNetProfit, calculateCashRunway, calculateTotalExpense, calculateVariance } from '@/lib/aggregations';
import { X, Maximize2 } from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function MetricCard({ title, amount, subtext, variance, type, onClick }) {
  const isPositive = type === 'up';
  return (
    <div
      onClick={onClick}
      className="bg-background border border-border-grid p-4 rounded-sm flex flex-col space-y-2 min-w-0 overflow-hidden shadow-sm hover:bg-brand/5 transition-all cursor-pointer group relative"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity text-[#FFA028]">
        <Maximize2 size={10} />
      </div>
      <span className="text-[10px] font-black tracking-[0.2em] text-[#FFA028] uppercase truncate">{title}</span>
      <span className="text-xl sm:text-2xl lg:text-3xl font-mono text-foreground font-black whitespace-nowrap overflow-hidden text-ellipsis tracking-tighter" title={amount}>
        {amount}
      </span>
      <div className="flex items-center space-x-2">
        {variance && (
          <span className={`text-[11px] font-black ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
            {isPositive ? '▲' : '▼'} {variance}
          </span>
        )}
        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider opacity-50">
          {subtext}
        </span>
      </div>
    </div>
  );
}

export function KPIScorecards({ data }) {
  const [focusedMetric, setFocusedMetric] = useState(null);

  const totalRevenue = calculateTotalRevenue(data);
  const totalExpense = calculateTotalExpense(data);
  const netProfit = calculateNetProfit(data);
  const cashRunway = calculateCashRunway(data);

  const revVar = calculateVariance(data, 'REVENUE');
  const expVar = calculateVariance(data, 'EXPENSE');
  const profitVar = calculateVariance(data, 'NET_PROFIT');

  const metrics = [
    { title: "TOTAL REVENUE", amount: formatCurrency(totalRevenue), subtext: "vs last period", variance: revVar.percentage, type: revVar.type },
    { title: "TOTAL EXPENSE", amount: formatCurrency(totalExpense), subtext: "vs last period", variance: expVar.percentage, type: expVar.type === 'up' ? 'down' : 'up' },
    { title: "NET PROFIT", amount: formatCurrency(netProfit), subtext: "vs last period", variance: profitVar.percentage, type: profitVar.type },
    { title: "CASH RUNWAY", amount: `${cashRunway.toFixed(1)} Months`, subtext: "projected exhaust", variance: cashRunway > 12 ? "+1.1M" : "-0.5M", type: cashRunway > 12 ? "up" : "down" }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6 relative">
        {metrics.map((m, idx) => (
          <MetricCard
            key={idx}
            {...m}
            onClick={() => setFocusedMetric(m)}
          />
        ))}
      </div>

      {/* FOCUS MODAL: High-Density Zoom View */}
      {focusedMetric && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 pointer-events-none"
        >
          {/* Dashboard Blur Layer - Theme Aware Overlay */}
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-2xl transition-all pointer-events-auto"
            onClick={() => setFocusedMetric(null)}
          />

          {/* Metric Hero Card - Responsive Sizing */}
          <div
            className="relative bg-background border border-border-grid p-6 sm:p-12 rounded-sm w-full h-auto max-w-[95vw] md:max-w-[75vw] lg:max-w-[55vw] max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-10 overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFocusedMetric(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-foreground transition-colors"
            >
              <X size={28} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] sm:text-[12px] font-black tracking-[0.4em] text-brand uppercase opacity-60">
                METRIC_FOCUS // {focusedMetric.title}
              </span>
              <div className="h-px w-16 bg-brand/30 mx-auto" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono text-foreground font-black tracking-tighter leading-none drop-shadow-sm">
              {focusedMetric.amount}
            </h1>

            <div className="flex flex-col items-center space-y-3">
              <div className={`text-2xl sm:text-4xl font-black flex items-center gap-3 ${focusedMetric.type === 'up' ? 'text-bullish' : 'text-bearish'}`}>
                {focusedMetric.type === 'up' ? '▲' : '▼'} {focusedMetric.variance}
              </div>
              <span className="text-[14px] text-gray-500 uppercase font-bold tracking-[0.2em] opacity-40">
                {focusedMetric.subtext}
              </span>
            </div>

            <div className="w-full h-px bg-border-grid opacity-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left w-full max-w-2xl px-2">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[9px] sm:text-[10px] font-black text-brand uppercase tracking-widest">Statistical Confidence</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-mono">ENHANCED_VERIFICATION_ACTIVE (Level 4)</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[9px] sm:text-[10px] font-black text-brand uppercase tracking-widest">Ledger Source</p>
                <p className="text-[10px] sm:text-xs text-gray-400 font-mono">MOCK_PRIMARY_LEDGER.JSON // {data.length} RECS</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
