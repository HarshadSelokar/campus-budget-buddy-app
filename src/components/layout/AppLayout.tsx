
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from '@/components/tabs/DashboardTab';
import ExpensesTab from '@/components/tabs/ExpensesTab';
import BudgetTab from '@/components/tabs/BudgetTab';
import ReportsTab from '@/components/tabs/ReportsTab';
import { useExpenses, useMockedExpenses } from '@/contexts/ExpenseContext';

const AppLayout: React.FC = () => {
  const { expenses } = useExpenses();
  const { generateMockData } = useMockedExpenses();

  // Generate mock data if there are no expenses
  React.useEffect(() => {
    if (expenses.length === 0) {
      generateMockData();
    }
  }, [expenses.length, generateMockData]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-16">
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Campus Budget Buddy</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="sticky top-[65px] z-10 bg-background pb-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpensesTab />
          </TabsContent>
          
          <TabsContent value="budget">
            <BudgetTab />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AppLayout;
