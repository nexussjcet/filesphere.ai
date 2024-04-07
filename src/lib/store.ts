import { type UserStateType } from "@/lib/schema";
import { create } from "zustand";

type State = {
  userState: UserStateType;
  updateState: (state: Partial<UserStateType>) => void;
  updateStateInstance: (
    key: keyof UserStateType,
    value: UserStateType[typeof key],
  ) => void;
};

export const UserBrowserState = create<State>((set) => ({
  userState: {},
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
