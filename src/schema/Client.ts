import { array, boolean, number, object, string } from "valibot";

export const ClientSchema = object({
  _id: string(),
  name: string(),
  telephone: string(),
  nit: number(),
  date: string(),
  isDebtor: boolean(),
});

export const ArrayClientSchema = object({
  clients: array(ClientSchema),
});
