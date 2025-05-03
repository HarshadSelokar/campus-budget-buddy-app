import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseCategory } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from "@/components/ui/progress";

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#4CAF50',
  transport: '#2196F3',
  education: '#9C27B0',
  entertainment: '#FF9800',
  other: '#607D8B'
};

const ReportsTab: React.FC = () => {
  const { expenses } = useExpenses();

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category
  const categoryData = Object.values(ExpenseCategory).map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;

    return {
      name: category,
      value: categoryTotal,
      percentage: percentage.toFixed(1),
      color: CATEGORY_COLORS[category]
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Expense Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {totalExpenses === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No expenses recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryData.map(category => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="capitalize">{category.name}</span>
                <span className="text-muted-foreground">
                  {category.percentage}%
                </span>
              </div>
              <Progress value={Number(category.percentage)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
