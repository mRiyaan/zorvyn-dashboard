"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

export function RevenueChart({ data }) {
  // Using pure CVD blue mappings passed through Tailwind's CSS vars logic where possible, 
  // but Recharts needs static hex or rgb strings unless manually fetched. 
  // Recharts supports CSS variable strings directly for stroke and fill
  const bullishColor = "var(--semantic-up)";
  const gridLineColor = "var(--border-grid)"; 

  return (
    <div className="bg-background border border-border-grid p-4 md:p-6 rounded-sm flex flex-col h-full min-h-[400px]">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 mb-6 uppercase">Revenue & Growth Analytics</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={bullishColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={bullishColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridLineColor} vertical={false} opacity={0.3} />
            <XAxis dataKey="month" height={20} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#373b41', color: '#fff', fontSize: '14px' }}
              itemStyle={{ color: bullishColor, fontWeight: 'bold' }}
              formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={bullishColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
