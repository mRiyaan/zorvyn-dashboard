"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload.find(p => p.dataKey === 'change');
    if (!data) return null;
    
    return (
      <div className="bg-black border border-border-grid p-3 shadow-2xl space-y-1">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-mono text-white font-bold">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseWaterfall({ data }) {
  const bearishColor = "var(--semantic-down)"; 
  const gridLineColor = "var(--border-grid)";
  const brandColor = "var(--brand)"; 

  return (
    <div className="bg-background border border-border-grid p-4 md:p-6 rounded-sm flex flex-col h-full min-h-[400px]">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 mb-6 uppercase">OPEX Budget Variance</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridLineColor} vertical={false} opacity={0.3} />
            <XAxis dataKey="name" height={55} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            {/* The transparent bottom block holding the waterfall up */}
            <Bar dataKey="base" stackId="a" fill="transparent" />
            
            {/* The visible variance changes */}
            <Bar dataKey="change" stackId="a">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isTotal ? brandColor : bearishColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
