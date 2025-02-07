import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import RouteProtected from "./layouts/RouteProtected";
import Dashboard from "./pages/Dashboard";
import PageClients from "./pages/PageClients";
import PageDebtors from "./pages/PageDebtors";
import PageOrders from "./pages/PageOrders";
import PageProducts from "./pages/PageProducts";
import PagePurchases from "./pages/PagePurchases";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/app",
    element: <RouteProtected />,
    children: [
      {
        path: "/app/dashboard",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/app/clientes",
        element: <PageClients />,
      },
      {
        path: "/app/deudores",
        element: <PageDebtors />,
      },
      {
        path: "/app/ordenes",
        element: <PageOrders />,
      },
      {
        path: "/app/compras",
        element: <PagePurchases />,
      },
      {
        path: "/app/productos",
        element: <PageProducts />,
      },
    ],
  },
]);
