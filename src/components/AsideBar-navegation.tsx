import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Menu,
  ChevronDown,
  Package,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import logo from "/logo.svg";
import { Button } from "@/components/ui/button";
interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const navGroups: NavGroup[] = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        path: "/app/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        badge: "Nuevo",
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      {
        title: "Clientes",
        path: "/app/clientes",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Deudores",
        path: "/app/deudores",
        icon: <FolderOpen className="h-5 w-5" />,
      },
      {
        title: "Productos",
        path: "/app/productos",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "Compras",
        path: "/app/compras",
        icon: <BadgeDollarSign className="h-5 w-5" />,
      },
      {
        title: "Crear orden",
        path: "/app/ordenes",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
    ],
  },
];

function NavSection({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        {group.title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen ? "transform rotate-0" : "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="space-y-1">
          {group.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                currentPath === item.path
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.title}
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarNav() {
  const location = useLocation();
  const profile = useVeterinarieStore((state) => state.profile);
  const logout = useVeterinarieStore((state) => state.logoutSesion);
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img width={35} src={logo} alt="" />
          <h1 className="text-xl font-semibold">TALLER KIKE</h1>
        </div>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto">
        <nav className="space-y-6 p-4">
          {navGroups.map((group) => (
            <NavSection
              key={group.title}
              group={group}
              currentPath={location.pathname}
            />
          ))}
        </nav>
      </div>

      <Separator />

      <div className="p-4 flex flex-col gap-5">
        <div className="rounded-lg bg-accent p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {profile.user.charAt(0) + profile.user.charAt(1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncatee">
                {profile.user}
              </p>
              <p className="text-sm text-muted-foreground truncate">TALLER</p>
            </div>
          </div>
        </div>
        <Button onClick={logout} variant={"destructive"} className="w-full">
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para pantallas medianas y grandes */}
      <div className="hidden md:flex h-screen w-72 flex-col left-0 top-0 border-r bg-card">
        <SidebarContent />
      </div>

      {/* Sidebar móvil */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
