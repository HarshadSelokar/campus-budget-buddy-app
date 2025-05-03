
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RecentExpenses from '@/components/expenses/RecentExpenses';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#4CAF50',
  transport: '#2196F3',
  education: '#9C27B0',
  entertainment: '#FF9800',
  other: '#607D8B'
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const DashboardTab: React.FC = () => {
  const { 
    getTotalExpensesByCategory, 
    getBudgetRemaining, 
    getExpensesByCategory, 
    budgets 
  } = useExpenses();
  
  // Calculate the total budget
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  
  // Calculate the total spent
  const totalSpent = getTotalExpensesByCategory('all');
  
  // Calculate the remaining budget
  const remainingBudget = getBudgetRemaining('all');
  
  // Calculate the percentage spent
  const percentageSpent = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  // Prepare data for pie chart
  const categoryData = (Object.keys(budgets) as ExpenseCategory[]).map(category => {
    const spent = getTotalExpensesByCategory(category);
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: spent
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Monthly Overview</CardTitle>
            <CardDescription>Your budget status for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <span className="font-medium">{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className={`font-medium ${remainingBudget < 0 ? 'text-destructive' : ''}`}>
                    {formatCurrency(remainingBudget)}
                  </span>
                </div>
                <Progress value={percentageSpent} className="h-2 mt-4" />
                <div className="flex justify-between text-xs mt-1">
                  <span>{percentageSpent}% spent</span>
                  <span>{100 - percentageSpent}% remaining</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense to track your spending
                  </DialogDescription>
                </DialogHeader>
                <ExpenseForm />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Spending by Category</CardTitle>
            <CardDescription>How your money was spent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name.toLowerCase() as ExpenseCategory]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentExpenses limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
