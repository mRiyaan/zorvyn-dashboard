import { buildLiquidityData, buildTransactionalHealthData } from '@/lib/granularDataUtils';
import { render, screen } from '@testing-library/react';
import { TransactionalHealth } from '@/components/TransactionalHealth';
import { LiquidityDonut } from '@/components/LiquidityDonut';

describe('Phase 4 & 5 - Granular Tier & Audit Trail', () => {
  const sampleData = [
    { status: 'COMPLETED', type: 'REVENUE', amount: 500000, timestamp: '2025-01-05T00:00:00Z', merchant_category: 'ENTERPRISE_CONTRACT', region: 'US-EAST', compliance_risk_score: 0.02 },
    { status: 'COMPLETED', type: 'EXPENSE', amount: 80000, timestamp: '2025-01-20T00:00:00Z', merchant_category: 'PAYROLL', region: 'US-EAST', compliance_risk_score: 0.01 },
    { status: 'COMPLETED', type: 'REVENUE', amount: 200000, timestamp: '2025-02-15T00:00:00Z', merchant_category: 'SAAS_SUBSCRIPTION', region: 'EU-CENTRAL', compliance_risk_score: 0.05 },
    { status: 'FAILED', type: 'REVENUE', amount: 10000, timestamp: '2025-02-25T00:00:00Z', merchant_category: 'SAAS_SUBSCRIPTION', region: 'APAC', compliance_risk_score: 0.15 },
    { status: 'PENDING', type: 'EXPENSE', amount: 3000, timestamp: '2025-03-01T00:00:00Z', merchant_category: 'MARKETING', region: 'US-WEST', compliance_risk_score: 0.08 },
  ];

  describe('Liquidity Data Utils', () => {
    it('should correctly compute cash position, D/E ratio, and churn', () => {
      const result = buildLiquidityData(sampleData);
      // Revenue (COMPLETED only): 500000 + 200000 = 700000
      // Expenses (COMPLETED only): 80000
      // Cash Position: 620000
      expect(result.metrics.cashPosition).toBe(620000);
      expect(result.metrics.debtToEquity).toBeGreaterThan(0);
      // 1 failed out of 3 revenue = 33.3%
      expect(result.metrics.churnRate).toBe(33.3);
    });

    it('should handle null/undefined data gracefully', () => {
      expect(buildLiquidityData(null)).toEqual([]);
      expect(buildLiquidityData(undefined)).toEqual([]);
    });
  });

  describe('Transactional Health Utils', () => {
    it('should group transaction counts by region and status', () => {
      const result = buildTransactionalHealthData(sampleData);
      expect(result.length).toBe(4); // 4 regions

      const usEast = result.find(r => r.region === 'US-EAST');
      expect(usEast.COMPLETED).toBe(2);
      expect(usEast.successRate).toBe(100);

      const apac = result.find(r => r.region === 'APAC');
      expect(apac.FAILED).toBe(1);
    });
  });

  describe('Component Rendering', () => {
    it('LiquidityDonut renders metrics when given valid data', () => {
      const liquidityData = buildLiquidityData(sampleData);
      render(<LiquidityDonut liquidityData={liquidityData} />);
      expect(screen.getByText(/Liquidity/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Cash Position/i).length).toBeGreaterThan(0);
    });

    it('TransactionalHealth renders region bars', () => {
      const healthData = buildTransactionalHealthData(sampleData);
      render(<TransactionalHealth data={healthData} />);
      expect(screen.getByText(/Transactional Health/i)).toBeInTheDocument();
    });
  });
});
