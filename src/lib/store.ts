import { type UserStateType } from "@/lib/schema";
import { create } from "zustand";

type State = {
  userState: UserStateType;
  updateState: (state: Partial<UserStateType>) => void;
  updateStateInstance: (state: Partial<UserStateType>) => void;
};

export const BrowserState = create<State>((set) => ({
  userState: {
    listOfContactsAvailable: [],
    select_A_File: "",
    selected_A_Contact: ""
  },
  updateState: (state) =>
    set({
      userState: {
        listOfContactsAvailable: state.listOfContactsAvailable ?? [],
        select_A_File: state.select_A_File ?? "",
        selected_A_Contact: state.selected_A_Contact ?? "",
      },
    }),
  updateStateInstance: (state) =>
    set((prev) => ({ userState: { ...prev.userState, ...state } })),
}));

export const urlUpdation = create<{
  url: string;
  updateUrl: (url: string) => void;
}>((set) => ({
  url: "",
  updateUrl: (url: string) => set({ url: url }),
}));