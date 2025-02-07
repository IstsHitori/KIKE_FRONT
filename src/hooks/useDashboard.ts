import { MINIUM_STOCK_PRODUCT } from "@/helpers";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { useEffect } from "react";

export function useDashboard() {
  const orders = useVeterinarieStore((state) => state.orders);
  const products = useVeterinarieStore((state) => state.products);
  const debtors = useVeterinarieStore((state) => state.debtors);
  const fetchOrders = useVeterinarieStore((state) => state.fetchOrders);
  const fetchProducts = useVeterinarieStore((state) => state.fetchProducts);
  const fetchDebtors = useVeterinarieStore((state) => state.fetchDebtors);
  const isEqualDate = (date: string) => {
    const inputDate = new Date(date);
    const today = new Date();

    return (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    );
  };

  //Ingresos totales
  const totalIncome = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );
  //Ordenes del día
  const numberOrdersOfDay = orders.filter((order) =>
    isEqualDate(order.date)
  ).length;
  const numberOrdersDayComplete = orders.reduce(
    (sum, order) => (isEqualDate(order.date) ? sum + 1 : sum + 0),
    0
  );
  const numberOrdersDayPending = debtors.reduce(
    (sum, order) =>
      isEqualDate(order.date) && order.payment_status === "pendiente"
        ? sum + 1
        : sum + 0,
    0
  );
  //Stock bajo
  const numberProductWithLowStock = products.reduce(
    (sum, product) =>
      product.stock < MINIUM_STOCK_PRODUCT ? sum + 1 : sum + 0,
    0
  );
  //Deudas pendientes
  const moneyPending = debtors.reduce(
    (sum, order) => sum + order.pending_amount,
    0
  );
  const numberDebtsPendingOrPartials = debtors.length;
  const numberDebtsPending = debtors.reduce(
    (sum, debt) => (debt.payment_status == "pendiente" ? sum + 1 : sum + 0),
    0
  );
  const numberDebtsPartial = debtors.reduce(
    (sum, debt) => (debt.payment_status === "parcial" ? sum + 1 : sum + 0),
    0
  );
  // Ordenes
  const percentajeOrdersPaid =
    (orders.length / (orders.length + debtors.length)) * 100;
  const percentajeOrdersPending =
    (numberDebtsPending / (orders.length + debtors.length)) * 100;
  const percentajeOrdersPartial =
    (numberDebtsPartial / (orders.length + debtors.length)) * 100;

  const ordersAndDebts = debtors.concat(orders);
  useEffect(() => {
    const fetch = async () => {
      await fetchOrders();
      await fetchProducts();
      await fetchDebtors();
    };
    fetch();
  }, []);

  return {
    totalIncome,
    numberOrdersOfDay,
    moneyPending,
    numberDebtsPending,
    numberOrdersDayComplete,
    numberOrdersDayPending,
    numberProductWithLowStock,
    percentajeOrdersPaid,
    percentajeOrdersPartial,
    percentajeOrdersPending,
    numberDebtsPendingOrPartials,
    ordersAndDebts,
    products,
  };
}
