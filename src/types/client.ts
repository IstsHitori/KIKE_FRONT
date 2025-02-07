import { ClientSchema } from "@/schema/Client";
import { InferOutput } from "valibot";

export type Client = InferOutput<typeof ClientSchema>;

export type CreateClient = Omit<Client, "_id" | "date">;