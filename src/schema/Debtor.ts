import { object, number, string, array } from "valibot";
import { ClientSchema } from "./Client";

const ProductDebSchema = object({
  _id: string(),
  product: object({
    _id: string(),
    name: string(),
  }),
  quantity: number(),
  price: number(),
});

const ServiceDebSchema = object({
  _id: string(),
  name: string(),
  price: number(),
});

const PayHistorySchema = object({
  _id: string(),
  amount: number(),
  payment_method: string(),
  date: string(),
});

export const DebtorSchema = object({
  _id: string(),
  client: ClientSchema,
  products: array(ProductDebSchema),
  services: array(ServiceDebSchema),
  total_amount: number(),
  payment_status: string(),
  pending_amount: number(),
  paid_amount: number(),
  date: string(),
  payment_history: array(PayHistorySchema),
});

export const ArrayDebtorSchema = object({
  orders: array(DebtorSchema),
});
export const CreateDebtSchema = object({
  nitCustomer: string(),
  nameCustomer: string(),
  products: array(
    object({
      product: string(),
      quantity: number(),
      price: number(),
    })
  ),
  services: array(
    object({
      name: string(),
      price: number(),
    })
  ),
  total_amount: number(),
});

export const AbonateToDebtSchema = object({
  idDebt: string(),
  paymentAmount:number(),
  payment_method:string()
})
