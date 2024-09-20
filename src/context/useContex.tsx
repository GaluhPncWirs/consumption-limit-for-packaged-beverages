"use client";
import { useContext, useState, createContext, ReactNode } from "react";

const ContextCalories = createContext<any>(null);

export function CaloriesProvider({ children }: { children: React.ReactNode }) {
  const [yourCalories, setYourCalories] = useState<Number>(0);
  return (
    <ContextCalories.Provider value={{ yourCalories, setYourCalories }}>
      {children}
    </ContextCalories.Provider>
  );
}

export function useCalories() {
  return useContext(ContextCalories);
}
