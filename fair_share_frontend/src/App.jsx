import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
// import AddExpense from "./pages/AddExpense";
import Settle from "./pages/Settle";
import { AddExpenseForm } from "./components/expenses/AddExpenseForm";

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/add-expense" element={<AddExpenseForm />} />
          <Route path="/settle" element={<Settle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  </BrowserRouter>
);

export default App;