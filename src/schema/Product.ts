import { array, number, object, string } from "valibot";
export const ProductSchema = object({
  _id: string(),
  name: string(),
  price: number(),
  stock: number(),
  weight: string(),
  brand: string(),
  code: string(),
  description: string(),
  category: object({
    name: string(),
  }),
});

export const EditProductSchema = object({
  _id: string(),
  name: string(),
  price: string(),
  stock: string(),
  weight: string(),
  brand: string(),
  code: string(),
  description: string(),
  category: string(),
});

export const AddProductSchema = object({
  name: string(),
  price: string(),
  stock: string(),
  weight: string(),
  brand: string(),
  code: string(),
  description: string(),
  category: string(),
});

export const ArrayProductSchema = object({
  products: array(ProductSchema),
});
