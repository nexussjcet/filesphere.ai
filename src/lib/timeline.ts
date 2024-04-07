import { ChainReturn } from "@/initiative/chain";
import { Schema } from "@/lib/schema";
import { create } from "zustand";

type PartialState = Partial<ChainReturn<typeof Schema>>;

type State = {
  status: "idle" | "searching" | "error" | "success";
  data: PartialState | null;
  updateData: (data: PartialState) => void;
  setSuccessData: (data: State["data"]) => void;
  setStatus: (status:State["status"]) => void,
  updateStateInstance: <K extends keyof PartialState>(
    key: K,
    value: PartialState[K],
  ) => void;
  clearData: () => void;
};

export const TimeLineState = create<State>((set) => ({
  status: "idle",
  data: null,
  setSuccessData: (data) => set({ status:"success", data }),
  setStatus: (status) => set({ status }),
  clearData: () => set({ data: null }),
  updateData: (data) => set({ data }),
  updateStateInstance: (key, value) =>
    set((prev) => ({
      data: {
        ...prev.data,
        [key]: value,
      },
    })),
}));
