import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMoney } from "@/helpers";
import PaymentForm from "./PaymentForm";
import type { Debtor } from "@/types/debtor";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

interface DebtorDetailsProps {
  debtor: Debtor;
  onClose: () => void;
}

export default function DebtorDetails({ debtor, onClose }: DebtorDetailsProps) {
  //
  const markDebtAsPaid = useVeterinarieStore((state) => state.markDebtAsPaid);
  //
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  async function handleMarkAsPaid(debtorId: string) {
    try {
      await markDebtAsPaid(debtorId);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{debtor.client.name}</CardTitle>
              <CardDescription>
                Tel: {debtor.client.telephone} | NIT: {debtor.client.nit}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Fecha: {new Date(debtor.date).toLocaleDateString()}
              </p>
              <Badge
                className={
                  debtor.payment_status.toLowerCase() === "pagado"
                    ? "bg-green-500"
                    : debtor.payment_status.toLowerCase() === "pendiente"
                    ? "bg-red-500"
                    : "bg-orange-500"
                }
              >
                {debtor.payment_status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="items">Productos y Servicios</TabsTrigger>
          <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Deuda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-center md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Monto Total</p>
                  <p className="text-2xl font-bold">
                    {formatMoney(debtor.total_amount)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">Monto Pagado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatMoney(debtor.paid_amount)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">
                    Monto Pendiente
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatMoney(debtor.pending_amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {debtor.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{product.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {product.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatMoney(product.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {debtor.services.map((service) => (
                      <div
                        key={service._id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <p className="font-medium">{service.name}</p>
                        <p className="font-medium">
                          {formatMoney(service.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {debtor.payment_history.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {formatMoney(payment.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{payment.payment_method}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => setShowPaymentForm(true)}
          className="w-full md:w-auto"
        >
          Registrar Abono
        </Button>
        {debtor.pending_amount > 0 && (
          <Button
            variant="secondary"
            onClick={() => handleMarkAsPaid(debtor._id)}
            className="w-full md:w-auto"
          >
            Marcar como Pagado
          </Button>
        )}
      </div>

      {showPaymentForm && (
        <PaymentForm
          debtorId={debtor._id}
          pendingAmount={debtor.pending_amount}
          onSuccess={() => {
            setShowPaymentForm(false);
            onClose();
          }}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
}
