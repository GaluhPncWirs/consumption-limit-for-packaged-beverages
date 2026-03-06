import { create } from "zustand";

export const useDeleteToken = create((set) => ({
  isDeleteSuccess: false,

  setDeleteToken: async (handleDelete: boolean) => {
    if (handleDelete) {
      const req = await fetch("/api/delCookies", {
        method: "DELETE",
        credentials: "include",
      });
      const res = await req.json();
      if (res.status) {
        set({ isDeleteSuccess: true });
      }
    }
  },
}));
