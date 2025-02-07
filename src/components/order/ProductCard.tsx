import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { formatMoney } from "@/helpers";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { Item } from "@/types/oder";
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  //
  const addItemToCar = useVeterinarieStore((state) => state.addItemToCar);
  //
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-b from-card to-muted/20">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="line-clamp-2 leading-tight">
                {product.name}
              </CardTitle>
              <CardDescription className="font-mono bg-muted px-2 py-0.5 rounded-md inline-block text-xs">
                {product.code}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="capitalize shrink-0 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {product.category.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border transition-colors hover:bg-muted/50">
              <span className="text-muted-foreground font-medium">Marca</span>
              <span className="font-semibold">{product.brand}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border transition-colors hover:bg-muted/50">
              <span className="text-muted-foreground font-medium">Peso</span>
              <span className="font-semibold">{product.weight}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border transition-colors hover:bg-muted/50">
              <span className="text-muted-foreground font-medium">Stock</span>
              <Badge variant={product.stock < 10 ? "destructive" : "default"}>
                {product.stock} unidades
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium">
              Precio
            </span>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {formatMoney(product.price)}
            </span>
          </div>
          <Button
            size="lg"
            className="flex items-center gap-2 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
            onClick={() => {
              // Añadir feedback visual
              const itemToAdd: Item = {
                product: product._id,
                nameProduct: product.name,
                price: product.price,
                quantity: 1,
              };
              addItemToCar(itemToAdd,product.stock);
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
