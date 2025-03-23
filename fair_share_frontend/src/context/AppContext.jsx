
import React, { createContext, useContext, useState } from "react";

// Create a default context value
const defaultContextValue = {
  expenses: [],
  addExpense: () => {},
  groups: [],
  addGroup: () => {},
  settlements: [],
  addSettlement: () => {},
};

const AppContext = createContext(defaultContextValue);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [settlements, setSettlements] = useState([]);

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  const addGroup = (group) => {
    setGroups([group, ...groups]);
  };

  const addSettlement = (settlement) => {
    setSettlements([settlement, ...settlements]);
  };

  const value = {
    expenses,
    addExpense,
    groups,
    addGroup,
    settlements,
    addSettlement,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};