import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon } from "lucide-react";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";
import { useNavigate } from "react-router-dom";
import clientAxios from "@/config/axios";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLogin, setDataLogin] = useState({
    user: "",
    password: "",
  });

  const token = useVeterinarieStore((state) => state.token);
  const setToken = useVeterinarieStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await clientAxios.post("/auth/login", dataLogin);

      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem("kike-token", data);
        setToken(localStorage.getItem("kike-token") as string);
      }
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/app/dashboard");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <Card className="w-full max-w-sm border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium text-center">
            Iniciar sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Usuario
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  placeholder="Ingresa tu usuario"
                  onChange={(e) =>
                    setDataLogin({ ...dataLogin, user: e.target.value })
                  }
                  required
                  className="pl-9 h-10 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  onChange={(e) =>
                    setDataLogin({ ...dataLogin, password: e.target.value })
                  }
                  required
                  className="pl-9 pr-9 h-10 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
