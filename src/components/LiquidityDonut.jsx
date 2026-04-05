"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['var(--semantic-up)', 'var(--brand)', 'var(--semantic-down)'];

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

function MetricRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function LiquidityDonut({ liquidityData }) {
  if (!liquidityData || !liquidityData.donutData) return null;

  const { donutData, metrics } = liquidityData;

  return (
    <div className="bg-background border border-border-grid p-4 md:p-6 rounded-sm flex flex-col h-full min-h-[400px]">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 mb-4 uppercase">
        Liquidity & Risk Assessment
      </h3>
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-4">
        {/* Donut */}
        <div className="w-full lg:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#000', borderColor: '#373b41', color: '#fff', fontSize: '13px' }}
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          <MetricRow label="Cash Position" value={formatCurrency(metrics.cashPosition)} color={COLORS[0]} />
          <MetricRow label="Debt-to-Equity" value={`${metrics.debtToEquity}x`} color={COLORS[1]} />
          <MetricRow label="Client Churn Rate" value={`${metrics.churnRate}%`} color={COLORS[2]} />
          <div className="border-t border-border-grid my-2" />
          {donutData.map((item, i) => (
            <MetricRow key={item.name} label={item.name} value={formatCurrency(item.value)} color={COLORS[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
