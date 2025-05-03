
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, ExpenseCategory, Budget } from '@/types';
import { useToast } from '@/hooks/use-toast';

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  budgets: Record<ExpenseCategory, number>;
  updateBudget: (category: ExpenseCategory, amount: number) => void;
  getExpensesByCategory: (category: ExpenseCategory | 'all') => Expense[];
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
  getTotalExpensesByCategory: (category: ExpenseCategory | 'all') => number;
  getBudgetRemaining: (category: ExpenseCategory | 'all') => number;
};

const defaultBudgets: Record<ExpenseCategory, number> = {
  food: 300,
  transport: 150,
  education: 200,
  entertainment: 100,
  other: 100
};

// Helper to load data from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  return JSON.parse(saved) as T;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => 
    loadFromStorage('expenses', [])
  );
  
  const [budgets, setBudgets] = useState<Record<ExpenseCategory, number>>(() => 
    loadFromStorage('budgets', defaultBudgets)
  );
  
  const { toast } = useToast();

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID()
    };
    setExpenses(prev => [...prev, newExpense]);
    toast({
      title: "Expense added",
      description: `$${expense.amount} added for ${expense.category}`,
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Expense deleted",
    });
  };

  const updateBudget = (category: ExpenseCategory, amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
    toast({
      title: "Budget updated",
      description: `${category} budget set to $${amount}`,
    });
  };

  const getExpensesByCategory = (category: ExpenseCategory | 'all') => {
    if (category === 'all') return expenses;
    return expenses.filter(expense => expense.category === category);
  };

  const getExpensesByDateRange = (startDate: string, endDate: string) => {
    return expenses.filter(expense => {
      const date = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  };

  const getTotalExpensesByCategory = (category: ExpenseCategory | 'all') => {
    const filteredExpenses = getExpensesByCategory(category);
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getBudgetRemaining = (category: ExpenseCategory | 'all') => {
    if (category === 'all') {
      const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
      const totalExpenses = getTotalExpensesByCategory('all');
      return totalBudget - totalExpenses;
    }
    
    return budgets[category] - getTotalExpensesByCategory(category);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      deleteExpense,
      budgets,
      updateBudget,
      getExpensesByCategory,
      getExpensesByDateRange,
      getTotalExpensesByCategory,
      getBudgetRemaining
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const useMockedExpenses = () => {
  const { addExpense } = useExpenses();

  const generateMockData = () => {
    const categories: ExpenseCategory[] = ['food', 'transport', 'education', 'entertainment', 'other'];
    const paymentMethods: PaymentMethod[] = ['cash', 'credit', 'debit', 'online', 'other'];
    
    // Generate expenses for the last 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // 1-3 expenses per day
      const numExpenses = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numExpenses; j++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = Math.floor(Math.random() * 50) + 5; // $5-$55
        
        addExpense({
          amount,
          category,
          date: date.toISOString().split('T')[0],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          notes: `Mock expense ${j+1} for ${date.toLocaleDateString()}`
        });
      }
    }
  };

  return { generateMockData };
};
