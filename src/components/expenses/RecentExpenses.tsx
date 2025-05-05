
import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseCategory } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#4CAF50',
  transport: '#2196F3',
  education: '#9C27B0',
  entertainment: '#FF9800',
  other: '#607D8B'
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

interface RecentExpensesProps {
  limit?: number;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ limit = 5 }) => {
  const { expenses } = useExpenses();
  
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
    
  if (sortedExpenses.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No recent expenses
      </div>
    );
  }
  
  return (
    <ScrollArea className="max-h-[300px] pr-4 overflow-y-auto">
      <div className="space-y-2">
        {sortedExpenses.map(expense => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
              >
                <span className="uppercase font-bold text-sm">
                  {expense.category.slice(0, 1)}
                </span>
              </div>
              <div>
                <h4 className="font-medium capitalize">{expense.category}</h4>
                <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
              </div>
            </div>
            <span className="font-semibold">{formatCurrency(expense.amount)}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentExpenses;
