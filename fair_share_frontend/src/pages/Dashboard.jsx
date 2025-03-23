import { AppLayout } from "@/components/layout/AppLayout";
import { ExpensesOverview } from "@/components/dashboard/ExpensesOverview";

const Dashboard = () => {
  return (
    <AppLayout>
      <ExpensesOverview />
    </AppLayout>
  );
};

export default Dashboard;
