import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { Order } from "@/types/oder";
import { useEffect } from "react";
export default function usePurchases() {
  //
  const fetchOrders = useVeterinarieStore((state) => state.fetchOrders);
  const orders = useVeterinarieStore((state) => state.orders);
  //
  const isInCurrentMonth = (date: string) => {
    const inputDate = new Date(date);
    const today = new Date();

    return (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth()
    );
  };

  const getLastPurchaseDate = (ordersCopy: Order[]) => {
    if (orders.length === 0) return null;
    
    ordersCopy.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastPurchase = new Date(ordersCopy[0].date);
    const today = new Date();
    const timeDiff = today.getTime() - lastPurchase.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    switch (daysDiff) {
      case 0:
        return "hoy";
      case 1:
        return "ayer";
      default:
        return `hace ${daysDiff} días`;
    }
  };

  const totalOrders = orders.length;
  const ordersOfMonth = orders.reduce(
    (sum, order) => (isInCurrentMonth(order.date) ? sum + 1 : sum + 0),
    0
  );
  const lastPurchaseDate = getLastPurchaseDate([...orders]);
  useEffect(() => {
    const fetch = async () => {
      await fetchOrders();
    };
    fetch();
  }, []);

  return {
    totalOrders,
    ordersOfMonth,
    lastPurchaseDate,
  };
}
