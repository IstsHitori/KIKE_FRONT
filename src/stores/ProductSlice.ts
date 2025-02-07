import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/helpers/fetchAPI";
import { AddProduct, EditProduct, Product } from "@/types/product";
import { StateCreator } from "zustand";

export interface IProductSlice {
  products: Product[];
  productSelected: Product | null;
  fetchProducts: () => Promise<void>;
  createProduct: (newProduct: AddProduct) => Promise<void>;
  updateProduct: (product: EditProduct) => Promise<void>;
  deleteProduct: (idProduct: string) => Promise<void>;
}

export const createProductSlice: StateCreator<IProductSlice> = (set, get) => ({
  products: [],
  productSelected: null,
  fetchProducts: async () => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const products = await fetchProducts(token);
      set(() => ({ products: [...products] }));
    } catch (error) {
      console.log(error);
    }
  },
  createProduct: async (newProduct) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await createProduct(token, newProduct);
      await get().fetchProducts();
    } catch (error) {
      console.log(error);
    }
  },
  updateProduct: async (product) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await updateProduct(token, product);
      await get().fetchProducts();
    } catch (error) {
      console.log(error);
    }
  },
  deleteProduct: async (idProduct) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await deleteProduct(token,idProduct);
      await get().fetchProducts();
    } catch (error) {
      console.log(error);
    }
  },
});
