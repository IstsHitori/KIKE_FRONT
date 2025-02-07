import { Minus, Plus, Trash2, ShoppingCart, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { InfoOrder } from "@/types/oder";
import { formatMoney, getTotalToPay } from "@/helpers";
import { paymentMethods, paymentStatus } from "@/data/paymentMethods";
import { toast } from "react-toastify";

export function CartSummary() {
  //
  const items = useVeterinarieStore((state) => state.items);
  const services = useVeterinarieStore((state) => state.services);
  const updateQuantity = useVeterinarieStore((state) => state.updateQuantity);
  const removeItem = useVeterinarieStore((state) => state.removeItem);
  const createOrder = useVeterinarieStore((state) => state.createOrder);
  const fetchProducts = useVeterinarieStore((state) => state.fetchProducts);
  const products = useVeterinarieStore((state) => state.products);
  //
  const initalState: InfoOrder = {
    nitCustomer: 0,
    nameCustomer: "",
    payment_method: "efectivo",
    paymentStatus: "pago",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [infoOrder, setInfoOrder] = useState<InfoOrder>(initalState);
  //
  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      const searchProduct = products.find((index) => index._id === productId);
      if (!searchProduct) {
        return;
      }
      if (newQuantity > searchProduct.stock) {
        toast.error("No hay más stock de este producto");
        return;
      }
      updateQuantity(productId, newQuantity);
    }
  };
  //
  const handleCheckout = async () => {
    await createOrder(infoOrder);
    await fetchProducts();
    setInfoOrder(initalState);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="relative group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-muted hover:from-muted"
        >
          <ShoppingCart className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
          Carrito
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg transition-transform group-hover:scale-110">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl border-l">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-primary" />
            Carrito de Venta
          </SheetTitle>
          <SheetDescription>
            Revisa los productos y completa los datos del cliente para finalizar
            la venta
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {items.length > 0 ? (
              <motion.div
                key="cart-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span>Productos Seleccionados</span>
                    <Badge variant="secondary" className="rounded-md">
                      {items.length}
                    </Badge>
                  </h3>
                  <div className="rounded-lg border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.product} className="group">
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium group-hover:text-primary transition-colors">
                                  {item.nameProduct}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 transition-all hover:border-primary"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product,
                                      item.quantity,
                                      -1
                                    )
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center tabular-nums font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 transition-all hover:border-primary"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product,
                                      item.quantity,
                                      1
                                    )
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium">
                              {formatMoney(item.price * item.quantity)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  //Remover item
                                  removeItem(item.product);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-end pt-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total a Pagar
                      </span>
                      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        {formatMoney(getTotalToPay(items, services))}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Datos del Cliente</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="customerName"
                        className="text-muted-foreground"
                      >
                        Nombre del Cliente
                      </Label>
                      <Input
                        id="customerName"
                        placeholder="Ingrese el nombre completo"
                        value={infoOrder.nameCustomer ?? ""}
                        onChange={(e) =>
                          setInfoOrder({
                            ...infoOrder,
                            nameCustomer: e.target.value,
                          })
                        }
                        className="transition-all border-muted-foreground/20 focus:border-primary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="customerNit"
                        className="text-muted-foreground"
                      >
                        NIT
                      </Label>
                      <Input
                        id="customerNit"
                        type="number"
                        placeholder="Ingrese el NIT"
                        value={infoOrder.nitCustomer ?? ""}
                        onChange={(e) =>
                          setInfoOrder({
                            ...infoOrder,
                            nitCustomer: e.target.valueAsNumber,
                          })
                        }
                        className="transition-all border-muted-foreground/20 focus:border-primary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="paymentMethod"
                        className="text-muted-foreground"
                      >
                        Método de pago
                      </Label>

                      <Select
                        name="paymentMethod"
                        onValueChange={(e) =>
                          setInfoOrder({
                            ...infoOrder,
                            payment_method:
                              e === "efectivo" ? "efectivo" : "transferencia",
                          })
                        }
                        defaultValue={"efectivo"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((paymentMethod) => (
                            <SelectItem
                              key={paymentMethod.id}
                              value={paymentMethod.value}
                            >
                              {paymentMethod.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="paymentStatus"
                        className="text-muted-foreground"
                      >
                        Estado de la orden
                      </Label>

                      <Select
                        name="paymentStatus"
                        onValueChange={(e) =>
                          setInfoOrder({
                            ...infoOrder,
                            paymentStatus: e as
                              | "pago"
                              | "parcial",
                          })
                        }
                        defaultValue={infoOrder.paymentStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatus.map((payment_status) => (
                            <SelectItem
                              key={payment_status.id}
                              value={payment_status.value}
                            >
                              {payment_status.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                  onClick={handleCheckout}
                  disabled={!infoOrder?.nameCustomer || !infoOrder?.nitCustomer}
                >
                  Completar Venta
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <div className="rounded-full bg-muted p-4">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">El carrito está vacío</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Agrega productos para comenzar una venta. Los productos
                    aparecerán aquí.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
