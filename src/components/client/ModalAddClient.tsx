import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

export function ModalAddClient() {
  const createClient = useVeterinarieStore((state) => state.createClient);
  const [open, setOpen] = useState(false);
  const [clientToCreate, setClientToCreate] = useState({
    name: "",
    nit: 0,
    telephone: "",
    isDebtor: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el nuevo cliente
    await createClient(clientToCreate);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Ingrese los datos del nuevo cliente. Todos los campos son
            requeridos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              onChange={(e) =>
                setClientToCreate((prev) => ({ ...prev, name: e.target.value }))
              }
              id="nombre"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              onChange={(e) =>
                setClientToCreate((prev) => ({ ...prev, nit: +e.target.value }))
              }
              id="cedula"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              onChange={(e) =>
                setClientToCreate((prev) => ({
                  ...prev,
                  telephone: e.target.value,
                }))
              }
              id="telefono"
              type="tel"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estado-deuda">Cliente con deuda?</Label>
            <select
              onChange={(e) =>
                setClientToCreate((prev) => ({
                  ...prev,
                  isDebtor: e.target.value === "si" ? true : false,
                }))
              }
            >
              <option value="no">No</option>
              <option value="si">Si</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-4">
            Registrar Cliente
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
