import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMoney } from "@/helpers";
import { Wallet, BanknoteIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

interface PaymentFormProps {
  debtorId: string;
  pendingAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({
  debtorId,
  pendingAmount,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  //
  const abonateToDebt = useVeterinarieStore((state) => state.abonateToDebt);
  //

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !paymentMethod) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error("Por favor ingrese un monto válido");
      return;
    }

    if (paymentAmount > pendingAmount) {
      toast.error("El monto no puede ser mayor al monto pendiente");
      return;
    }

    setIsSubmitting(true);

    try {
      const abonateData = {
        idDebt: debtorId,
        paymentAmount,
        payment_method: paymentMethod,
      };
      await abonateToDebt(abonateData);

      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "efectivo":
        return <BanknoteIcon className="h-4 w-4" />;
      case "transferencia":
        return <Wallet className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Abono</CardTitle>
        <CardDescription>
          Monto pendiente: {formatMoney(pendingAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Monto a Abonar
            </label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="text-lg"
              max={pendingAmount}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Método de Pago</label>
            <Select onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el método de pago">
                  {paymentMethod && (
                    <span className="flex items-center gap-2">
                      {getPaymentMethodIcon(paymentMethod)}
                      {paymentMethod.charAt(0).toUpperCase() +
                        paymentMethod.slice(1)}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">
                  <span className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4" />
                    Efectivo
                  </span>
                </SelectItem>
                <SelectItem value="transferencia">
                  <span className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Transferencia
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !amount || !paymentMethod}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Procesando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
