import { create } from "zustand";

export const useLocationPage = create((set) => ({
  curentLocationPage: "",

  setCurrrentLocation: (path: string) => set({ curentLocationPage: path }),
}));
