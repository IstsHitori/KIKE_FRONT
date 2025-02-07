import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { X, Plus } from "lucide-react";
import { ProductSelector } from "./ProductSelector";
import { ClientSearch } from "./ClientSearch";
import { Product } from "@/types/product";
import { Client } from "@/types/client";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { formatMoney } from "@/helpers";

const productSchema = z.object({
  product: z.string().min(1, "Debe seleccionar un producto"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  price: z.number().min(0, "El precio no puede ser negativo"),
});

const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().min(0, "El precio no puede ser negativo"),
});

const formSchema = z.object({
  client: z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "El nombre es requerido"),
    nit: z.string(),
  }),
  products: z.array(productSchema),
  services: z.array(serviceSchema),
});

interface RegisterDebtFormProps {
  onSuccess: () => void;
}

export default function RegisterDebtForm({ onSuccess }: RegisterDebtFormProps) {
  //
  const products = useVeterinarieStore((state) => state.products) || [];
  const createDebt = useVeterinarieStore((state) => state.createDebt) || [];
  //
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientMode, setClientMode] = useState<"search" | "new">("search");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: {
        name: "",
        nit: "",
      },
      products: [],
      services: [],
    },
  });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { name, nit } = values.client;
      const newDebt = {
        nameCustomer: name,
        nitCustomer: nit,
        products: values.products,
        services: values.services,
        total_amount: calculateTotal(),
      };

      await createDebt(newDebt);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al registrar la deuda");
    } finally {
      setIsSubmitting(false);
    }
  }

  const calculateTotal = () => {
    const watchProducts = form.watch("products") || [];
    const watchServices = form.watch("services") || [];

    const productsTotal = watchProducts.reduce(
      (sum, product) => sum + (product?.price || 0) * (product?.quantity || 0),
      0
    );
    const servicesTotal = watchServices.reduce(
      (sum, service) => sum + (service?.price || 0),
      0
    );
    return productsTotal + servicesTotal;
  };

  const handleProductSelect = (index: number, selectedProduct: Product) => {
    form.setValue(`products.${index}.product`, selectedProduct._id);
    form.setValue(`products.${index}.price`, selectedProduct.price);
  };

  const handleClientSelect = (client: Client) => {
    form.setValue("client.name", client.name);
    form.setValue("client.nit", client.nit.toString());

    // Trigger form validation
    form.trigger(["client.name", "client.nit"]);

    // Show feedback that client was selected
    toast.success(`Cliente seleccionado: ${client.name}`);

    // Show the client info fields
    const clientFields = document.querySelectorAll('[name^="client."]');
    clientFields.forEach((field) => {
      if (field instanceof HTMLInputElement) {
        field.classList.add("border-primary");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => onSubmit(data),
          (errors) => {
            if (errors.client) {
              if (errors.client.name) {
                toast.error(errors.client.name.message);
              }
              if (errors.client.nit) {
                toast.error(errors.client.nit.message);
              }
            }
          }
        )}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue="search"
              value={clientMode}
              onValueChange={(value) =>
                setClientMode(value as "search" | "new")
              }
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="search"
                  id="search"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="search"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Buscar Cliente Existente
                </Label>
              </div>
              <div>
                <RadioGroupItem value="new" id="new" className="peer sr-only" />
                <Label
                  htmlFor="new"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Registrar Nuevo Cliente
                </Label>
              </div>
            </RadioGroup>

            {clientMode === "search" ? (
              <ClientSearch onSelectClient={handleClientSelect} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="client.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client.nit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIT</FormLabel>
                      <FormControl>
                        <Input placeholder="123456-7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Productos</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendProduct({
                      product: "",
                      quantity: 1,
                      price: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {productFields.map((field, index) => (
                  <div key={field.id} className="grid gap-4">
                    <div className="flex gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`products.${index}.product`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Producto</FormLabel>
                            <FormControl>
                              <ProductSelector
                                products={products}
                                selectedId={field.value}
                                onSelect={(product) =>
                                  handleProductSelect(index, product)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`products.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {form.watch(`products.${index}.product`) && (
                      <div className="text-sm text-muted-foreground pl-2">
                        Subtotal:{" "}
                        {formatMoney(
                          (form.watch(`products.${index}.price`) || 0) *
                            (form.watch(`products.${index}.quantity`) || 1)
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {productFields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay productos agregados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Servicios</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendService({ name: "", price: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Servicio
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Servicio</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del servicio"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Precio</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeService(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {serviceFields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay servicios agregados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Total: {formatMoney(calculateTotal())}
          </div>
          <div className="space-x-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Deuda"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
