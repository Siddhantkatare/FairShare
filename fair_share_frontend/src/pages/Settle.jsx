import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettlementList } from "@/components/settlements/SettlementList";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

const Settle = () => {
  const { settlements } = useAppContext();

  useEffect(() => {
    // Check if we have any settlements data
    if (!settlements || settlements.length === 0) {
      toast.info("Using demo settlement data", {
        description: "Connect to a backend to see your real settlements"
      });
    }
  }, [settlements]);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Settle Up</h1>
          <p className="text-muted-foreground">
            Manage your pending and completed payments
          </p>
        </div>
        
        <SettlementList />
      </motion.div>
    </AppLayout>
  );
};

export default Settle;
