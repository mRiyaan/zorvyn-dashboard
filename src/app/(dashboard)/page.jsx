"use client";

import { useState, useMemo, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { KPIScorecards } from "@/components/KPIScorecards";
import { RevenueChart } from "@/components/RevenueChart";
import { ExpenseWaterfall } from "@/components/ExpenseWaterfall";
import { LiquidityDonut } from "@/components/LiquidityDonut";
import { TransactionalHealth } from "@/components/TransactionalHealth";
import { TransactionTable } from "@/components/TransactionTable";
import { QuickInsights } from "@/components/QuickInsights";
import { groupDataByMonth, buildWaterfallData } from "@/lib/chartDataUtils";
import { buildLiquidityData, buildTransactionalHealthData } from "@/lib/granularDataUtils";
import initialMockData from "@/lib/mockData";

export default function DashboardPage() {
  const [rawData, setRawData] = useState(initialMockData);
  const { selectedRegion } = useDashboard();

  // Load latest data from JSON source on mount to ensure persistence sync
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) {
          const data = await res.json();
          setRawData(data);
          console.log('Main Dashboard: Data synchronized from JSON ledger.');
        }
      } catch (err) {
        console.error('Failed to sync data:', err);
      }
    };
    fetchLatest();
  }, []);

  // Handle global CRUD changes across all tiers
  const handleTransactionChange = (txn, action) => {
    console.log(`Global update triggered: ${action}`, txn);
    setRawData(prev => {
      if (action === 'add') return [txn, ...prev];
      if (action === 'edit') return prev.map(t => t.transaction_id === txn.transaction_id ? txn : t);
      if (action === 'delete') return prev.filter(t => t.transaction_id !== txn.transaction_id);
      return prev;
    });
  };

  // Global Filter Logic - Applied to every visualization
  const filteredData = useMemo(() => {
    if (selectedRegion === 'All Regions') return rawData;
    return rawData.filter(txn => txn.region === selectedRegion);
  }, [rawData, selectedRegion]);

  // Derived data for charts
  const liquidityData = useMemo(() => buildLiquidityData(filteredData), [filteredData]);
  const healthData = useMemo(() => buildTransactionalHealthData(filteredData), [filteredData]);
  const chartData = useMemo(() => groupDataByMonth(filteredData), [filteredData]);
  const waterfallData = useMemo(() => buildWaterfallData(filteredData), [filteredData]);

  return (
    <div className="flex flex-col gap-8">
      {/* MACRO TIER: Top Level KPI Recalculation */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-border-grid pb-2">
          <h2 className="text-sm font-black tracking-[0.2em] text-black uppercase dark:text-white">
            EXECUTIVE SUMMARY <span className="text-brand opacity-50 ml-2">// {selectedRegion.toUpperCase()}</span>
          </h2>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            Scope: Real-time Ledger Analysis
          </div>
        </div>
        <KPIScorecards data={filteredData} />
        <QuickInsights data={filteredData} />
      </section>

      {/* CONTEXTUAL TIER: Charts that react to Region selection */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={chartData} />
        <ExpenseWaterfall data={waterfallData} />
      </section>

      {/* GRANULAR TIER: Risk & Health Analysis */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiquidityDonut liquidityData={liquidityData} />
        <TransactionalHealth data={healthData} />
      </section>

      {/* AUDIT TRAIL: Controlled Table synchronized with Dashboard State */}
      <section>
        <TransactionTable
          initialData={filteredData}
          onTransactionChange={handleTransactionChange}
        />
      </section>
    </div>
  );
}
