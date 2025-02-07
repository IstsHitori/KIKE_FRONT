import { CategorySchema } from "@/schema/Category";
import { InferOutput } from "valibot";

export type Category = InferOutput<typeof CategorySchema>;
export type AddCategory = Omit<Category, "_id">;
