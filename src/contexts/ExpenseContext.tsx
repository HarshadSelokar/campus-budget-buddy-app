import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types';
import { toast } from 'sonner';

interface ExpenseContextProps {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

interface ExpenseProviderProps {
  children: React.ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Retrieve expenses from local storage on component mount
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  // Save expenses to local storage whenever the expenses state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: uuidv4() };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    toast.success('Expense added successfully!');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    toast.success('Expense deleted successfully!');
  };

  const getExpensesByCategory = (category: ExpenseCategory): Expense[] => {
    return expenses.filter(expense => expense.category === category);
  };

  const value: ExpenseContextProps = {
    expenses,
    addExpense,
    deleteExpense,
    getExpensesByCategory,
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
