import { AddProductSchema, EditProductSchema, ProductSchema } from "@/schema/Product";
import { InferOutput } from "valibot";

export type Product = InferOutput<typeof ProductSchema>;
export type AddProduct = InferOutput<typeof AddProductSchema>;
export type EditProduct = InferOutput<typeof EditProductSchema>;