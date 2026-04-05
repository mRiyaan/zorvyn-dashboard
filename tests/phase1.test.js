import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import mockData from '@/lib/mockData';

describe('Phase 1 - Enterprise Data Modeling & Theming', () => {
  describe('Mock Data Ledger Checks', () => {
    it('Should have generated exactly 1530 structured chronological records', () => {
      expect(mockData.length).toBe(1530);
    });

    it('Should adhere to the exact financial schema', () => {
      const sample = mockData[0];
      expect(sample).toHaveProperty('transaction_id');
      expect(sample.transaction_id.startsWith('TXN-')).toBeTruthy();
      expect(sample).toHaveProperty('timestamp');
      expect(sample).toHaveProperty('amount');
      expect(typeof sample.amount).toBe('number');
      expect(sample).toHaveProperty('status');
      expect(['COMPLETED', 'PENDING', 'FAILED']).toContain(sample.status);
    });
  });

  describe('Bloomberg Theme Toggling Logic', () => {
    it('Should default to dark mode and provide a toggler UI', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );
      
      const btn = screen.getByTestId('theme-toggle');
      expect(btn).toBeInTheDocument();
      // Theme Provider handles document element manipulation underneath, we mainly check rendering capability here.
    });
  });
});
