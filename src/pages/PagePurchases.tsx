import { Purchases } from "@/components/purchases/Purchases";
import { Card, CardContent } from "@/components/ui/card";
import usePurchases from "@/hooks/usePurchases";
import { CalendarDays, Receipt, Search } from "lucide-react";
import { useEffect } from "react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

export default function PagePurchases() {
  //
  const fetchOrders = useVeterinarieStore((state) => state.fetchOrders);
  //
  const { totalOrders, ordersOfMonth, lastPurchaseDate } = usePurchases();
  useEffect(() => {
    const fetch = async () => {
      await fetchOrders();
    };
    fetch();
  }, []);
  return (
    <div className="container mx-auto py-3 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Registro de Compras
          </h1>
          <p className="text-muted-foreground text-md">
            Historial de compras completadas
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total de Compras
                  </p>
                  <p className="text-xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Compras del Mes
                  </p>
                  <p className="text-xl font-bold">{ordersOfMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Última Compra</p>
                  <p className="text-xl font-bold">{lastPurchaseDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Purchases />
    </div>
  );
}
