import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/hooks/useDashboard";
import { formatDate } from "@/helpers";
import { Link } from "react-router-dom";

export function ActivityList() {
  const { ordersAndDebts } = useDashboard();
  const ordersFilters = [...ordersAndDebts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ordenes recientes</CardTitle>
            <CardDescription>Últimas ordenes que se han hecho</CardDescription>
          </div>
          <Link to={"/app/compras"} className="text-sm p-1 px-2 border rounded-lg hover:bg-zinc-50 transition-all" >
            Ver todo
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {ordersFilters.map(
              (order, index) =>
                index < 5 && (
                  <div
                    key={order._id}
                    className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`${
                        order.payment_status === "pago"
                          ? "bg-green-100"
                          : order.payment_status === "pendiente"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      } rounded-full p-2`}
                    >
                      {order.payment_status === "pago" && (
                        <CheckCircle2 className="text-green-500" />
                      )}
                      {order.payment_status === "pendiente" && (
                        <AlertTriangle className="text-red-500" />
                      )}
                      {order.payment_status === "parcial" && (
                        <Clock className="text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Orden #{order._id} - {order.client.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
