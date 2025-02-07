import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BikeIcon as Motorcycle,
  Users,
  Phone,
  Search,
  CircleDollarSign,
} from "lucide-react";
import { ModalAddClient } from "@/components/client/ModalAddClient";
import { ClientDetails } from "@/components/client/ClientDetails";
import { Pagination } from "@/components/client/Pagination";
import { Client } from "@/types/client";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

const ITEMS_PER_PAGE = 8;

export default function ClientesTable() {
  //
  const fetchClients = useVeterinarieStore((state) => state.fetchClients);
  const clients = useVeterinarieStore((state) => state.clients);
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nit.toString().includes(searchTerm) ||
      client.telephone.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const currentClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  //
  const clientsWithDebts = useMemo(
    () =>
      clients.reduce((sum, client) => (client.isDebtor ? sum + 1 : sum + 0), 0),
    [clients]
  );
  const debtFreeClient = useMemo(
    () =>
      clients.reduce(
        (sum, client) => (!client.isDebtor ? sum + 1 : sum + 0),
        0
      ),
    [clients]
  );
  //

  useEffect(() => {
    const fetch = async () => {
      await fetchClients();
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 md:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-primary">
              <Motorcycle className="h-8 w-8" strokeWidth={1.5} />
              Taller de Motos
            </h2>
            <p className="text-muted-foreground text-lg">
              Sistema de Gestión de Clientes
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-none shadow-2xl bg-card">
          <CardHeader className="border-b bg-muted/30 rounded-t-lg space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl font-bold">
                  Lista de Clientes
                </CardTitle>
                <CardDescription className="text-base">
                  Mostrando {currentClients.length} de {filteredClients.length}{" "}
                  clientes
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    className="pl-9 w-full sm:w-[300px] pr-4 h-10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <ModalAddClient />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[250px] font-semibold text-base">
                      Nombre
                    </TableHead>
                    <TableHead className="font-semibold text-base">
                      Cédula
                    </TableHead>
                    <TableHead className="font-semibold text-base hidden sm:table-cell">
                      Teléfono
                    </TableHead>
                    <TableHead className="font-semibold text-base">
                      ¿Tiene Deuda?
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClients.map((client) => (
                    <TableRow
                      key={client._id}
                      className="hover:bg-muted/50 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                          <span className="group-hover:text-primary transition-colors">
                            {client.name}
                          </span>
                          <span className="sm:hidden flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.telephone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono group-hover:border-primary transition-colors"
                        >
                          {client.nit}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {client.telephone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={`
                            transition-colors flex items-center gap-1 w-fit
                            ${
                              client.isDebtor
                                ? "bg-red-500/80 hover:bg-red-500"
                                : "bg-green-500/80 hover:bg-green-500"
                            }
                          `}
                        >
                          <CircleDollarSign className="h-3 w-3" />
                          {client.isDebtor ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Numero total de clientes
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con deudas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientsWithDebts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes con pagos pendientes
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin deudas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{debtFreeClient}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes al día
              </p>
            </CardContent>
          </Card>
        </div>

        <ClientDetails
          client={selectedClient}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </div>
  );
}
