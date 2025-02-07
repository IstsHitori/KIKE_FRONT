import { Navigate, Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { useVeterinarieStore } from "../stores/useVeterinarieStore";
import { useEffect } from "react";
import { SidebarNav } from "@/components/AsideBar-navegation";
import { useNavigate } from "react-router-dom";
const RouteProtected = () => {
  const navigate = useNavigate();
  //---
  const token = useVeterinarieStore((state) => state.token);
  //---

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <main className="max-h-screen flex-col md:flex-row flex">
      {token ? (
        <>
          <SidebarNav />
          <div className="w-full">
            <div className=" bg-white p-2">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <Navigate to={"/"} />
      )}
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
    </main>
  );
};

export default RouteProtected;
