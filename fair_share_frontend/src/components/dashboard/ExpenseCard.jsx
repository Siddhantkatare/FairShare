import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import {
  UtensilsCrossed,
  Plane,
  Home,
  ShoppingCart,
  Coffee,
  FileText,
  Tv,
  Briefcase,
  Phone,
  Wallet,
  CreditCard,
  DollarSign,
  BookOpen,
  UserPlus,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ExpenseCard = ({ expense, index, onSave }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedExpense, setEditedExpense] = useState({
    ...expense,
    participants: [...expense.participants],
    date: format(new Date(expense.date), "yyyy-MM-dd")
  });

  const getCategoryIcon = () => {
    switch (expense.category) {
      case "Food":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "Travel":
        return <Plane className="h-4 w-4" />;
      case "Rent":
        return <Home className="h-4 w-4" />;
      case "Shopping":
        return <ShoppingCart className="h-4 w-4" />;
      case "Other":
        return <Coffee className="h-4 w-4" />;
      case "Utilities":
        return <FileText className="h-4 w-4" />;
      case "Entertainment":
        return <Tv className="h-4 w-4" />;
      case "Business":
        return <Briefcase className="h-4 w-4" />;
      case "Recharge":
        return <Phone className="h-4 w-4" />;
      case "Billing":
        return <Wallet className="h-4 w-4" />;
      case "Subscription":
        return <CreditCard className="h-4 w-4" />;
      case "Fee":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSplitTypeLabel = () => {
    switch (expense.splitType) {
      case "Equal":
        return "Split equally";
      case "Percentage":
        return "Split by percentage";
      case "Manual":
        return "Split by manual amount";
      default:
        return "Unknown split type";
    }
  };

  const handleInputChange = (field, value) => {
    setEditedExpense(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParticipantChange = (index, field, value) => {
    setEditedExpense(prev => {
      const updatedParticipants = [...prev.participants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: field === 'share' ? Number(value) : value
      };
      return {
        ...prev,
        participants: updatedParticipants
      };
    });
  };

  const handleSplitTypeChange = (value) => {
    setEditedExpense(prev => {
      let updatedParticipants = [...prev.participants];
      
      if (value === "Equal") {
        const equalShare = prev.amount / prev.participants.length;
        updatedParticipants = updatedParticipants.map(p => ({
          ...p,
          share: equalShare
        }));
      }
      
      return {
        ...prev,
        splitType: value,
        participants: updatedParticipants
      };
    });
  };

  const handleSave = () => {
    // Format the date back to ISO string before saving
    const expenseToSave = {
      ...editedExpense,
      date: new Date(editedExpense.date).toISOString()
    };
    onSave(expenseToSave);
    setIsEditModalOpen(false);
  };

  return (
    <>
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
                {format(new Date(expense.date), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-lg">
                {formatCurrency(expense.amount)}
              </span>
              <div className="flex items-center mt-1 gap-2">
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {getCategoryIcon()}
                  <span className="capitalize">{expense.category}</span>
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-6 px-2 text-xs"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>
                <span className="font-medium text-foreground">{expense.paidBy.email}</span> paid
              </span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <UserPlus className="h-4 w-4 mr-1" />
              <span>
                {getSplitTypeLabel()} between {expense.participants.length} people
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              {expense.participants.map((participant) => (
                <div 
                  key={participant.email} 
                  className="flex justify-between items-center"
                >
                  <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm max-w-[60%] truncate">
                    {participant.email}
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-full text-sm font-medium">
                    {formatCurrency(participant.share)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edit Expense</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={editedExpense.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={editedExpense.amount}
                      onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editedExpense.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Recharge">Recharge</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Fee">Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editedExpense.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="splitType">Split Type</Label>
                    <Select
                      value={editedExpense.splitType}
                      onValueChange={handleSplitTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select split type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equal">Equal</SelectItem>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Participants</h4>
                    <div className="space-y-3">
                      {editedExpense.participants.map((participant, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`email-${index}`}>Email</Label>
                            <Input
                              id={`email-${index}`}
                              value={participant.email}
                              onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`share-${index}`}>Amount</Label>
                            <Input
                              id={`share-${index}`}
                              type="number"
                              value={participant.share}
                              onChange={(e) => handleParticipantChange(index, 'share', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </>
  );
};