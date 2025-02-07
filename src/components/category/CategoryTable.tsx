import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
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
import { ConfirmDialog } from "../product/ConfirmDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { DataTablePagination } from "./DataTablePagination";
import { Category } from "@/types/category";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { getNumberProductsInCat } from "@/helpers";

const ITEMS_PER_PAGE = 5;

export function CategoryTable() {
  //
  const fetchCategories = useVeterinarieStore((state) => state.fetchCategories);
  const categories = useVeterinarieStore((state) => state.categories);
  const products = useVeterinarieStore((state) => state.products);
  const updateCategory = useVeterinarieStore((state) => state.updateCategory);
  const deleteCategory = useVeterinarieStore((state) => state.deleteCategory);
  //

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = categories.slice(startIndex, endIndex);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Aquí iría la lógica para eliminar la categoría
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } else {
      toast.error("No se ha seleccionado una categoria a eliminar");
    }
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (values: Category) => {
    // Aquí iría la lógica para guardar los cambios de la categoría
    await updateCategory(values);
    setEditDialogOpen(false);
    setCategoryToEdit(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchCategories();
    };
    fetch();
  }, []);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>
            Gestiona las categorías de productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => (
                  <TableRow
                    key={category._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      {getNumberProductsInCat(category.name, products)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(category)}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(category._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoría"
        description="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer y afectará a todos los productos asociados."
      />

      {categoryToEdit && (
        <EditCategoryDialog
          isOpen={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setCategoryToEdit(null);
          }}
          onSave={handleEditSave}
          category={categoryToEdit}
        />
      )}
    </>
  );
}
