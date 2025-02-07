import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import { Bounce, ToastContainer } from "react-toastify";
export default function AuthLayout() {
  return (
    <main className=" min-h-screen flex items-center justify-center">
      <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      /> 
      <Outlet />
    </main>
  );
}
