import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Settle from "./pages/Settle";
import { AddExpenseForm } from "./components/expenses/AddExpenseForm";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import GroupDetail from "./pages/GroupDetail";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Index />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/add-expense" element={<AddExpenseForm />} />
          <Route path="/settle" element={<Settle />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatedRoutes />
    </Suspense>
  </BrowserRouter>
);

export default App;