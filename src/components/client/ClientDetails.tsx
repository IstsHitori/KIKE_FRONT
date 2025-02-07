import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  Phone,
  Calendar,
  Pencil,
  IdCard,
} from "lucide-react";
import { EditClientForm } from "./EditClientForm";
import type { Client } from "@/types/client";
import { formatDate } from "@/helpers";
import { DeleteClientDialog } from "./DeleteClientDialog";

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetails({
  client,
  open,
  onOpenChange,
}: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!client) return null;
  const handleDeleteSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <DialogTitle className="text-2xl font-bold">
              {isEditing ? "Editar Cliente" : "Información del Cliente"}
            </DialogTitle>
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>

                <DeleteClientDialog
                  clientName={client.name}
                  idClient={client._id}
                  onDelete={handleDeleteSuccess}
                />
              </>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          <EditClientForm
            client={client}
            onSave={() => {
              setIsEditing(false);
              // Aquí se actualizaría el estado global/local con la nueva información
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid gap-6">
            {/* Información Principal */}
            <div className="grid gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{client.name}</h3>
                  <Badge variant="outline" className="mt-1 font-mono">
                    <IdCard />
                    {client.nit}
                  </Badge>
                </div>
                <Badge
                  variant="default"
                  className={`${
                    client.isDebtor
                      ? "bg-red-500/80 hover:bg-red-500"
                      : "bg-green-500/80 hover:bg-green-500"
                  } flex items-center gap-1`}
                >
                  <CircleDollarSign className="h-3 w-3" />
                  {client.isDebtor ? "Con Deuda" : "Sin Deuda"}
                </Badge>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {client.telephone}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Cliente desde: {formatDate(client.date)}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
