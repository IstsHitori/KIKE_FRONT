import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDashboard } from "@/hooks/useDashboard";
import { MINIUM_STOCK_PRODUCT } from "@/helpers";
import { Link } from "react-router-dom";

export function StockAlerts() {
  const { products } = useDashboard();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <CardTitle>Alertas de Stock</CardTitle>
              <CardDescription>
                Productos que requieren reabastecimiento
              </CardDescription>
            </div>
          </div>
          <Link
            to={"/app/productos"}
            className="flex text-sm items-center border rounded-lg p-1 px-3 hover:bg-zinc-50 transition-all"
          >
            Ver inventario
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map(
            (prod) =>
              prod.stock < MINIUM_STOCK_PRODUCT && (
                <div key={prod._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{prod.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-lg">
                          {prod.category.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {prod.stock}/{MINIUM_STOCK_PRODUCT} unidades
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="destructive"
                      className="rounded-lg px-2 py-1"
                    >
                      Bajo Stock
                    </Badge>
                  </div>
                  <Progress
                    value={parseInt(
                      ((prod.stock / MINIUM_STOCK_PRODUCT) * 100).toFixed(0)
                    )}
                    className="h-2"
                  />
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
