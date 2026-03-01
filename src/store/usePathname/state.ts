import { create } from "zustand";

export const useLocationPage = create((set) => ({
  curentLocationPage: "",

  executefunc: (path: string) => set({ curentLocationPage: path }),
}));
