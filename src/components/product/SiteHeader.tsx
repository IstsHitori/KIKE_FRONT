import { Package2 } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Package2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Taller de Motos</h2>
            <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>
      </div>
    </header>
  )
}

