"use client";
import { useContext, useState, createContext, ReactNode } from "react";

const ContextCalories = createContext<any>(null);

export function CaloriesProvider({ children }: { children: React.ReactNode }) {
  const [yourMaxSugar, setYourMaxSugar] = useState<Number>(0);
  return (
    <ContextCalories.Provider value={{ yourMaxSugar, setYourMaxSugar }}>
      {children}
    </ContextCalories.Provider>
  );
}

export function useCalories() {
  return useContext(ContextCalories);
}
