
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptUrl?: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'education'
  | 'entertainment'
  | 'other';

export type PaymentMethod = 
  | 'cash'
  | 'credit'
  | 'debit'
  | 'online'
  | 'other';

export interface Budget {
  category: ExpenseCategory;
  amount: number;
}
