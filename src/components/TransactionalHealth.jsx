"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TransactionalHealth({ data }) {
  if (!data || data.length === 0) return null;

    const gridLineColor = "var(--border-grid)";
    const bullishColor = "var(--semantic-up)";
    const pendingColor = "var(--brand)";
    const bearishColor = "var(--semantic-down)";

  return (
    <div className="bg-background border border-border-grid p-4 md:p-6 rounded-sm flex flex-col h-full min-h-[400px]">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 mb-4 uppercase">
        Transactional Health by Region
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridLineColor} vertical={false} opacity={0.3} />
            <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-grid)', color: 'var(--foreground)', fontSize: '13px' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#888' }}
              iconType="square"
              iconSize={10}
            />
            <Bar dataKey="COMPLETED" fill={bullishColor} radius={[2, 2, 0, 0]} />
            <Bar dataKey="PENDING" fill={pendingColor} radius={[2, 2, 0, 0]} />
            <Bar dataKey="FAILED" fill={bearishColor} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
