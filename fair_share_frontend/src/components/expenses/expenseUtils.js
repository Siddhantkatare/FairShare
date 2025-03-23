
import { toast } from "sonner";

// Validate first step (participants)
export const validateParticipants = (participants) => {
  const hasEmptyFields = participants.some(p => !p.name || !p.email);
  if (hasEmptyFields) {
    toast.error("Please fill in all participant details");
    return false;
  }
  return true;
};

// Validate expense details and splits
export const validateExpenseDetails = (description, amount, paidBy, category, splitType, customSplits) => {
  // Validate basic details
  if (!description || !amount || !paidBy || !category) {
    toast.error("Please fill in all expense details");
    return false;
  }

  // For percentage or exact split types, validate the custom splits
  if (splitType !== "equal") {
    const hasEmptySplits = customSplits.some(split => !split.value);
    if (hasEmptySplits) {
      toast.error("Please fill in all split values");
      return false;
    }
    
    if (splitType === "percentage") {
      const totalPercentage = customSplits.reduce(
        (sum, split) => sum + Number(split.value), 
        0
      );
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Percentages must add up to 100%");
        return false;
      }
    } else if (splitType === "exact") {
      const totalAmount = customSplits.reduce(
        (sum, split) => sum + Number(split.value), 
        0
      );
      if (Math.abs(totalAmount - parseFloat(amount)) > 0.01) {
        toast.error(`Amounts must add up to ${amount}`);
        return false;
      }
    }
  }
  
  return true;
};

// Calculate shares for participants based on split type
export const calculateParticipantShares = (participants, splitType, amount, customSplits) => {
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
  
  return participantShares;
};