import { AbonateToDebtSchema, CreateDebtSchema, DebtorSchema } from "@/schema/Debtor";
import { InferOutput } from "valibot";

export type Debtor = InferOutput<typeof DebtorSchema>
export type AbonateToDebt = InferOutput<typeof AbonateToDebtSchema>
export type AddDebt = InferOutput<typeof CreateDebtSchema>;
