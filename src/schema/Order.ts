import { array, number, object, string } from "valibot";
import { DebtorSchema } from "./Debtor";

export const ArrayOrderSchema = object({
  orders: array(DebtorSchema),
});

export const AddItemSchema = object({
  product: string(),
  nameProduct: string(),
  quantity: number(),
  price: number(),
});
export const AddServiceSchema = object({
  name: string(),
  price: number(),
});
export const CreateOrder = object({
  nitCustomer: number(),
  nameCustomer: string(),
  products: array(AddItemSchema),
  services: array(AddServiceSchema),
  total_amount: number(),
  payment_method: string(),
  paid_amount:number()
});
