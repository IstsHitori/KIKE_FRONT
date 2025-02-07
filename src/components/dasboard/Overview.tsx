import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/helpers";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Users,
  AlertCircle,
  DollarSign,
  Clock,
  ShoppingCart,
} from "lucide-react";

export function Overview() {
  const {
    totalIncome,
    numberOrdersOfDay,
    numberOrdersDayComplete,
    numberOrdersDayPending,
    numberProductWithLowStock,
    numberDebtsPendingOrPartials,
    moneyPending,
  } = useDashboard();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos Totales
          </CardTitle>
          <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMoney(totalIncome)}</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Órdenes del Día</CardTitle>
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberOrdersOfDay}</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs text-green-600 dark:bg-green-900/50">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600 " />
              {numberOrdersDayComplete} {""}
              completadas
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-xs text-red-600 dark:bg-blue-900/50">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
              {numberOrdersDayPending} {""} pendientes
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberProductWithLowStock}</div>
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-xs text-orange-600 dark:bg-orange-900/50">
            <AlertCircle className="h-4 w-4" />
            Necesitan reabastecimiento
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Deudas Pendientes y Parciales
          </CardTitle>
          <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMoney(moneyPending)}</div>
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-xs text-red-600 dark:bg-red-900/50">
            <Users className="h-4 w-4" />
            {numberDebtsPendingOrPartials} clientes con pagos pendientes o
            parciales
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
