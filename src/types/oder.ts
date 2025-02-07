import { DebtorSchema } from "@/schema/Debtor";
import { AddItemSchema, AddServiceSchema, CreateOrder } from "@/schema/Order";
import { InferOutput } from "valibot";

export type Order = InferOutput<typeof DebtorSchema>;
export type Item = InferOutput<typeof AddItemSchema>;
export type Service = InferOutput<typeof AddServiceSchema>;
export type AddOrder = InferOutput<typeof CreateOrder>;
export type InfoOrder = {
  nitCustomer: number;
  nameCustomer: string;
  payment_method: "efectivo" | "transferencia";
  paymentStatus: "pago" | "parcial";
};
