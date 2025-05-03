
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from '@/contexts/ExpenseContext';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ExpenseCategory } from '@/types';
import { SaveIcon, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const BudgetCard: React.FC<{
  category: ExpenseCategory;
  currentBudget: number;
  spent: number;
  onUpdate: (category: ExpenseCategory, amount: number) => void;
}> = ({ category, currentBudget, spent, onUpdate }) => {
  const [budgetValue, setBudgetValue] = React.useState(currentBudget);
  const percentSpent = Math.min(100, Math.round((spent / currentBudget) * 100));
  const remaining = currentBudget - spent;
  
  const getBudgetStatus = () => {
    if (percentSpent >= 90) return 'text-destructive';
    if (percentSpent >= 75) return 'text-orange-500';
    return 'text-secondary';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="capitalize">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span>{formatCurrency(budgetValue)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Spent</span>
              <span>{formatCurrency(spent)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className={`${getBudgetStatus()}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
            <Progress value={percentSpent} className="h-2 mt-2" />
            <span className="text-xs block mt-1">{percentSpent}% spent</span>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Adjust Budget</span>
              <span>{formatCurrency(budgetValue)}</span>
            </div>
            <Slider 
              defaultValue={[budgetValue]} 
              max={1000} 
              step={50} 
              className="mt-2" 
              onValueChange={(values) => setBudgetValue(values[0])}
            />
            <Button 
              className="w-full mt-4" 
              size="sm"
              onClick={() => onUpdate(category, budgetValue)}
              disabled={budgetValue === currentBudget}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Save Budget
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BudgetTab: React.FC = () => {
  const { budgets, updateBudget, getTotalExpensesByCategory } = useExpenses();
  const { toast } = useToast();
  
  const categories: ExpenseCategory[] = ['food', 'transport', 'education', 'entertainment', 'other'];
  
  // Calculate the total budget
  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  
  // Calculate the total spent
  const totalSpent = getTotalExpensesByCategory('all');
  
  // Calculate the remaining budget
  const remainingBudget = totalBudget - totalSpent;
  
  // Calculate the percentage spent
  const percentageSpent = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Total Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <span className="text-xl font-medium">Total Budget</span>
              <span className="text-xl font-medium">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total Spent</span>
              <span>{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Remaining</span>
              <span className={`${remainingBudget < 0 ? 'text-destructive' : 'text-secondary'}`}>
                {formatCurrency(remainingBudget)}
              </span>
            </div>
            <Progress 
              value={percentageSpent} 
              className="h-3 mt-2" 
              style={{ 
                background: 'linear-gradient(to right, #10B981, #FBBF24, #EF4444)'
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <BudgetCard 
            key={category} 
            category={category} 
            currentBudget={budgets[category]} 
            spent={getTotalExpensesByCategory(category)}
            onUpdate={updateBudget}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetTab;
