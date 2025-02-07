import { getTotalToPay } from "@/helpers";
import { createOrder, fetchOrders } from "@/helpers/fetchAPI";
import {
  AddOrder,
  InfoOrder,
  Item,
  Order,
  Service,
} from "@/types/oder";
import { toast } from "react-toastify";
import { StateCreator } from "zustand";

export interface IOrderSlice {
  orders: Order[];
  items: Item[];
  services: Service[];
  fetchOrders: () => Promise<void>;
  createOrder: (infoOrder: InfoOrder) => Promise<void>;
  addItemToCar: (item: Item, stockProduct: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItem: (productId: string) => void;
}

export const createOrderSlice: StateCreator<IOrderSlice> = (set, get) => ({
  orders: [],
  items: [],
  services: [],
  fetchOrders: async () => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const orders = await fetchOrders(token);
      set(() => ({ orders: [...orders] }));
    } catch (error) {
      console.log(error);
    }
  },
  createOrder: async ({
    nameCustomer,
    nitCustomer,
    payment_method,
    paymentStatus,
  }: InfoOrder) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const totalToPay = getTotalToPay(get().items, get().services);
      const data: AddOrder = {
        nitCustomer,
        nameCustomer,
        products: get().items,
        services: get().services,
        total_amount: totalToPay,
        payment_method,
        paid_amount: paymentStatus === "pago" ? totalToPay : 0,
      };
      await createOrder(token, data);
      set(() => ({
        items: [],
        services: [],
      }));
    } catch (error) {
      console.log(error);
    }
  },
  addItemToCar: (item, stockProduct) => {
    const indexItem = get().items.findIndex(
      (index) => index.product === item.product
    );
    if (indexItem !== -1) {
      const copyItems = get().items.map((index) => {
        if (index.product === item.product) {
          if (stockProduct > index.quantity) {
            return { ...index, quantity: index.quantity + 1 };
          }
          toast.error("No hay stock de este producto");
          return { ...index };
        }
        return { ...index };
      });
      set(() => ({
        items: copyItems,
      }));
      return;
    }
    set(() => ({
      items: [...get().items, item],
    }));
  },
  updateQuantity: (productId, newQuantity) => {
    const indexItem = get().items.findIndex(
      (index) => index.product === productId
    );
    if (indexItem === -1) {
      return;
    }
    const copyItems = [...get().items];
    copyItems[indexItem].quantity = newQuantity;
    set(() => ({
      items: copyItems,
    }));
  },
  removeItem: (productId) => {
    const updateItems = get().items.filter(
      (item) => item.product !== productId
    );
    set(() => ({
      items: [...updateItems],
    }));
  },
});
