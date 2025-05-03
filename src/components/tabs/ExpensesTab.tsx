
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpensesList from '@/components/expenses/ExpensesList';
import { ExpenseCategory } from '@/types';
import { DateRangePicker } from '@/components/ui/calendar';

const ExpensesTab: React.FC = () => {
  const { expenses, getExpensesByCategory } = useExpenses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  
  // Filter expenses based on search term, category, and date range
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.includes(searchTerm.toLowerCase()) ||
                          expense.paymentMethod.includes(searchTerm.toLowerCase());
                          
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    
    const matchesDateRange = (!dateRange[0] || !dateRange[1]) || 
                             (new Date(expense.date) >= dateRange[0] && 
                              new Date(expense.date) <= dateRange[1]);
    
    return matchesSearch && matchesCategory && matchesDateRange;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={selectedCategory} 
          onValueChange={(value) => setSelectedCategory(value as ExpenseCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <DateRangePicker 
          value={dateRange} 
          onChange={(range) => setDateRange([range?.from, range?.to])} 
          calendarTodayClassName="bg-primary text-primary-foreground"
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesList expenses={filteredExpenses} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTab;
