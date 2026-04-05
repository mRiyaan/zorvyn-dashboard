import { groupDataByMonth, buildWaterfallData } from '@/lib/chartDataUtils';

describe('Phase 3 - Analytical Charting Utils', () => {
  const sampleData = [
    { status: 'COMPLETED', type: 'REVENUE', amount: 300, timestamp: '2025-01-05T00:00:00Z', merchant_category: 'SAAS_SUBSCRIPTION' },
    { status: 'COMPLETED', type: 'EXPENSE', amount: 100, timestamp: '2025-01-20T00:00:00Z', merchant_category: 'PAYROLL' },
    { status: 'COMPLETED', type: 'REVENUE', amount: 500, timestamp: '2025-02-15T00:00:00Z', merchant_category: 'ENTERPRISE_CONTRACT' },
    { status: 'COMPLETED', type: 'EXPENSE', amount: 200, timestamp: '2025-02-25T00:00:00Z', merchant_category: 'PAYROLL' },
    { status: 'COMPLETED', type: 'EXPENSE', amount: 50,  timestamp: '2025-02-26T00:00:00Z', merchant_category: 'MARKETING' },
  ];

  it('groupDataByMonth correctly aggregates by chronologically ordered buckets', () => {
    const grouped = groupDataByMonth(sampleData);
    expect(grouped.length).toBe(2);
    expect(grouped[0].month).toMatch(/Jan/i);
    expect(grouped[0].revenue).toBe(300);
    expect(grouped[0].expenses).toBe(100);

    expect(grouped[1].month).toMatch(/Feb/i);
    expect(grouped[1].revenue).toBe(500);
    expect(grouped[1].expenses).toBe(250);
  });

  it('buildWaterfallData structures the base/change metric dynamically mapping descending expenses', () => {
    const waterfall = buildWaterfallData(sampleData);
    // PAYROLL total: 300
    // MARKETING total: 50
    // Total OPEX: 350
    // Should be length 3 (Payroll, Marketing, Total)
    expect(waterfall.length).toBe(3);
    
    const maxBar = waterfall[0]; 
    expect(maxBar.name).toEqual('PAYROLL');
    expect(maxBar.base).toBe(0);
    expect(maxBar.change).toBe(300);

    const midBar = waterfall[1];
    expect(midBar.name).toEqual('MARKETING');
    expect(midBar.base).toBe(300); // Because payroll added 300
    expect(midBar.change).toBe(50);
  });
});
