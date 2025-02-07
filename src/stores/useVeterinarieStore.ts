import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, IAuthSlice } from "./AuthSlice";
import { IClientSlice, createClienteSlice } from "./ClientSlice";
import { IProductSlice, createProductSlice } from "./ProductSlice";
import { createCategorySlice, ICategorySlice } from "./CategorySlice";
import { createOrderSlice, IOrderSlice } from "./OrderSlice";
import { createDebtorSlice, IDebtorSlice } from "./DebtorSlice";
export const useVeterinarieStore = create<
  IAuthSlice &
    IClientSlice &
    IProductSlice &
    ICategorySlice &
    IOrderSlice &
    IDebtorSlice
>()(
  devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createClienteSlice(...a),
    ...createProductSlice(...a),
    ...createCategorySlice(...a),
    ...createOrderSlice(...a),
    ...createDebtorSlice(...a),
  }))
);
