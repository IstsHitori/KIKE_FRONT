import { array, object, string } from "valibot";

export const CategorySchema = object({
  _id: string(),
  name: string(),
  description: string(),
});

export const AddCategorySchema = object({
  name: string(),
  description: string(),
});

export const ArrayCateogrySchema = object({
  categories: array(CategorySchema),
});
