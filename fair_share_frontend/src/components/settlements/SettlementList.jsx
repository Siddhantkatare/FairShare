import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Check, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const SettlementList = () => {
  const { settlements, markAsPaid, expenses, groups } = useAppContext();
  const [activeTab, setActiveTab] = useState("toPay");
  const [isLoading, setIsLoading] = useState(true);
  const [settlementData, setSettlementData] = useState([]);
  
  useEffect(() => {
    if (settlements && settlements.length > 0) {
      setSettlementData(settlements);
      setIsLoading(false);
    } else {
      const placeholderSettlements = [
        {
          id: "s1",
          description: "Dinner at Italian Restaurant",
          amount: 350,
          from: "You",
          to: "Alex",
          date: new Date().toISOString(),
          status: "pending"
        },
        {
          id: "s2",
          description: "Movie tickets",
          amount: 250,
          from: "Sarah",
          to: "You",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "pending"
        },
        {
          id: "s3",
          description: "Groceries",
          amount: 650,
          from: "You",
          to: "Michael",
          date: new Date(Date.now() - 172800000).toISOString(),
          status: "paid"
        }
      ];
      setSettlementData(placeholderSettlements);
    }
    setIsLoading(false);
  }, [settlements]);
  
  const toPay = settlementData.filter(s => s.status === "pending" && s.from === "You");
  const toReceive = settlementData.filter(s => s.status === "pending" && s.to === "You");
  const paid = settlementData.filter(s => s.status === "paid");

  const handlePaySettlement = (settlementId) => {
    markAsPaid(settlementId);
    toast.success("Payment marked as completed!");
    
    setSettlementData(prevData => 
      prevData.map(item => 
        item.id === settlementId 
          ? {...item, status: "paid"} 
          : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settlements</h2>
      </div>

      <Tabs defaultValue="toPay" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="toPay">To Pay</TabsTrigger>
          <TabsTrigger value="toReceive">To Receive</TabsTrigger>
          <TabsTrigger value="paid">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="toPay" className="space-y-4">
          {toPay.length > 0 ? (
            <div className="grid gap-4">
              {toPay.map((settlement, index) => (
                <motion.div
                  key={settlement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-5 hover:shadow-md transition-shadow duration-300 border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{settlement.description}</h3>
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(settlement.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-lg">
                          {formatCurrency(settlement.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      <span>
                        <span className="font-medium text-foreground">{settlement.from}</span>
                        {" "}needs to pay{" "}
                        <span className="font-medium text-foreground">{settlement.to}</span>
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button onClick={() => handlePaySettlement(settlement.id)} className="gap-1">
                        <Check className="h-4 w-4" />
                        Mark as Paid
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-2">No pending payments</h3>
              <p className="text-muted-foreground">
                You're all caught up! There are no pending payments to make.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="toReceive" className="space-y-4">
          {toReceive.length > 0 ? (
            <div className="grid gap-4">
              {toReceive.map((settlement, index) => (
                <motion.div
                  key={settlement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-5 hover:shadow-md transition-shadow duration-300 border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{settlement.description}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(settlement.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-lg">
                          {formatCurrency(settlement.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      <span>
                        <span className="font-medium text-foreground">{settlement.from}</span>
                        {" "}owes you a payment
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-2">No pending receivables</h3>
              <p className="text-muted-foreground">
                No one owes you money at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="paid" className="space-y-4">
          {paid.length > 0 ? (
            <div className="grid gap-4">
              {paid.map((settlement, index) => (
                <motion.div
                  key={settlement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-5 hover:shadow-md transition-shadow duration-300 border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{settlement.description}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(settlement.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-lg">
                          {formatCurrency(settlement.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        <span className="font-medium text-foreground">{settlement.from}</span>
                        {" "}paid{" "}
                        <span className="font-medium text-foreground">{settlement.to}</span>
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-2">No completed settlements</h3>
              <p className="text-muted-foreground">
                You haven't settled any payments yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
