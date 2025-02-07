import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { AddCategorySchema } from "@/schema/Category";
import * as v from "valibot";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

export function AddCategoryForm() {
  //
  const createCategory = useVeterinarieStore((state) => state.createCategory);
  //

  const form = useForm<v.InferInput<typeof AddCategorySchema>>({
    resolver: valibotResolver(AddCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: v.InferInput<typeof AddCategorySchema>) {
    const hasValueEmpty = Object.values(values).some((val) => val === "");
    if (hasValueEmpty) {
      toast.error("No debe haber ningún campo vacío");
      return;
    }
    await createCategory(values)
    toast.success(`Se agregó la categoría ${values.name}`);
    form.reset();
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Agregar Nueva Categoría</CardTitle>
        <CardDescription className="text-base">
          Crea una nueva categoría para organizar tus productos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la categoría"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Agregar Categoría
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
