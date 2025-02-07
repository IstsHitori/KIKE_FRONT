import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import DebtorDetails from "./DebtorDetails";
import type { Debtor } from "@/types/debtor";
import { formatMoney } from "@/helpers";

interface DebtorsTableProps {
  debtors: Debtor[];
}

export default function DebtorsTable({ debtors }: DebtorsTableProps) {
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredDebtors = debtors.filter((debtor) => {
    const matchesSearch =
      debtor.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.client.telephone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "todos" ||
      debtor.payment_status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return (
          <Badge variant="destructive" className="hover:bg-red-600">
            Pendiente
          </Badge>
        );
      case "parcial":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Pago Parcial
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="parcial">Pago Parcial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Monto Total</TableHead>
              <TableHead className="text-right">Pendiente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDebtors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2" />
                    <p>No se encontraron deudores</p>
                    {searchTerm && (
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("todos");
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDebtors.map((debtor) => (
                <TableRow
                  key={debtor._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedDebtor(debtor)}
                >
                  <TableCell className="font-medium">
                    {debtor.client.name}
                  </TableCell>
                  <TableCell>{debtor.client.telephone}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatMoney(debtor.total_amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        debtor.pending_amount > 0
                          ? "text-red-500 font-medium"
                          : "text-green-500 font-medium"
                      }
                    >
                      {formatMoney(debtor.pending_amount)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(debtor.payment_status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDebtor(debtor);
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedDebtor}
        onOpenChange={(open) => !open && setSelectedDebtor(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Deuda</DialogTitle>
          </DialogHeader>
          {selectedDebtor && (
            <DebtorDetails
              debtor={selectedDebtor}
              onClose={() => setSelectedDebtor(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
