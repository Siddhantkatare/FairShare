
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GroupInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, expenses, settlements } = useAppContext();
  
  const group = groups.find(g => g.id === id);
  
  // Filter expenses related to this group
  const groupExpenses = expenses.filter(expense => expense.groupId === id);
  
  // Filter settlements related to this group's expenses
  const groupSettlements = settlements.filter(settlement => 
    groupExpenses.some(expense => expense.id === settlement.expenseId)
  );
  
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
            <h1 className="text-2xl font-semibold">{group.name}</h1>
            <p className="text-muted-foreground text-sm">
              Group Information and Transaction History
            </p>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Group Members</h2>
            <div className="space-y-2">
              {group.memberList?.map((email, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {email[0].toUpperCase()}
                  </div>
                  <div>{email}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            {groupExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.paidBy}</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No transactions yet in this group</p>
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settlement Status</h2>
            {groupSettlements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupSettlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell className="font-medium">{settlement.from}</TableCell>
                      <TableCell>{settlement.to}</TableCell>
                      <TableCell>{settlement.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(settlement.amount)}</TableCell>
                      <TableCell>
                        <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                          settlement.status === "paid" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {settlement.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No settlements required in this group</p>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default GroupInfo;