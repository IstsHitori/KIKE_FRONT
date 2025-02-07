import { AddCategory, Category } from "@/types/category";
import { StateCreator } from "zustand";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/helpers/fetchAPI";
export interface ICategorySlice {
  categories: Category[];
  productSelected: Category | null;
  fetchCategories: () => Promise<void>;
  createCategory: (newCategory: AddCategory) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (idCategory: string) => Promise<void>;
}

export const createCategorySlice: StateCreator<ICategorySlice> = (
  set,
  get
) => ({
  categories: [],
  productSelected: null,
  fetchCategories: async () => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const categories = await fetchCategories(token);
      set(() => ({ categories: [...categories] }));
    } catch (error) {
      console.log(error);
    }
  },
  createCategory: async (newCategory) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await createCategory(token, newCategory);
      await get().fetchCategories();
    } catch (error) {
      console.log(error);
    }
  },
  updateCategory: async (category) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await updateCategory(token, category);
      await get().fetchCategories();
    } catch (error) {
      console.log(error);
    }
  },
  deleteCategory: async (idCategory) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await deleteCategory(token, idCategory);
      await get().fetchCategories();
    } catch (error) {
      console.log(error);
    }
  },
});
