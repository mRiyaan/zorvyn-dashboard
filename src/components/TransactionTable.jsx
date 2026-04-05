"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useAuth } from '@/hooks/useAuth';
import TransactionFormModal from '@/components/TransactionFormModal';
import { 
  Trash2, 
  Edit2, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
}

function StatusBadge({ status }) {
  const colors = {
    COMPLETED: 'text-[#0068ff] bg-[#0068ff]/10',
    PENDING: 'text-[#FFA028] bg-[#FFA028]/10',
    FAILED: 'text-[#ff433d] bg-[#ff433d]/10',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${colors[status] || ''}`}>
      {status}
    </span>
  );
}

export function TransactionTable({ initialData, onTransactionChange }) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const { isAdmin } = useAuth();

  // Sync with global source of truth (page.jsx state)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };
// ... rest of event handlers ...
  const handleOpenEdit = (txn) => {
    setEditingTransaction(txn);
    setIsModalOpen(true);
  };

  const handleTransactionAdded = (txn, action) => {
    // Note: page.jsx will handle the source of truth update via onTransactionChange
    if (onTransactionChange) onTransactionChange(txn, action);
  };

  const handleDelete = async (transactionId) => {
    // Immediate destruction protocol - per user request for direct execution
    console.log(`Bypassing confirm: Initiating deletion for ${transactionId}...`);
    try {
      const res = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        console.log(`Deletion successful: ${transactionId}`);
        // Notify parent to update global data (KPIs, Charts)
        if (onTransactionChange) onTransactionChange({ transaction_id: transactionId }, 'delete');
        
        // Also update local state immediately for instant UI response
        setData(prev => prev.filter(txn => txn.transaction_id !== transactionId));
      } else {
        console.error('Delete failed:', result.error);
        alert(`SYSTEM ERROR: Unable to delete record. ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('NETWORK ERROR: Connection to terminal failed. Please check your connectivity.');
    }
  };

  const columns = useMemo(() => {
// ... columns logic ...
    const cols = [
      {
        accessorKey: 'transaction_id',
        header: 'Transaction ID',
        cell: info => <span className="font-mono text-[10px] opacity-70 tracking-tighter">{info.getValue()}</span>,
        size: 160,
      },
      {
        accessorKey: 'timestamp',
        header: 'Date',
        cell: info => <span className="font-mono text-[11px] whitespace-nowrap">{new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>,
        size: 90,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: info => <span className="font-mono font-bold">{formatCurrency(info.getValue())}</span>,
        size: 110,
      },
      {
        accessorKey: 'currency',
        header: 'CCY',
        size: 50,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: info => (
          <span className={`text-[10px] font-black tracking-tighter ${info.getValue() === 'REVENUE' ? 'text-bullish' : 'text-bearish'}`}>
            {info.getValue()}
          </span>
        ),
        size: 70,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => <StatusBadge status={info.getValue()} />,
        size: 90,
      },
      {
        accessorKey: 'merchant_category',
        header: 'Category',
        cell: info => <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">{info.getValue()}</span>,
        size: 120,
      },
      {
        accessorKey: 'counterparty',
        header: 'Counterparty',
        cell: info => <span className="text-[11px] font-semibold tracking-tight">{info.getValue()}</span>,
        size: 140,
      },
      {
        accessorKey: 'compliance_risk_score',
        header: 'Risk',
        cell: info => {
          const score = info.getValue() || 0;
          const color = score > 0.2 ? 'var(--semantic-down)' : score > 0.1 ? 'var(--brand)' : 'var(--semantic-up)';
          return <span style={{ color }} className="font-mono text-[10px] font-black tracking-tighter">{score.toFixed(2)}</span>;
        },
        size: 50,
      },
      {
        accessorKey: 'region',
        header: 'Region',
        size: 90,
      },
    ];

    if (isAdmin) {
      cols.push({
        id: 'actions',
        header: 'Action',
        cell: info => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenEdit(info.row.original)}
              className="text-bullish hover:opacity-70 transition-all p-1"
              title="Edit Transaction"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.transaction_id)}
              className="text-bearish hover:opacity-70 transition-all p-1"
              title="Delete Transaction"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ),
        size: 60,
      });
    }

    return cols;
  }, [isAdmin]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  return (
    <div className="bg-background border border-border-grid rounded-sm overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Header Area - THEME RESPONSIVE STYLING */}
      <div className="p-4 border-b border-border-grid flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-100 dark:bg-zinc-900 relative z-20">
        <div className="space-y-0.5">
          <h3 className="text-[11px] font-black tracking-[0.15em] text-zinc-500 dark:text-zinc-400 uppercase">
             Audit Trail — {table.getFilteredRowModel().rows.length} / {data.length} Records
          </h3>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2">
            Workspace: <span className="text-zinc-900 dark:text-zinc-100 font-bold tracking-tight">Main Ledger</span>
            <span className="opacity-30 text-zinc-300 dark:text-zinc-700">|</span>
            Role: <span className="text-brand font-black tracking-tight">{isAdmin ? 'ADMINISTRATOR' : 'VIEWER'}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Global Search Bar - Theme Adaptive Style */}
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-300 group-focus-within:text-brand transition-colors" size={12} />
            <input 
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="SEARCH LEDGER..."
              className="bg-white/50 dark:bg-black/60 border border-zinc-400 dark:border-zinc-600 pl-9 pr-4 py-2 text-[10px] text-zinc-900 dark:text-zinc-100 w-full sm:w-72 focus:border-brand outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 uppercase font-mono tracking-tight"
            />
          </div>

          {isAdmin && (
            <button 
              onClick={handleOpenAdd}
              className="bg-brand hover:bg-brand/90 text-black text-[10px] font-black px-5 py-2 rounded-sm transition-all flex items-center justify-center gap-2 uppercase tracking-tight shadow-lg active:scale-95"
            >
              <Plus size={12} /> New Entry
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto relative scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur-md shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-border-grid">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="text-[10px] font-black text-gray-400 px-3 py-3 cursor-pointer select-none hover:text-brand transition-colors uppercase tracking-[0.1em]"
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="opacity-40">
                        {{
                          asc: <ChevronUp size={10} />,
                          desc: <ChevronDown size={10} />,
                        }[header.column.getIsSorted()] ?? <div className="w-2.5" />}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border-grid/50">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-brand/5 transition-all group">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 text-foreground/90 border-r border-border-grid/20 last:border-r-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-20 text-center text-gray-600 uppercase tracking-[0.2em] bg-black/5 font-mono text-[10px]">
                   No Financial Records match the current filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - THEME RESPONSIVE */}
      <div className="flex items-center justify-between p-3 border-t border-border-grid text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-widest bg-zinc-100 dark:bg-zinc-900">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            PAGE <span className="text-zinc-900 dark:text-zinc-100 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-sm">{table.getState().pagination.pageIndex + 1}</span> OF {table.getPageCount()}
          </span>
          <span className="hidden md:inline opacity-50 px-3 border-l border-border-grid border-zinc-300 dark:border-zinc-700">
            ENTRIES: <span className="text-zinc-900 dark:text-zinc-100">{table.getRowModel().rows.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 hover:text-brand disabled:opacity-20 transition-all">
            <ChevronsLeft size={14} />
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 hover:text-brand disabled:opacity-20 transition-all">
            <ChevronLeft size={14} />
          </button>
          <div className="w-px h-4 bg-border-grid mx-1 opacity-50" />
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 hover:text-brand disabled:opacity-20 transition-all">
            <ChevronRight size={14} />
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 hover:text-brand disabled:opacity-20 transition-all">
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      <TransactionFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
        initialData={editingTransaction}
      />
    </div>
  );
}
