import { UserStateTypeRaw, type UserStateType } from "@/lib/schema";
import { create } from "zustand";

type StateType = Partial<UserStateTypeRaw>

type State = {
  userState: StateType;
  selectFile: (files: string[]) => void;
  updateState: (state: Partial<StateType>) => void;
  clearState: () => void;
  updateStateInstance: (
    key: keyof StateType,
    value: StateType[typeof key],
  ) => void;
};

export const UserBrowserState = create<State>((set) => ({
  userState: {
  },
  clearState: () => {
    set((state) => ({
      userState: {},
    }));
  },
  selectFile: (files) => {
    set((state) => ({
      userState: {
        ...state.userState,
        selected_A_Files: files,
      },
    }));
  },
  updateState: (newState) =>
    set((state) => ({
      userState: {
        ...state.userState,
        ...newState,
      },
    })),
  updateStateInstance: (key, value) =>
    set((state) => ({
      userState: {
        ...state.userState,
        [key]: value,
      },
    })),
}));

export const urlUpdation = create<{
  url: string;
  updateUrl: (url: string) => void;
}>((set) => ({
  url: "",
  updateUrl: (url: string) => set({ url: url }),
}));
