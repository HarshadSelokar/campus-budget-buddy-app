
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseCategory } from '@/types';
import { toast } from 'sonner';

interface BudgetMap {
  [key: string]: number;
}

interface ExpenseContextProps {
  expenses: Expense[];
  budgets: BudgetMap;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category: ExpenseCategory | 'all') => Expense[];
  getTotalExpensesByCategory: (category: ExpenseCategory | 'all') => number;
  getBudgetRemaining: (category: ExpenseCategory | 'all') => number;
  updateBudget: (category: ExpenseCategory, amount: number) => void;
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

// Default budget values for each category
const DEFAULT_BUDGETS: BudgetMap = {
  food: 300,
  transport: 150,
  education: 200,
  entertainment: 100,
  other: 50
};

interface ExpenseProviderProps {
  children: React.ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Retrieve expenses from local storage on component mount
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const [budgets, setBudgets] = useState<BudgetMap>(() => {
    // Retrieve budgets from local storage on component mount
    const storedBudgets = localStorage.getItem('budgets');
    return storedBudgets ? JSON.parse(storedBudgets) : DEFAULT_BUDGETS;
  });

  // Save expenses to local storage whenever the expenses state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save budgets to local storage whenever the budgets state changes
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: uuidv4() };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    toast.success('Expense added successfully!');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    toast.success('Expense deleted successfully!');
  };

  const getExpensesByCategory = (category: ExpenseCategory | 'all'): Expense[] => {
    if (category === 'all') return expenses;
    return expenses.filter(expense => expense.category === category);
  };

  const getTotalExpensesByCategory = (category: ExpenseCategory | 'all'): number => {
    const filteredExpenses = category === 'all' 
      ? expenses 
      : expenses.filter(expense => expense.category === category);
    
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getBudgetRemaining = (category: ExpenseCategory | 'all'): number => {
    if (category === 'all') {
      const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
      const totalSpent = getTotalExpensesByCategory('all');
      return totalBudget - totalSpent;
    }
    
    return budgets[category] - getTotalExpensesByCategory(category);
  };

  const updateBudget = (category: ExpenseCategory, amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
    toast.success(`${category} budget updated to $${amount}`);
  };

  const value: ExpenseContextProps = {
    expenses,
    budgets,
    addExpense,
    deleteExpense,
    getExpensesByCategory,
    getTotalExpensesByCategory,
    getBudgetRemaining,
    updateBudget,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

// Fix the PaymentMethod reference in function
export const useMockedExpenses = () => {
  const { addExpense } = useExpenses();
  
  const generateMockData = () => {
    // Sample payment methods
    const paymentMethods = ['cash', 'credit card', 'debit card', 'mobile payment'];
    
    const categories: ExpenseCategory[] = ['food', 'transport', 'education', 'entertainment', 'other'];

    const generateRandomAmount = () => parseFloat((Math.random() * 100).toFixed(2));

    const generateRandomDate = () => {
      const start = new Date(2023, 0, 1); // January 1, 2023
      const end = new Date(); // Today's date
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    for (let i = 0; i < 25; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      const mockExpense: Omit<Expense, 'id'> = {
        amount: generateRandomAmount(),
        category: randomCategory,
        date: generateRandomDate().toISOString(),
        notes: `Mock expense ${i + 1} in ${randomCategory}`,
        paymentMethod: randomPaymentMethod as PaymentMethod,
      };
      addExpense(mockExpense);
    }
  };
  
  return { generateMockData };
};
