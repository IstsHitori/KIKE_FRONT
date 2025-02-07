import {
  abonateToDebt,
  createDebt,
  fetchDebtors,
  markDebtAsPaid,
} from "@/helpers/fetchAPI";
import { AbonateToDebt, AddDebt, Debtor } from "@/types/debtor";
import { StateCreator } from "zustand";

export interface IDebtorSlice {
  debtors: Debtor[];
  fetchDebtors: () => Promise<void>;
  createDebt: (newDebt: AddDebt) => Promise<void>;
  abonateToDebt: (abonateData: AbonateToDebt) => Promise<void>;
  markDebtAsPaid: (idDebt: string) => Promise<void>;
}

export const createDebtorSlice: StateCreator<IDebtorSlice> = (set, get) => ({
  debtors: [],
  fetchDebtors: async () => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const debtors = await fetchDebtors(token);
      set(() => ({ debtors: [...debtors] }));
    } catch (error) {
      console.log(error);
    }
  },
  createDebt: async (newDebt) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await createDebt(token, newDebt);
      await get().fetchDebtors();
    } catch (error) {
      console.log(error);
    }
  },
  abonateToDebt: async (abonateData) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await abonateToDebt(token, abonateData);
      get().fetchDebtors();
    } catch (error) {
      console.log(error);
    }
  },
  markDebtAsPaid: async (idDebt) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await markDebtAsPaid(token, idDebt);
      get().fetchDebtors();
    } catch (error) {
      console.log(error);
    }
  },
});
