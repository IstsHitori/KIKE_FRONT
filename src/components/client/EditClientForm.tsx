import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import type { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditClientFormProps {
  client: Client;
  onSave: () => void;
  onCancel: () => void;
}

export function EditClientForm({
  client,
  onSave,
  onCancel,
}: EditClientFormProps) {
  const updateClient = useVeterinarieStore((state) => state.updateClient);
  const [isLoading, setIsLoading] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState({
    _id: client._id,
    name: client.name,
    nit: client.nit,
    telephone: client.telephone,
    isDebtor: client.isDebtor,
    date: client.date,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateClient(clientToUpdate);
      onSave();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre completo</Label>
        <Input
          id="nombre"
          value={clientToUpdate.name}
          onChange={(e) =>
            setClientToUpdate((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cedula">Cédula</Label>
        <Input
          id="cedula"
          value={clientToUpdate.nit}
          onChange={(e) =>
            setClientToUpdate((prev) => ({ ...prev, nit: +e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          value={clientToUpdate.telephone}
          onChange={(e) =>
            setClientToUpdate((prev) => ({
              ...prev,
              telephone: e.target.value,
            }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="estado-deuda">Cliente con deuda?</Label>
        <Select
          defaultValue={clientToUpdate.isDebtor ? "si" : "no"}
          onValueChange={(value) =>
            setClientToUpdate((prev) => ({
              ...prev,
              isDebtor: value === "si",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">Sin Deuda</SelectItem>
            <SelectItem value="si">Con Deuda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
