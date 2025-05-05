
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from '@/components/tabs/DashboardTab';
import ExpensesTab from '@/components/tabs/ExpensesTab';
import BudgetTab from '@/components/tabs/BudgetTab';
import ReportsTab from '@/components/tabs/ReportsTab';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const { expenses } = useExpenses();
  const isMobile = useIsMobile();

  // Generate mock data if there are no expenses
  React.useEffect(() => {
    
  }, [expenses.length]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-16">
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-primary">Campus Budget Buddy</h1>
        </div>
      </header>

      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="sticky top-[57px] z-10 bg-background pb-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className={isMobile ? "text-xs px-1" : ""}>Dashboard</TabsTrigger>
              <TabsTrigger value="expenses" className={isMobile ? "text-xs px-1" : ""}>Expenses</TabsTrigger>
              <TabsTrigger value="budget" className={isMobile ? "text-xs px-1" : ""}>Budget</TabsTrigger>
              <TabsTrigger value="reports" className={isMobile ? "text-xs px-1" : ""}>Reports</TabsTrigger>
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
