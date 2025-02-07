import { useState } from "react";
import React from "react";
import { Search, AlertCircle, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { formatDate, formatMoney } from "@/helpers";

const ITEMS_PER_PAGE = 3;

export function Purchases() {
  //
  const orders = useVeterinarieStore((state) => state.orders);
  const ordersFilters = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar órdenes según término de búsqueda
  const filteredOrders = ordersFilters.filter(
    (order) =>
      order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.nit.toString().includes(searchTerm)
  );

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // Obtener las órdenes de la página actual
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Resetear a la primera página cuando se realiza una búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generar array de páginas para la paginación
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-background rounded-lg border px-3 focus-within:ring-2 focus-within:ring-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o NIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm border-0 focus-visible:ring-0 px-0"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Alert variant="default" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se encontraron compras</AlertTitle>
          <AlertDescription>
            {searchTerm
              ? `No se encontraron compras para "${searchTerm}". Intenta con otros términos de búsqueda.`
              : "No hay compras registradas en el sistema"}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-h-[680px] overflow-y-auto">
            {currentOrders.map((order) => (
              <Card
                key={order._id}
                className="relative overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  {/* Encabezado del ticket */}
                  <div className="text-center mb-4">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-bold text-lg tracking-tight">
                      TALLER DE MOTOS
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Comprobante de Compra
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Información del cliente y fecha */}
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="col-span-2 font-medium">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="col-span-2 font-medium">
                        {order.client.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-muted-foreground">NIT:</span>
                      <span className="col-span-2 font-medium">
                        {order.client.nit}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-muted-foreground">No. Compra:</span>
                      <span className="col-span-2 font-medium">
                        #{order._id}
                      </span>
                    </div>
                    {/* <div className="grid grid-cols-3">
                      <span className="text-muted-foreground">Método:</span>
                      <span className="col-span-2 font-medium">
                        {order.payment_method}
                      </span>
                    </div> */}
                  </div>

                  <Separator className="my-4" />

                  {/* Productos */}
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-12 font-medium text-muted-foreground">
                      <div className="col-span-6">Producto</div>
                      <div className="col-span-2 text-right">Cant.</div>
                      <div className="col-span-4 text-right">Total</div>
                    </div>
                    {order.products.map((product) => (
                      <div key={product._id} className="grid grid-cols-12">
                        <div
                          className="col-span-6 truncate"
                          title={product.product.name}
                        >
                          {product.product.name}
                        </div>
                        <div className="col-span-2 text-right">
                          {product.quantity}
                        </div>
                        <div className="col-span-4 text-right tabular-nums">
                          {formatMoney(product.price * product.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Total */}
                  <div className="text-sm">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="tabular-nums">
                        {formatMoney(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Pie del ticket */}
                  <div className="text-center text-xs text-muted-foreground mt-6 space-y-1">
                    <p className="font-medium">¡Gracias por su compra!</p>
                    <p>Tel: (502) 2222-2222</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page as number);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
