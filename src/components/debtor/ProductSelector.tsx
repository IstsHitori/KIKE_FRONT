import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { formatMoney } from "@/helpers";

interface ProductSelectorProps {
  products: Product[];
  onSelect: (product: Product) => void;
  selectedId?: string;
}

export function ProductSelector({
  products,
  onSelect,
  selectedId,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedProduct = products.find(
    (product) => product._id === selectedId
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct ? selectedProduct.name : "Seleccionar producto..."}
          <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredProducts.map(
            (product) =>
              product.stock > 0 && (
                <div
                  key={product._id}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    selectedId === product._id &&
                      "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onSelect(product);
                    setOpen(false);
                  }}
                >
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-slate-700">
                      stock: <span>{product.stock}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <div className="text-sm font-medium">
                    {formatMoney(product.price)}
                  </div>
                  {selectedId === product._id && (
                    <CheckIcon className="ml-2 h-4 w-4" />
                  )}
                </div>
              )
          )}
          {filteredProducts.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6">
              No se encontraron productos
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
