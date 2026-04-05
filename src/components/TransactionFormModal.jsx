'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function TransactionFormModal({ isOpen, onClose, onTransactionAdded, initialData = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    type: 'EXPENSE',
    status: 'COMPLETED',
    merchant_category: 'INFRASTRUCTURE',
    counterparty: '',
    region: 'US-EAST',
    compliance_risk_score: 0.1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.amount.toString()
      });
    } else {
      // Reset form for new transaction
      setFormData({
        amount: '',
        currency: 'USD',
        type: 'EXPENSE',
        status: 'COMPLETED',
        merchant_category: 'INFRASTRUCTURE',
        counterparty: '',
        region: 'US-EAST',
        compliance_risk_score: 0.1
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const transactionData = {
      ...formData,
      transaction_id: isEdit ? initialData.transaction_id : `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: isEdit ? initialData.timestamp : new Date().toISOString(),
      amount: parseFloat(formData.amount),
      compliance_risk_score: parseFloat(formData.compliance_risk_score)
    };

    try {
      const response = await fetch('/api/transactions', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'add'} transaction`);

      onTransactionAdded(transactionData, isEdit ? 'edit' : 'add');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-border-grid w-full max-w-lg rounded-sm shadow-2xl relative">
        <div className="p-4 border-b border-border-grid flex justify-between items-center">
          <h2 className="text-brand font-bold tracking-tight uppercase">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="hover:text-brand transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-bearish/10 border border-bearish text-bearish text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Counterparty</label>
              <input
                required
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                placeholder="e.g. AWS Cloud Services"
                value={formData.counterparty}
                onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Amount</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Type</label>
              <select
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="REVENUE">REVENUE</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">CCY</label>
              <select
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Category</label>
              <select
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.merchant_category}
                onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value })}
              >
                <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                <option value="SAAS">SAAS</option>
                <option value="PAYROLL">PAYROLL</option>
                <option value="MARKETING">MARKETING</option>
                <option value="ENTERPRISE_CONTRACT">ENTERPRISE CONTRACT</option>
                <option value="SUBSCRIPTION_RENEWAL">SUBSCRIPTION RENEWAL</option>
                <option value="CONSULTING_FEES">CONSULTING FEES</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Region</label>
              <select
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                <option value="US-EAST">US-EAST</option>
                <option value="US-WEST">US-WEST</option>
                <option value="EU-CENTRAL">EU-CENTRAL</option>
                <option value="APAC">APAC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Status</label>
              <select
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="COMPLETED">COMPLETED</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Risk Score (0.0 - 1.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                className="w-full bg-black/20 border border-border-grid p-2 text-sm focus:border-brand outline-none"
                value={formData.compliance_risk_score}
                onChange={(e) => setFormData({ ...formData, compliance_risk_score: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand hover:bg-brand/90 text-black font-bold py-2 rounded-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>{isEdit ? 'UPDATE TRANSACTION' : 'EXECUTE TRANSACTION'}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border-grid hover:bg-white/5 py-2 transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
