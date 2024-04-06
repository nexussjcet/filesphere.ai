import { UserState } from "@/lib/schema";
import { create } from "zustand";

type State = {
  userState: typeof UserState;
  updateState: (state: typeof UserState) => void;
  updateStateInstance: (state: Partial<typeof UserState>) => void;
}

export const BrowserState = create<State>((set) => ({
  userState: {},
  updateState: (state) => set({ userState: state }),
  updateStateInstance: (state) => set((prev) => ({ userState: { ...prev.userState, ...state } })),
}));
