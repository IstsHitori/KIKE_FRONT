import { Separator } from "@/components/ui/separator";
import { ProductsGrid } from "@/components/order/ProductsGrid";
import { CartSummary } from "@/components/order/CartSummary";
import { useEffect } from "react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
export default function PageOrders() {
  const fetchProducts = useVeterinarieStore((state) => state.fetchProducts);
  useEffect(() => {
    const fetch = async () => {
      await fetchProducts();
    };
    fetch();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container py-3 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Productos
            </h1>
            <p className="text-muted-foreground ">
              Explora nuestra selección de productos para tu moto
            </p>
          </div>
          <CartSummary />
        </div>
        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        <ProductsGrid />
      </div>
    </div>
  );
}
