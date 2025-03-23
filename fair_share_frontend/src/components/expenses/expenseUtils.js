import { toast } from "react-toastify";

// Validate first step (participants)
export const validateParticipants = (participants) => {
  const hasEmptyFields = participants.some((p) => !p.name || !p.email);
  if (hasEmptyFields) {
    toast.error("Please fill in all participant details");
    return false;
  }
  return true;
};

// Validate expense details and splits
export const validateExpenseDetails = (
  description,
  amount,
  paidBy,
  category,
  splitType,
  customSplits
) => {
  // Validate basic details
  if (!description || !amount || !paidBy || !category) {
    toast.error("Please fill in all expense details");
    return false;
  }

  // For Percentage or Manual split types, validate the custom splits
  if (splitType !== "Equal") {
    const hasEmptySplits = customSplits.some((split) => !split.value);
    if (hasEmptySplits) {
      toast.error("Please fill in all split values");
      return false;
    }

    if (splitType === "Percentage") {
      const totalPercentage = customSplits.reduce(
        (sum, split) => sum + Number(split.value),
        0
      );
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Percentages must add up to 100%");
        return false;
      }
    } else if (splitType === "Manual") {
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
export const calculateParticipantShares = (
  participants,
  splitType,
  amount,
  customSplits
) => {
  let participantShares = [];

  if (splitType === "Equal") {
    const splitAmount = parseFloat(amount) / participants.length;
    participantShares = participants.map((p) => ({
      ...p,
      amount: splitAmount,
    }));
  } else if (splitType === "Percentage") {
    participantShares = participants.map((p) => {
      const split = customSplits.find((s) => s.id === p.id);
      const share = (parseFloat(split?.value || 0) / 100) * parseFloat(amount);
      return { ...p, amount: share };
    });
  } else if (splitType === "Manual") {
    participantShares = participants.map((p) => {
      const split = customSplits.find((s) => s.id === p.id);
      return { ...p, amount: parseFloat(split?.value || 0) };
    });
  }

  return participantShares;
};