
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const ExpenseDetailsForm = ({ 
  description, 
  setDescription, 
  amount, 
  setAmount, 
  paidBy, 
  setPaidBy, 
  category, 
  setCategory, 
  participants,
  splitType,
  setSplitType,
  customSplits,
  updateCustomSplit
}) => {
  // Handle split type change
  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    
    // Reset custom splits based on the new split type
    if (value === "equal") {
      const equalShare = (100 / participants.length).toFixed(2);
      const newSplits = participants.map(p => ({
        id: p.id,
        value: equalShare,
      }));
      return newSplits;
    } else {
      return participants.map(p => ({
        id: p.id,
        value: "",
      }));
    }
  };

  return (
    <div className="space-y-4">
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
        <Select 
          value={splitType} 
          onValueChange={(value) => {
            const newSplits = handleSplitTypeChange(value);
            return newSplits;
          }}
        >
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

      {splitType !== "equal" && (
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
    </div>
  );
};

export default ExpenseDetailsForm;