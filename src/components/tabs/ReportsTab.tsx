
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ExpenseCategory } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

const CATEGORY_COLORS: Record<ExpenseCategory | 'all', string> = {
  food: '#4CAF50',
  transport: '#2196F3',
  education: '#9C27B0',
  entertainment: '#FF9800',
  other: '#607D8B',
  all: '#000000'
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

interface ExpenditureByCategory {
  name: string;
  value: number;
  color: string;
}

interface DateRange {
  from: Date;
  to?: Date;
}

const ReportsTab: React.FC = () => {
  const { expenses, getTotalExpensesByCategory } = useExpenses();
  const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Filter expenses based on date range
  const filteredExpenses = useMemo(() => {
    if (!dateRange.from) return expenses;
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = dateRange.from;
      const endDate = dateRange.to || new Date();
      
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }, [expenses, dateRange]);
  
  // Prepare data for expenditure by category
  const expensesByCategory: ExpenditureByCategory[] = useMemo(() => {
    const categories: ExpenseCategory[] = ['food', 'transport', 'education', 'entertainment', 'other'];
    return categories.map((category) => {
      const total = filteredExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: total,
        color: CATEGORY_COLORS[category]
      };
    }).filter(item => item.value > 0);
  }, [filteredExpenses]);
  
  // Prepare data for expenditure over time
  const expensesOverTime = useMemo(() => {
    let timeFormatOptions: Intl.DateTimeFormatOptions;
    let timeSegments: Record<string, number> = {};
    
    switch(timeframe) {
      case 'week':
        timeFormatOptions = { weekday: 'short' };
        break;
      case 'month':
        timeFormatOptions = { day: '2-digit' };
        break;
      case 'year':
      default:
        timeFormatOptions = { month: 'short' };
    }
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const formattedDate = new Intl.DateTimeFormat('en-US', timeFormatOptions).format(date);
      
      if (!timeSegments[formattedDate]) {
        timeSegments[formattedDate] = 0;
      }
      
      timeSegments[formattedDate] += expense.amount;
    });
    
    return Object.entries(timeSegments).map(([date, amount]) => ({
      name: date,
      amount
    }));
  }, [filteredExpenses, timeframe]);
  
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <CardTitle>Expense Reports</CardTitle>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <Label htmlFor="timeframe" className="mb-1 block">Timeframe</Label>
              <Select value={timeframe} onValueChange={(value: 'week' | 'month' | 'year') => setTimeframe(value)}>
                <SelectTrigger id="timeframe" className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <Label className="mb-1 block">Date Range</Label>
              <div className="border rounded-md">
                <DateRangePicker
                  value={[dateRange.from, dateRange.to]}
                  onChange={setDateRange}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenditure by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center mt-2 font-medium">
                  Total Spent: {formatCurrency(totalSpent)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenditure Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
