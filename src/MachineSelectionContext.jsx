// MachineSelectionContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const MachineSelectionContext = createContext({
  selectedMachineId: "all",
  setSelectedMachineId: (value) => {},
});

export function useMachineSelection() {
  return useContext(MachineSelectionContext);
}

export function MachineSelectionProvider({ children }) {
  const [selectedMachineId, setSelectedMachineId] = useState("all");

  // optional: load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("selectedMachineId");
      if (stored) setSelectedMachineId(stored);
    } catch {}
  }, []);

  // optional: persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("selectedMachineId", selectedMachineId);
    } catch {}
  }, [selectedMachineId]);

  const value = useMemo(
    () => ({ selectedMachineId, setSelectedMachineId }),
    [selectedMachineId]
  );

  return (
    <MachineSelectionContext.Provider value={value}>
      {children}
    </MachineSelectionContext.Provider>
  );
}
