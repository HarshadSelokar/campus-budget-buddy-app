
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <ExpenseProvider>
      <div className="max-w-screen">
        <AppLayout />
      </div>
      <Toaster />
    </ExpenseProvider>
  );
};

export default Index;
