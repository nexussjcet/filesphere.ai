import { create } from "zustand";

export const urlUpdation = create<{
  url: string;
  updateUrl: (url: string) => void;
}>((set) => ({
  url: "",
  updateUrl: (url: string) => set({ url: url }),
}));
