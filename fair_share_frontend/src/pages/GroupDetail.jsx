import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, PieChart, Info } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups } = useAppContext();
  
  const group = groups.find(g => g.id === id);
  
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
          <Button variant="ghost" onClick={() => navigate("/groups")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-medium">{group.name}</h2>
              <p className="text-sm text-muted-foreground">
                {group.members} {group.members === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Total expenses</span>
            <span className="font-medium">
              {formatCurrency(group.totalExpenses)}
            </span>
          </div>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate(`/groups/${id}/split`)}
          >
            <PieChart className="h-8 w-8 mb-2" />
            <span className="text-lg font-medium">Split Amount</span>
            <p className="text-sm text-muted-foreground">
              Add a new expense and split it among group members
            </p>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate(`/groups/${id}/info`)}
          >
            <Info className="h-8 w-8 mb-2" />
            <span className="text-lg font-medium">Group Info</span>
            <p className="text-sm text-muted-foreground">
              View transaction history and member details
            </p>
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default GroupDetail;