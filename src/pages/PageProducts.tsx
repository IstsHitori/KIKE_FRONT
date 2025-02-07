import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryForm } from "@/components/category/AddCategoryForm";
import { AddProductForm } from "@/components/product/AddProductForm";
import { ProductTable } from "@/components/product/ProductTable";
import { CategoryTable } from "@/components/category/CategoryTable";
import { SiteHeader } from "@/components/product/SiteHeader";
import { StatsCards } from "@/components/product/StatsCards";

export default function PageProducts() {
  return (
    <div className=" bg-gradient-to-b from-background to-muted/20">
      <SiteHeader />
      <main className="container xl:max-h-[600px] 2xl:max-h-[950px] mx-auto overflow-y-auto py-4">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Inventario de productos
            </h1>
            <p className="text-muted-foreground text-lg">
              Gestiona tu inventario y visualiza las estadísticas del taller
            </p>
          </div>
          <StatsCards />
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12 items-stretch">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Inventario
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Categorías
              </TabsTrigger>
              <TabsTrigger
                value="add-product"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Nuevo Producto
              </TabsTrigger>
              <TabsTrigger
                value="add-category"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Nueva Categoría
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <ProductTable />
            </TabsContent>
            <TabsContent value="categories">
              <CategoryTable />
            </TabsContent>
            <TabsContent value="add-product">
              <AddProductForm />
            </TabsContent>
            <TabsContent value="add-category">
              <AddCategoryForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
