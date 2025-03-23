import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UtensilsCrossed, Plane, Home, ShoppingCart, Coffee, UserPlus, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

export const ExpenseCard = ({ expense, index }) => {
  const getCategoryIcon = () => {
    switch (expense.category) {
      case "food":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "travel":
        return <Plane className="h-4 w-4" />;
      case "rent":
        return <Home className="h-4 w-4" />;
      case "shopping":
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  const getSplitTypeLabel = () => {
    switch (expense.splitType) {
      case "equal":
        return "Split equally";
      case "percentage":
        return "Split by percentage";
      case "exact":
        return "Split by exact amount";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="p-5 hover:shadow-md transition-shadow duration-300 border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{expense.description}</h3>
            <p className="text-sm text-muted-foreground">
              {format(expense.date, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-lg">
              {formatCurrency(expense.amount)}
            </span>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                {getCategoryIcon()}
                <span className="capitalize">{expense.category}</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>
              <span className="font-medium text-foreground">{expense.paidBy}</span> paid
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <UserPlus className="h-4 w-4 mr-1" />
            <span>
              {getSplitTypeLabel()} between {expense.participants.length} people
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            {expense.participants.map((participant) => (
              <div key={participant.name} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{participant.name}</span>
                <span className="font-medium">{formatCurrency(participant.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
