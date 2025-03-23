import { ExpenseCard } from "./ExpenseCard";
import { Button } from "@/components/ui/button";
import { PlusIcon, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

export const ExpensesOverview = () => {
  const navigate = useNavigate();
  const { expenses } = useAppContext();
  
  const handleAddExpense = () => {
    navigate("/add-expense");
  };
  
  const handleSettle = () => {
    navigate("/settle");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recent Expenses</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleSettle} 
            variant="outline"
            className="gap-1"
          >
            <Wallet className="h-4 w-4" />
            Settle
          </Button>
          <Button onClick={handleAddExpense} className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.map((expense, index) => (
            <ExpenseCard key={expense.id} expense={expense} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-background">
          <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by adding your first expense
          </p>
          <Button onClick={handleAddExpense} variant="outline" className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      )}
    </div>
  );
};
