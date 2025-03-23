import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import ParticipantsList from "./ParticipantsList";
import ExpenseDetailsForm from "./ExpenseDetailsForm";
import { validateParticipants, validateExpenseDetails, calculateParticipantShares } from "./expenseUtils";

export const AddExpenseForm = () => {
  const navigate = useNavigate();
  const { addExpense } = useAppContext();
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState([
    { id: "1", name: "", email: "" },
    { id: "2", name: "", email: "" },
  ]);
  
  // Step 2 state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState([]);

  // Handle next step
  const handleNextStep = () => {
    // Validate first step
    if (step === 1) {
      if (!validateParticipants(participants)) {
        return;
      }
      
      // Initialize custom splits for participants
      const initialSplits = participants.map(p => ({
        id: p.id,
        value: splitType === "equal" 
          ? (100 / participants.length).toFixed(2) 
          : "",
      }));
      setCustomSplits(initialSplits);
      
      // Move to next step
      setStep(2);
    }
  };

  // Handle back
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  // Handle split type change
  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    
    // Reset custom splits based on the new split type
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
    
    // Validate expense details
    if (!validateExpenseDetails(description, amount, paidBy, category, splitType, customSplits)) {
      return;
    }
    
    // Get the payer name
    const payer = participants.find(p => p.id === paidBy);
    if (!payer) {
      toast.error("Please select who paid for the expense");
      return;
    }
    
    // Calculate participant shares
    const participantShares = calculateParticipantShares(
      participants, 
      splitType, 
      amount, 
      customSplits
    );
    
    // Create expense object
    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date(),
      category,
      paidBy: payer.name,
      splitType,
      participants: participantShares
    };
    
    // Add expense to context
    addExpense(newExpense);
    
    // Submit and navigate back to dashboard
    toast.success("Expense added successfully!");
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Add New Expense</h1>
          <p className="text-muted-foreground text-sm">
            Step {step} of 2: {step === 1 ? "Add participants" : "Expense details"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <ParticipantsList 
                participants={participants} 
                setParticipants={setParticipants} 
              />

              <div className="pt-4">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <ExpenseDetailsForm
                description={description}
                setDescription={setDescription}
                amount={amount}
                setAmount={setAmount}
                paidBy={paidBy}
                setPaidBy={setPaidBy}
                category={category}
                setCategory={setCategory}
                participants={participants}
                splitType={splitType}
                setSplitType={handleSplitTypeChange}
                customSplits={customSplits}
                updateCustomSplit={updateCustomSplit}
              />

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Add Expense
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};
