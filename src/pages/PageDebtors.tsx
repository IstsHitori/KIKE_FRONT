import DebtorsTable from "@/components/debtor/DebtorsTable";
import { StatsCards } from "@/components/debtor/StatsCard";
import { useDebtor } from "@/hooks/useDebtor";
import RegisterDebtButton from "@/components/debtor/RegisterDebtButton";
import { useEffect } from "react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

export default function PageDebtors() {
  //
  const fetchProducts = useVeterinarieStore((state) => state.fetchProducts);
  const fetchClients = useVeterinarieStore((state) => state.fetchClients);
  //
  const { debtors, totalDebt, totalDebtors, unpaidDebts } = useDebtor();
  useEffect(() => {
    const fetch = async () => {
      await fetchProducts();
      await fetchClients();
    };
    fetch();
  }, []);
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Control de Deudores</h1>
          <RegisterDebtButton />
        </div>

        <StatsCards
          totalDebtors={totalDebtors}
          totalDebt={totalDebt}
          pendingDebt={unpaidDebts}
        />

        <DebtorsTable debtors={debtors} />
      </div>
    </main>
  );
}
