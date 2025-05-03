
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { DateRangePicker } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ExpenseCategory } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#4CAF50',
  transport: '#2196F3',
  education: '#9C27B0',
  entertainment: '#FF9800',
  other: '#607D8B'
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Group expenses by date and calculate total per day
const groupExpensesByDate = (expenses: any[]) => {
  const grouped = expenses.reduce((acc, expense) => {
    const date = formatDate(expense.date);
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += expense.amount;
    return acc;
  }, {});
  
  // Convert to array format for charts
  return Object.keys(grouped).map(date => ({
    date,
    amount: grouped[date]
  })).sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};

// Group expenses by category
const groupExpensesByCategory = (expenses: any[]) => {
  const grouped = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});
  
  // Convert to array format for charts
  return Object.keys(grouped).map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: grouped[category]
  }));
};

const ReportsTab: React.FC = () => {
  const { expenses, getExpensesByCategory, getExpensesByDateRange } = useExpenses();

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([oneMonthAgo, today]);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Filter expenses based on date range
  const filteredExpenses = dateRange[0] && dateRange[1] 
    ? expenses.filter(expense => {
        const expDate = new Date(expense.date);
        return expDate >= dateRange[0]! && expDate <= dateRange[1]!;
      })
    : expenses;

  // Calculate report data
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDailySpend = filteredExpenses.length > 0 ? 
    totalSpent / (dateRange[0] && dateRange[1] ? 
      Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24)) : 30) : 0;
  
  // Prepare data for charts
  const barChartData = groupExpensesByDate(filteredExpenses);
  const pieChartData = groupExpensesByCategory(filteredExpenses);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <DateRangePicker
          value={dateRange} 
          onChange={(range) => setDateRange([range?.from, range?.to])}
          calendarTodayClassName="bg-primary text-primary-foreground"
        />
        
        <Select 
          value={chartType} 
          onValueChange={(value) => setChartType(value as 'bar' | 'pie')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(avgDailySpend)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredExpenses.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Analysis</CardTitle>
          <CardDescription>
            {dateRange[0] && dateRange[1] ? (
              `Data from ${dateRange[0].toLocaleDateString()} to ${dateRange[1].toLocaleDateString()}`
            ) : 'All data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`} 
                    width={60}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="amount" name="Spending" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
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
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Object.keys(CATEGORY_COLORS) as ExpenseCategory[]).map(category => {
              const categoryExpenses = filteredExpenses.filter(e => e.category === category);
              const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
              const percentage = totalSpent ? Math.round((categoryTotal / totalSpent) * 100) : 0;
              
              return (
                <div key={category}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: CATEGORY_COLORS[category] }}
                      ></div>
                      <span className="capitalize">{category}</span>
                    </div>
                    <div className="text-right">
                      <div>{formatCurrency(categoryTotal)}</div>
                      <div className="text-xs text-muted-foreground">{percentage}% of total</div>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-1 mt-1 mb-3" 
                    style={{ backgroundColor: `${CATEGORY_COLORS[category]}40` }}
                    indicatorColor={CATEGORY_COLORS[category]}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
