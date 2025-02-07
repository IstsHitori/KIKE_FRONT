import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { getSystemProducts } from "@/helpers";
import { Calculator, Package, ShoppingCart, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export function StatsCards() {
  //
  const products = useVeterinarieStore((state) => state.products);
  const fetchCategories = useVeterinarieStore((state) => state.fetchCategories);
  const categories = useVeterinarieStore((state) => state.categories);
  //
  const { totalNumProducts, numberProductsLowSotck, totalValueInventory } =
    getSystemProducts(products);

  useEffect(() => {
    const fetch = async () => {
      await fetchCategories();
    };
    fetch();
  }, []);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {totalNumProducts}
          </div>
          <p className="text-xs text-muted-foreground">
            Cantidad total de productos en el inventario
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos Bajos</CardTitle>
          <ShoppingCart className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {numberProductsLowSotck}
          </div>
          <p className="text-xs text-muted-foreground">
            Productos con stock bajo
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <Calculator className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {totalValueInventory}
          </div>
          <p className="text-xs text-muted-foreground">
            Valor total del inventario
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
          <p className="text-xs text-muted-foreground">Categorías activas</p>
        </CardContent>
      </Card>
    </div>
  );
}
