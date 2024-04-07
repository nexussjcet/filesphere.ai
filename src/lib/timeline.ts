import { ChainReturn } from "@/initiative/chain";
import { Schema } from "@/lib/schema";
import { create } from "zustand";

type PartialState = Partial<ChainReturn<typeof Schema>>;

type State = {
  state: PartialState | null;
  updateState: (state: PartialState) => void;
  updateStateInstance: <K extends keyof PartialState>(
    key: K,
    value: PartialState[K],
  ) => void;
  clearState: () => void;
};

export const TimeLineState = create<State>((set) => ({
  state: null,
  clearState: () => set({ state: null }),
  updateState: (state) => set({ state }),
  updateStateInstance: (key, value) =>
    set((prev) => ({
      state: {
        ...prev.state,
        [key]: value,
      },
    })),
}));
