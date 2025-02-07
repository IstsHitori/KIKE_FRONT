import { Category } from "@/types/category";
import { Item, Order, Service } from "@/types/oder";
import { Product } from "@/types/product";
import { subMonths, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formattedDate = (date: string) =>
  new Date(date).toLocaleDateString("es-es", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
export const formatDate = (date: string) => {
  return `${formattedDate(date)} ${formattedTime(date)}`;
};
export const formattedTime = (date: string) =>
  new Date(date).toLocaleTimeString("es-es", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
export const formatMoney = (money: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(money);
export const getSystemProducts = (products: Product[]) => {
  //Obtener el total de productos en el inventario
  const totalNumProducts = products.length;
  //Obtener los productos con stock bajo
  const numberProductsLowSotck = products.filter(
    (prod) => prod.stock < 10
  ).length;
  //Obtener el valor total del inventario
  const totalValueInventory = formatMoney(
    products.reduce((sum, prod) => sum + prod.price * prod.stock, 0)
  );
  return {
    totalNumProducts,
    numberProductsLowSotck,
    totalValueInventory,
  };
};
export const getNumberProductsInCat = (
  category: Category["name"],
  products: Product[]
) => {
  return products.reduce(
    (sum, index) => (sum += index.category.name === category ? 1 : 0),
    0
  );
};
export const getTotalToPay = (items: Item[], services: Service[]): number => {
  const totalMoneyItems = items.reduce(
    (sum, index) => sum + index.price * index.quantity,
    0
  );
  const totalMoneyServices = services.reduce(
    (sum, index) => sum + index.price,
    0
  );
  return totalMoneyItems + totalMoneyServices;
};
export const getOrdersWithDebts = (orders: Order[]) => {
  return orders.filter((order) => order.pending_amount > 0);
};
export const getOrdersWithOutDebts = (orders: Order[]) => {
  return orders.filter((order) => order.pending_amount === 0);
};
function getLastMonths(count: number) {
  return Array.from({ length: count })
    .map((_, i) => {
      const date = subMonths(new Date(), i);
      return format(date, "yyyy-MM");
    })
    .reverse();
}

export function calculateMonthlyRevenue(orders: Order[]) {
  const lastSixMonths = getLastMonths(6);
  const monthlyRevenue = new Map();

  // Inicializar todos los meses con 0
  lastSixMonths.forEach((monthYear) => {
    monthlyRevenue.set(monthYear, 0);
  });

  // Sumar los ingresos por mes
  orders.forEach((order) => {
    const monthYear = order.date.substring(0, 7);
    if (monthlyRevenue.has(monthYear)) {
      monthlyRevenue.set(
        monthYear,
        monthlyRevenue.get(monthYear) + order.paid_amount
      );
    }
  });

  // Convertir a formato para el gráfico con nombres de meses en español
  return Array.from(monthlyRevenue.entries()).map(([date, total]) => ({
    name:
      format(parseISO(date + "-01"), "MMM", { locale: es })
        .charAt(0)
        .toUpperCase() +
      format(parseISO(date + "-01"), "MMM", { locale: es }).slice(1),
    total: total,
  }));
}

export const MINIUM_STOCK_PRODUCT = 10;
