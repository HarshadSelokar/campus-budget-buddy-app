
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ExpenseProvider } from '@/contexts/ExpenseContext';

const Index = () => {
  return (
    <ExpenseProvider>
      <AppLayout />
    </ExpenseProvider>
  );
};

export default Index;
