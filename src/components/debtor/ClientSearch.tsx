import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { Client } from "@/types/client";
// Mock clients data

interface ClientSearchProps {
  onSelectClient: (client: Client) => void;
}

export function ClientSearch({ onSelectClient }: ClientSearchProps) {
  //
  const clients = useVeterinarieStore((state) => state.clients);
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = searchTerm
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.telephone.includes(searchTerm) ||
          client.nit.toString().includes(searchTerm)
      )
    : clients;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono o NIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>NIT</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow
                  key={client._id}
                  className={
                    selectedClientId === client._id ? "bg-muted" : undefined
                  }
                >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.telephone}</TableCell>
                  <TableCell>{client.nit}</TableCell>
                  <TableCell>
                    <Button
                      variant={
                        selectedClientId === client._id ? "secondary" : "ghost"
                      }
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedClientId(client._id);
                        onSelectClient(client);
                      }}
                    >
                      {selectedClientId === client._id
                        ? "Seleccionado"
                        : "Seleccionar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {selectedClientId && (
        <div className="mt-4 p-4 border rounded-md bg-muted">
          <h4 className="font-medium mb-2">Cliente Seleccionado:</h4>
          <p className="text-sm">
            {clients.find((c) => c._id === selectedClientId)?.name} - Tel:{" "}
            {clients.find((c) => c._id === selectedClientId)?.telephone}
          </p>
        </div>
      )}
    </div>
  );
}
