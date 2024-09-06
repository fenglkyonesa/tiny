// store.ts
import { create } from "zustand";
interface State {
  interval: string;
  setInterval: (interval: string) => void;
}

export const useStore = create<State>((set) => ({
  interval: "D",
  setInterval: (interval) => set({ interval }),
}));
