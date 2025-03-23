import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Check, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { loggedData } from "../../lib/config";
import { getAllExpense } from "../../api/expenseApi";

export const SettlementList = () => {
  const [expenses, setExpenses] = useState([])
  const loginUser = loggedData(); // Logged-in user
  const [activeTab, setActiveTab] = useState("toPay");
  const [settlementData, setSettlementData] = useState([]);

  const getExpenses = async () => {
    const response = await getAllExpense(loginUser.token);
    if (response.success) {
      setExpenses(response.allExpenses)
    } else {
      toast.error(response.data.message, ToastProperty)
    }
  }

  useEffect(() => {
    getExpenses();
  }, [])

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const settlements = [];

    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.email;
      const isLoggedUserPayer = paidBy === loginUser.email;

      expense.participants.forEach((participant) => {
        if (participant.email !== paidBy) {
          const isLoggedUserParticipant = participant.email === loginUser.email;

          // If the logged-in user paid, they should receive money from unpaid participants.
          if (isLoggedUserPayer && !participant.paid) {
            settlements.push({
              id: `${expense.id}-${participant.email}`,
              description: expense.description,
              amount: participant.share,
              from: participant.email, // The one who owes money
              to: "You",
              date: expense.date,
              status: participant.paid ? "paid" : "pending",
            });
          }

          // If the logged-in user is a participant who hasn't paid yet, they need to pay.
          if (isLoggedUserParticipant && !participant.paid) {
            settlements.push({
              id: `${expense.id}-${participant.email}`,
              description: expense.description,
              amount: participant.share,
              from: "You",
              to: expense.paidBy.email, // The payer
              date: expense.date,
              status: "pending",
            });
          }
        }
      });
    });

    setSettlementData(settlements);
  }, [expenses]);

  const toPay = settlementData.filter((s) => s.status === "pending" && s.from === "You");
  const toReceive = settlementData.filter((s) => s.status === "pending" && s.to === "You");
  const paid = settlementData.filter((s) => s.status === "paid");

  const handlePaySettlement = (settlementId) => {

    setSettlementData((prevData) =>
      prevData.map((item) =>
        item.id === settlementId ? { ...item, status: "paid" } : item
      )
    );
    toast.success("Payment marked as completed!"); 
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settlements</h2>

      <Tabs defaultValue="toPay" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="toPay">To Pay</TabsTrigger>
          <TabsTrigger value="toReceive">To Receive</TabsTrigger>
          <TabsTrigger value="paid">Completed</TabsTrigger>
        </TabsList>

        {/* To Pay */}
        <TabsContent value="toPay" className="space-y-4">
          {toPay.length > 0 ? (
            toPay.map((settlement, index) => (
              <motion.div
                key={settlement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-5 hover:shadow-md border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{settlement.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(settlement.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <span className="font-semibold text-lg">{formatCurrency(settlement.amount)}</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    <span>
                      <span className="font-medium text-foreground">{settlement.from}</span> owes{" "}
                      <span className="font-medium text-foreground">{settlement.to}</span>
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button onClick={() => handlePaySettlement(settlement.id)} className="gap-1">
                      <Check className="h-4 w-4" /> Mark as Paid
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-2">No pending payments</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </TabsContent>

        {/* To Receive */}
        <TabsContent value="toReceive" className="space-y-4">
          {toReceive.length > 0 ? (
            toReceive.map((settlement, index) => (
              <motion.div key={settlement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-5 hover:shadow-md border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{settlement.description}</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(settlement.date), "MMM d, yyyy")}</p>
                    </div>
                    <span className="font-semibold text-lg">{formatCurrency(settlement.amount)}</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    <span>
                      <span className="font-medium text-foreground">{settlement.from}</span> owes you a payment
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-2">No pending receivables</h3>
            </div>
          )}
        </TabsContent>

        {/* Paid Settlements */}
        <TabsContent value="paid" className="space-y-4">
          {paid.length > 0 ? (
            paid.map((settlement, index) => (
              <motion.div key={settlement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-5 hover:shadow-md border">
                  <h3 className="font-medium">{settlement.description}</h3>
                  <p className="text-sm text-muted-foreground">{format(new Date(settlement.date), "MMM d, yyyy")}</p>
                  <span className="font-semibold text-lg">{formatCurrency(settlement.amount)}</span>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">No completed settlements</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
