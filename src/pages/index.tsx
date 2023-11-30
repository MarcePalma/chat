import { useContext, useEffect } from "react";
import { UserContext } from "@/Context/userContex";
import { useRouter } from "next/router";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Verifica si el usuario está autenticado (puede ajustarse según tu lógica)
    if (!user || !user.token) {
      // Si no está autenticado, redirige a la página de registro
      router.push("/auth/registrarse");
    } else {
      // Si está autenticado, redirige a la página de chat
      router.push("/chat");
    }
  }, [user, router]);

  // No necesitas renderizar nada en la página de inicio, ya que la redirección ocurrirá antes

  return null;
}
