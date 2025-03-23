import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const SplitAmount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, addExpense } = useAppContext();
  
  const group = groups.find(g => g.id === id);
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState([]);
  
  // Generate participants from group members
  const participants = group?.memberList.map((email, index) => ({
    id: `member-${index}`,
    name: email.split('@')[0], // Simple name extraction from email
    email
  })) || [];
  
  // Initialize custom splits when split type changes
  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    
    if (value === "equal") {
      const equalShare = (100 / participants.length).toFixed(2);
      setCustomSplits(
        participants.map(p => ({
          id: p.id,
          value: equalShare,
        }))
      );
    } else {
      setCustomSplits(
        participants.map(p => ({
          id: p.id,
          value: "",
        }))
      );
    }
  };
  
  // Update custom split
  const updateCustomSplit = (id, value) => {
    setCustomSplits(
      customSplits.map(split => 
        split.id === id ? { ...split, value } : split
      )
    );
  };
  
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!description || !amount || !paidBy || !category) {
      toast.error("Please fill in all expense details");
      return;
    }

    // For percentage or exact split types, validate the custom splits
    if (splitType !== "equal") {
      const hasEmptySplits = customSplits.some(split => !split.value);
      if (hasEmptySplits) {
        toast.error("Please fill in all split values");
        return;
      }
      
      if (splitType === "percentage") {
        const totalPercentage = customSplits.reduce(
          (sum, split) => sum + Number(split.value), 
          0
        );
        if (Math.abs(totalPercentage - 100) > 0.01) {
          toast.error("Percentages must add up to 100%");
          return;
        }
      } else if (splitType === "exact") {
        const totalAmount = customSplits.reduce(
          (sum, split) => sum + Number(split.value), 
          0
        );
        if (Math.abs(totalAmount - parseFloat(amount)) > 0.01) {
          toast.error(`Amounts must add up to ${amount}`);
          return;
        }
      }
    }
    
    // Get the payer name
    const payer = participants.find(p => p.id === paidBy);
    if (!payer) {
      toast.error("Please select who paid for the expense");
      return;
    }
    
    // Calculate participant shares
    let participantShares = [];
    
    if (splitType === "equal") {
      const splitAmount = parseFloat(amount) / participants.length;
      participantShares = participants.map(p => ({
        name: p.name,
        amount: splitAmount
      }));
    } else {
      participantShares = participants.map(p => {
        const split = customSplits.find(s => s.id === p.id);
        let splitAmount = 0;
        
        if (split) {
          if (splitType === "percentage") {
            splitAmount = (parseFloat(amount) * parseFloat(split.value)) / 100;
          } else { // exact
            splitAmount = parseFloat(split.value);
          }
        }
        
        return {
          name: p.name,
          amount: splitAmount
        };
      });
    }
    
    // Create expense object
    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date(),
      category,
      paidBy: payer.name,
      splitType,
      participants: participantShares,
      groupId: id
    };
    
    // Add expense to context
    addExpense(newExpense);
    
    // Update group total expenses
    // Note: In a real app, you'd update the group's total expenses here
    
    // Submit and navigate back to group detail
    toast.success("Expense added and split successfully!");
    navigate(`/groups/${id}`);
  };
  
  if (!group) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Group Not Found</h2>
          <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/groups")}>
            Back to Groups
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(`/groups/${id}`)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Split Amount</h1>
            <p className="text-muted-foreground text-sm">
              Add a new expense for {group.name}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Dinner at restaurant"
                className="focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid by</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paidBy" className="focus-ring">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="focus-ring">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="splitType">Split type</Label>
              <Select value={splitType} onValueChange={handleSplitTypeChange}>
                <SelectTrigger id="splitType" className="focus-ring">
                  <SelectValue placeholder="Select split type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="exact">Exact amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <AnimatePresence>
              {splitType !== "equal" && customSplits.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 mt-4 pt-4 border-t"
                >
                  <h3 className="font-medium">
                    {splitType === "percentage" ? "Percentage split" : "Exact amount split"}
                  </h3>
                  {participants.map((participant) => {
                    const splitValue = customSplits.find(s => s.id === participant.id)?.value || "";
                    return (
                      <div key={participant.id} className="flex items-center justify-between">
                        <Label htmlFor={`split-${participant.id}`} className="min-w-[100px]">
                          {participant.name}
                        </Label>
                        <div className="flex items-center flex-1 max-w-[200px]">
                          <Input
                            id={`split-${participant.id}`}
                            type="number"
                            value={splitValue}
                            onChange={(e) => updateCustomSplit(participant.id, e.target.value)}
                            placeholder={splitType === "percentage" ? "0%" : "0.00"}
                            step={splitType === "percentage" ? "1" : "0.01"}
                            min="0"
                            className="focus-ring"
                          />
                          {splitType === "percentage" && (
                            <span className="ml-2 text-sm">%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          
          <Button type="submit" className="w-full">
            Split Amount
          </Button>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default SplitAmount;
