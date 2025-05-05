
import React from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    weekday: 'short',
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

interface ExpensesListProps {
  expenses: Expense[];
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses }) => {
  const { deleteExpense } = useExpenses();

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses found
      </div>
    );
  }

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScrollArea className="h-[550px] pr-4">
      <div className="space-y-4">
        {sortedExpenses.map(expense => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:bg-accent/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              {/* <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white" 
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
              >
                <span className="uppercase font-bold">
                  {expense.category.slice(0, 1)}
                </span>
              </div> */}
              <div>
                <h3 className="font-medium text-foreground capitalize">{expense.category}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(expense.date)} • {expense.paymentMethod}
                </p>
                {expense.notes && (
                  <p className="text-sm text-muted-foreground max-w-md truncate">
                    {expense.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{formatCurrency(expense.amount)}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this expense record. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteExpense(expense.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ExpensesList;
