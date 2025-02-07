import clientAxios from "@/config/axios";
import { IProfile } from "@/types";
import { ArrayClientSchema } from "@/schema/Client";
import { safeParse } from "valibot";
import { Client, CreateClient } from "@/types/client";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrayProductSchema } from "@/schema/Product";
import { ArrayCateogrySchema } from "@/schema/Category";
import { AddProduct, EditProduct } from "@/types/product";
import { AddCategory, Category } from "@/types/category";
import { ArrayOrderSchema } from "@/schema/Order";
import { AddOrder } from "@/types/oder";
import { AddDebt } from "@/types/debtor";
import { getOrdersWithDebts, getOrdersWithOutDebts } from ".";
import { ArrayDebtorSchema } from "@/schema/Debtor";
import { AbonateToDebt } from "@/types/debtor";

export const config = (token: string) => {
  return {
    headers: {
      "Content-type": "application/json",

      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchProfile = async (token: string) => {
  try {
    const response = await clientAxios.get("/auth/get-profile", config(token));
    if (response.status === 200) {
      const data: IProfile = response.data;
      return data;
    }
    return new Error("Veterinario no encontrado");
  } catch (error) {
    console.log(error);
  }
};
//Clients
export const fetchClients = async (token: string): Promise<Client[]> => {
  try {
    const response = await clientAxios.get("/client", config(token));
    if (response.status === 200) {
      const { data } = response;
      const result = safeParse(ArrayClientSchema, data);
      if (result.success) {
        const { clients } = result.output;
        return clients;
      }
    }
    return [];
  } catch (error) {
    console.log(error);
    toast.error("Ha ocurrido un error al obtener los clientes");
    return [];
  }
};
export const createClient = async (
  token: string,
  newClient: CreateClient
): Promise<void> => {
  try {
    const response = await clientAxios.post(
      "/client/create-client",
      newClient,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Cliente registrado correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const updateClient = async (
  token: string,
  clientToUpdate: Client
): Promise<void> => {
  try {
    const response = await clientAxios.put(
      `/client/update-client/${clientToUpdate._id}`,
      clientToUpdate,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Cliente actualizado correctamente.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const deleteClient = async (
  token: string,
  id: string
): Promise<void> => {
  try {
    const response = await clientAxios.delete(
      `/client/delete-client/${id}`,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Cliente eliminado correctamente.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
//----

//Products
export const fetchProducts = async (token: string) => {
  try {
    const response = await clientAxios.get("/product", config(token));
    if (response.status === 200) {
      const { data } = response;
      const { success, output } = safeParse(ArrayProductSchema, data);
      if (success) {
        return output.products;
      }
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
    return [];
  }
};
export const createProduct = async (
  token: string,
  newProduct: AddProduct
): Promise<void> => {
  try {
    const response = await clientAxios.post(
      "/product/create-product",
      newProduct,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Producto registrado correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const updateProduct = async (
  token: string,
  product: EditProduct
): Promise<void> => {
  try {
    const response = await clientAxios.put(
      `/product/update-product/${product._id}`,
      product,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Producto actualizado correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const deleteProduct = async (
  token: string,
  idProduct: string
): Promise<void> => {
  try {
    const response = await clientAxios.delete(
      `/product/delete-product/${idProduct}`,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Producto eliminado correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
//Categories
export const fetchCategories = async (token: string) => {
  try {
    const response = await clientAxios.get("/category", config(token));
    if (response.status === 200) {
      const { data } = response;
      const { success, output } = safeParse(ArrayCateogrySchema, data);
      if (success) {
        return output.categories;
      }
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
    return [];
  }
};
export const createCategory = async (
  token: string,
  newCategory: AddCategory
): Promise<void> => {
  try {
    const response = await clientAxios.post(
      "/category/create-category",
      newCategory,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Categoria registrado correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const updateCategory = async (
  token: string,
  category: Category
): Promise<void> => {
  try {
    const response = await clientAxios.put(
      `/category/update-category/${category._id}`,
      category,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Categoria actualizada correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};
export const deleteCategory = async (
  token: string,
  idCategory: string
): Promise<void> => {
  try {
    const response = await clientAxios.delete(
      `/category/delete-category/${idCategory}`,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Categoria eliminada correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};

//Orders
export const fetchOrders = async (token: string) => {
  try {
    const response = await clientAxios.get("/order", config(token));
    if (response.status === 200) {
      const { data } = response;
      const { success, output } = safeParse(ArrayOrderSchema, data);
      if (success) {
        const orderWithOutDebts = getOrdersWithOutDebts(output.orders);
        return orderWithOutDebts;
      }
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
    return [];
  }
};
export const createOrder = async (
  token: string,
  newOrder: AddOrder
): Promise<void> => {
  try {
    const response = await clientAxios.post(
      "/order/create-order",
      newOrder,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Orden creada correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
      return;
    }
    console.log(error);
  }
};

//Debtors
export const fetchDebtors = async (token: string) => {
  try {
    const response = await clientAxios.get("/order", config(token));
    if (response.status === 200) {
      const { data } = response;
      const { success, output } = safeParse(ArrayDebtorSchema, data);

      if (success) {
        const ordersWithDebts = getOrdersWithDebts(output.orders);
        return ordersWithDebts;
      }
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
    return [];
  }
};
export const createDebt = async (token: string, newDebt: AddDebt) => {
  try {
    const response = await clientAxios.post(
      "/order/create-order",
      newDebt,
      config(token)
    );
    if (response.status === 200) {
      toast.success("Deuda registrada correctamente");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
  }
};
export const abonateToDebt = async (
  token: string,
  abonateData: AbonateToDebt
) => {
  try {
    const { payment_method, idDebt, paymentAmount } = abonateData;
    const response = await clientAxios.post(
      `/order/register-paid/${idDebt}`,
      {
        payment_method,
        paymentAmount,
      },
      config(token)
    );
    if (response.status === 200) {
      toast.success(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
  }
};
export const markDebtAsPaid = async (token: string, idDebt: string) => {
  try {
    const response = await clientAxios.patch(
      `/order/mark-as-paid/${idDebt}`,
      {},
      config(token)
    );
    if (response.status === 200) {
      toast.success(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
  }
};
