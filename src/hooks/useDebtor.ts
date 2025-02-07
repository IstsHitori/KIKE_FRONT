import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { Debtor } from "@/types/debtor";
import { useEffect } from "react";

export function useDebtor() {
  const debtors = useVeterinarieStore((state) => state.debtors);
  const fetchDebtors = useVeterinarieStore((state) => state.fetchDebtors);

  const totalDebtors = debtors.length;
  const totalDebt = debtors.reduce((sum, debt) => sum + debt.total_amount, 0);
  const paymentsReceived = debtors.reduce(
    (sum, debt) => sum + debt.paid_amount,
    0
  );
  const unpaidDebts = debtors.reduce(
    (sum, debt) => sum + debt.pending_amount,
    0
  );
  useEffect(() => {
    const fetch = async () => {
      await fetchDebtors();
    };
    fetch()
  }, []);

  const getDebtor = (id: Debtor["_id"]): Debtor => {
    return debtors.find((debt) => debt._id === id) || ({} as Debtor);
  };

  return {
    debtors,
    totalDebtors,
    totalDebt,
    paymentsReceived,
    unpaidDebts,
    getDebtor,
  };
}
