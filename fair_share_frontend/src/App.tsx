// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { lazy, Suspense } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { AppProvider } from "@/context/AppContext";

// // Pages
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Dashboard from "./pages/Dashboard";
// import Groups from "./pages/Groups";
// import AddExpense from "./pages/AddExpense";

// const queryClient = new QueryClient();

// // Loading spinner
// const LoadingSpinner = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
//   </div>
// );

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <AppProvider>
//         <BrowserRouter>
//           <Toaster />
//           <Sonner />
//           <AnimatePresence mode="wait">
//             <Suspense fallback={<LoadingSpinner />}>
//               <Routes>
//                 <Route path="/" element={<Index />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/groups" element={<Groups />} />
//                 <Route path="/add-expense" element={<AddExpense />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </Suspense>
//           </AnimatePresence>
//         </BrowserRouter>
//       </AppProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
