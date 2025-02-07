import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  Search,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { ConfirmDialog } from "./ConfirmDialog";
import { EditProductDialog } from "./EditProductDialog";
import { EditProduct, Product } from "@/types/product";
import { DataTablePagination } from "../category/DataTablePagination";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { formatMoney } from "@/helpers";

const ITEMS_PER_PAGE = 5;

type SortDirection = "asc" | "desc" | null;
type SortField = "name" | "price" | null;

export function ProductTable() {
  //
  const fetchProducts = useVeterinarieStore((state) => state.fetchProducts);
  const fetchCategories = useVeterinarieStore((state) => state.fetchCategories);
  const products = useVeterinarieStore((state) => state.products);
  const categories = useVeterinarieStore((state) => state.categories);
  const updateProduct = useVeterinarieStore((state) => state.updateProduct);
  const deleteProduct = useVeterinarieStore((state) => state.deleteProduct);
  //

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<null | EditProduct>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Aquí iría la lógica para eliminar el producto
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
      setProductToDelete(null);
    }else{
      toast.error("No se ha seleccionado un producto a eliminar")
    }
  };

  const handleEditClick = (product: Product) => {
    const {
      name,
      price,
      stock,
      brand,
      weight,
      category,
      code,
      description,
      _id,
    } = product;

    const productToUpdate: EditProduct = {
      name,
      price: price.toString(),
      stock: stock.toString(),
      brand,
      weight,
      category: category.name,
      code,
      description,
      _id,
    };
    setProductToEdit(productToUpdate);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (values: EditProduct) => {
    // Aquí iría la lógica para guardar los cambios del producto
    const idCategory =
      categories.find(
        (cat) => cat.name.toLowerCase() === values.category.toLowerCase()
      )?._id || "67684d8caff98c32362fdbdb";
    values.category = idCategory;
    await updateProduct(values);
    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "todos" ||
      product.category.name.toLowerCase() ===
        categories
          .find((cat) => cat.name === selectedCategory)
          ?.name.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    }

    return 0;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  //
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);
  //
  useEffect(() => {
    const fetch = async () => {
      await fetchProducts();
      await fetchCategories();
    };
    fetch();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Productos</CardTitle>
          <CardDescription>
            Gestiona y visualiza todos los productos del taller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedCategory !== "todos" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Mostrando productos de:
                </span>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {
                    categories.find((cat) => cat.name === selectedCategory)
                      ?.name
                  }
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("todos")}
                  className="h-8 px-2 text-xs"
                >
                  Mostrar todos
                </Button>
              </div>
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                      >
                        Nombre
                        {sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("price")}
                      >
                        Precio
                        {sortField === "price" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.stock < 20 ? "destructive" : "secondary"
                            }
                            className="font-semibold"
                          >
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell className="font-semibold">
                          {formatMoney(product.price)}
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {product.code}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(product)}
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />

      {productToEdit && (
        <EditProductDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setProductToEdit(null);
          }}
          onSave={handleEditSave}
          product={productToEdit}
          categories={categories}
        />
      )}
    </>
  );
}
